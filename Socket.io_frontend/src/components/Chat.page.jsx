import React, { useState,useEffect } from "react";
import  io  from "socket.io-client";
import { genChatId } from "../helpers/genChatId.jsx";
import { ENDPOINT } from "../constants.jsx";
let socket;
const Chat = () => {
  
  //__________________________________
  
  const friendName_reciever = "Benny Solmon";
  const chatId = "TaufiqZayyad_BennySolmon";
  //__________________________________
const [userName,setUserName] = useState("");
const [recieverName, setRecieverName] = useState("")
const [typedMsg, setTypedMsg] = useState("")
const [messages, setMessages] = useState(["!!hardCoded!!"])
  useEffect(() => {
    socket = io("http://localhost:8888");
    // socket.emit("room_setup", chatId);
    socket.on("new_message_to_users",(newMsg)=>{
    const { chatId, content,sender } = newMsg;
      setMessages((prev)=>[...prev,content]);
    
    })

    //!when the reciever recieves the message => then we can display
    //! by the sender to make sure the message was succefully sent to the reciever
    socket.on("message_sent_success",(sentMsg)=>{
       setMessages((prev)=>[...prev,sentMsg]);
    })
     return()=>{
    //  socket.emit("leave_chat",{
    //   chatId:genChatId([userName,recieverName]),
    //   userName:userName
    //  })
     socket.disconnect()
     }
  }, []);
  return (
    <div>
      <h1>type friend Name </h1>
      <input placeholder="userName" type="text" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
      <input  placeholder="friendName" type="text" value={recieverName} onChange={(e)=>setRecieverName(e.target.value)}/>
      <button onClick={()=>socket.emit("room_setup", genChatId([userName,recieverName]))}>connect</button>

<hr/>
      <input
        type="text"
        value={typedMsg}
        onChange={(e) => setTypedMsg(e.target.value)}
      />
      <button
        onClick={() =>{
          socket.emit("new_message", {
            chatId: genChatId([userName,recieverName]),
            content: typedMsg,
            sender:userName
          })
          setTypedMsg("")
        }
        }
      >
        send Message
      </button>

      <h1>the conversation</h1>
      {messages.map((msg)=><div key={Math.random()}><h3 >{msg}</h3> <br/></div>)}
    </div>
  );
};

export default Chat;
