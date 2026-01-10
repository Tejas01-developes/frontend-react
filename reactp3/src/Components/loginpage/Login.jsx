
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router'
const Login = () => {
const[field,setfield]=useState({email:"",password:""})

const navigate=useNavigate()
const handlechange=(e)=>{
    setfield({
        ...field,[e.target.name]:e.target.value
    })
}

const handlelogin=async()=>{
    if(!field.email || !field.password){
        return alert("fill all the fields")
    }
    try{
        const payload={
           email:field.email,
           password:field.password 
        }
const logurl=await axios.post("http://localhost:3000/apis/login",payload,{withCredentials:true});
const access=logurl.data.access;

if(logurl.data.success){
navigate("/home")
localStorage.setItem("access",access && token)
localStorage.setItem("email",field.email)
}
    }catch(err){
        console.log("error",err)
    }
}














  return (
    <div>
  <div>


<input type="email" placeholder='Email' name='email' value={field.email} onChange={handlechange} />
<input type="password" placeholder='password' name='password' value={field.password} onChange={handlechange} />
<button onClick={handlelogin}>Login</button> <hr />
<button onClick={()=>window.location.href="http://localhost:3000/auth/google"}>Continue with google</button>


  </div>

    </div>
  )
}

export default Login
