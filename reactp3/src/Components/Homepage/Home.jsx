import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const Home = () => {
    const navigate=useNavigate()
    const[frd,setfrd]=useState([])
    const[slt,setslt]=useState()
    const[msg,setmsg]=useState("")
    const[doc,setdoc]=useState(null)
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
}




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
<textarea name="textarea" className='textarea' placeholder='Write the message' value={msg} onChange={(e)=>setmsg(e.target.value)}/>
<button>send</button>
<input type="file" value={doc} onChange={(e)=>setdoc(()=>e.target.value)}  />
</div>
)
  }
</div>

</div>

    </div>
  )
}

export default Home
