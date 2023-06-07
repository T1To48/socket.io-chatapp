import React,{useState} from 'react'
import Chat from './components/Chat.page'
function App() {
const [mount, setMount] = useState(true)
  return (
  <div> 
    <button onClick={()=>setMount(!mount)}>switch</button>
      <div>
        {mount?<Chat/>:<div>not mounted</div>}
      </div>
     
     </div>
  )
}

export default App
