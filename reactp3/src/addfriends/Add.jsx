import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
const Add = () => {

const[field,setfield]=useState("")
const navigate=useNavigate()
const addfriend=async()=>{
    if (!field){
        return alert("fill the field")
    }
    try{
        const payload={
            email:field
        }
const addurl=await axios.post("http://localhost:3000/apis/add",payload,{
    withCredentials:true
})
if(addurl.data.success){
    alert("user added")
    navigate("/home")
    return
}

    }catch(err){
        console.log("error",err)
    }

}


  return (
    <div>
      <input type="text" placeholder='Email' value={field} onChange={(e)=>setfield(()=>e.target.value)} />
      <button onClick={addfriend}>Add</button>
    </div>
  )
}

export default Add
