import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./errorHandler.js";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: `${__dirname}/.env`,
});

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.get("/",(_,res)=>{
  res.send("working!!");
})
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    ` ⭐⭐server is running in ${process.env.NODE_ENV} Mode, & made on port ${PORT} ⭐⭐`
  )
);

const socket_io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

socket_io.on("connection", (socket) => {
  console.log("Socket are in Action");
  socket.on("room_setup", (chatId) => {
    //! const { userNames: chatId } = userData;
    //usernames should be SORTED for universal use
    socket.join(chatId);
    console.log(`connected to the chat between:  ${chatId}`)
    //! socket.emit(`connected to the chat between:  ${chatId}`);
  });
  socket.on("new_message", (newMsg) => {
    const { chatId, content,sender } = newMsg;
    // console.log(newMsg)
    console.log("the chatId",chatId)
    socket.emit("message_sent_success",content)
    socket.in(chatId).emit("new_message_to_users",newMsg);
    
  });
  // socket.on("leave_chat",(data)=>{
  //   socket.leave(data.chatId)
  //   console.log(`${JSON.stringify(data)} has left the chat`)
  // })
  socket.on("disconnect",(data)=>{
    
    console.log(`${data} has left the Chat`)
  })
});
app.use(express.static(path.join(__dirname, "../Socket.io_frontend/dist")));
process.on("unhandledRejection", (err, promise) => {
  console.log(`😡😡 Error: ${err.message} 😡😡`);
  server.close(() => process.exit(1));
});

// app.get("/", (_, res) => {
//   res.send("Server is ACTIVE  ");
// });
