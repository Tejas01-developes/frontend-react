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
    const[onlineusers,setonlineusers]=useState(new Set())
    const[status,setstatus]=useState("offline")
    const[typing,settyping]=useState(false);
    const typingtimeout=useRef(null);
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
  msg,
  
})
}
setchat((prev)=>[
...prev,
// doc
// ?{
//   sender:loggedemail,
//   msg
// }:
{
  sender:loggedemail,
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

socketref.current.on("online",(users)=>{
  setonlineusers(new Set(users))
})


socketref.current.on("typing", ({ sender }) => {
  if (sender === slt?.friends_email) {
    settyping(true);
  }
});

socketref.current.on("stop_typing", ({ sender }) => {
  if (sender === slt?.friends_email) {
    settyping(false);
  }
});




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

useEffect(()=>{
  if(!slt) return 
  const isonline=onlineusers.has(slt.friends_email)
  setstatus(isonline ? "online":"offline")
},[onlineusers,slt])







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
  <h1>{`chat with ${slt.friends_email}`} {status} {typing && "typing..."}</h1>
  <textarea
  className='textarea'
  value={msg}
  placeholder='Write the message'
  onChange={(e) => {
    setmsg(e.target.value);

    // emit typing
    if (socketref.current && slt) {
      socketref.current.emit("typing", {
        sender: loggedemail,
        reciver: slt.friends_email
      });

      // debounce stop typing
      if (typingtimeout.current) {
        clearTimeout(typingtimeout.current);
      }

      typingtimeout.current = setTimeout(() => {
        socketref.current.emit("stop_typing", {
          sender: loggedemail,
          reciver: slt.friends_email
        });
      }, 800);
    }
  }}
/>
<button onClick={sendmessage}>send</button>
<input type="file"  onChange={(e)=>setdoc(e.target.files[0])}  />
<div>
{
  chat.map((ms,i)=>(
    <div key={i} className={`direction ${ms.sender === loggedemail ? "right" : "left"}`}>
      {ms.type === "file" ? (
        <a href={ms.msg} download >{ms.msg}</a>
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
