import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router'
const Register = () => {
const[field,setfield]=useState({name:"",email:"",password:""})
const navigate=useNavigate()
const handlechange=(e)=>{
    setfield({
        ...field,[e.target.name]:e.target.value
    })
}


const handleadd=async()=>{
    if(!field.name || !field.email || !field.password){
        alert("fill all the fields")
        return
    }
try{
    const payload={
        name:field.name,
        email:field.email,
        password:field.password
    }
const addurl=await axios.post("http://localhost:3000/apis/register",payload);
if(addurl.data.success){
    navigate("/")
}
}catch(err){
    console.log("error",err);
}
}




  return (
    <div>
  <div>

<input type="text" placeholder='Full name' name='name' value={field.name} onChange={handlechange} />
<input type="email" placeholder='Email' name='email' value={field.email} onChange={handlechange} />
<input type="password" placeholder='password' name='password' value={field.password} onChange={handlechange} />
<button onClick={handleadd}>Make account</button>



  </div>

    </div>
  )
}

export default Register
