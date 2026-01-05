import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {io} from 'socket.io-client'
import { useRef } from 'react'
const Home = () => {
    const navigate=useNavigate()
    const[frd,setfrd]=useState([])
    const[slt,setslt]=useState()
    const[msg,setmsg]=useState("")
    const[doc,setdoc]=useState(null)
    const[chat,setchat]=useState([])
    const socketref=useRef(null)
    const loggedemail=localStorage.getItem("email");
    const navigateadd=()=>{
        navigate("/add")
    }

    useEffect(()=>{
      const getfriends=async()=>{
        try{
      const listurl=await axios.get("http://localhost:3000/apis/get",{
        withCredentials:true
      })
      if(listurl.data.success){
      console.log(listurl.data.friends)
      setfrd(listurl.data.friends)
      }
      }catch(err){
        console.log("error",err)
      }
      }
      getfriends();
      },[])
  
const handleselect=(friend)=>{
setslt(friend);
setmsg("")
setchat([])
}






const sendmessage=async()=>{
  if(!msg && !doc){
    alert("write message")
    return
  }
  try{
  const formdata=new FormData();
  formdata.append("reciver",slt.friends_email);
  if(msg){
    formdata.append("message",msg)
  }
  if(doc){
    formdata.append("file",doc)
  }
const sendurl=await axios.post("http://localhost:3000/apis/send",formdata,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}})
if(socketref.current){
socketref.current.emit("sendmessage",{
  sender:loggedemail,
  reciver:slt.friends_email,
  type:doc ? "file": "text",
  msg,
  filename:doc?.name
})
}
setchat((prev)=>[
...prev,
doc
?{
  sender:loggedemail,
  type:"file",
  filename:doc.name,
  msg
}:{
  sender:loggedemail,
  type:"text",
  msg
}
])

if(sendurl.data.success){

setmsg("")
}
  }catch(err){
    console.log("error",err)
  }
}


useEffect(()=>{
if(!slt) return
const getmsg=async()=>{
try{
  
const geturl=await axios.get("http://localhost:3000/apis/getmsg",{params:{
  friend:slt.friends_email,
},withCredentials:true});

if(geturl.data.success){
  setchat(geturl.data.messages)
}

}catch(err){
  console.log("error",err);
}
}

getmsg();
},[slt])




useEffect(()=>{
  socketref.current=io("http://localhost:3000",{
    withCredentials:true
  })





socketref.current.emit("join",loggedemail)




socketref.current.on("recivermessage",(data)=>{
  if(data.sender === loggedemail)return 
  setchat((prev)=>[
    ...prev,
    {
      sender:data.sender,
      msg:data.msg
    }
  ])
})
return ()=>{socketref.current.disconnect();
}
},[]);








  return (
    <div>
      <div className='addcontact'>
        <h2>Add user</h2>
        <img src="https://static.thenounproject.com/png/100859-200.png" className='contect' onClick={navigateadd} />
        <h1 className='heading'>Chat Room</h1>
      </div>
      <hr />
<div className='chatcontainer'>
<div className='friends'>
{
frd.map((fr,i)=>(
  <div key={i} className='select' onClick={()=>handleselect(fr)}>
    {fr.friends_email}

  </div>
))



}
</div>


<div className='chat'>
  {
slt && (
<div>
<textarea name="textarea" className='textarea' placeholder='Write the message' value={msg} onChange={(e)=>setmsg(()=>e.target.value)}/>
<button onClick={sendmessage}>send</button>
<input type="file"  onChange={(e)=>setdoc(e.target.files[0])}  />
<div>
{
  chat.map((ms,i)=>(
    <div key={i} className={`direction ${ms.sender === loggedemail ? "right" : "left"}`}>
      {ms.type === "file" ? (
        <a href={ms.msg} target='_blank' rel='noreferrer'>{ms.filename}</a>
      ):(
        ms.msg
      )}
    

    </div>
  ))
}
</div>
</div>
)
  }
</div>

</div>

    </div>
  )
}

export default Home
