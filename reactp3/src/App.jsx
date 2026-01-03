import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Register from './Components/Registerpage/Register'
import Login from './Components/loginpage/Login'
import Home from './Components/Homepage/Home'
import Add from './addfriends/Add'


const App = () => {
  return (
    <div>
      <Routes>
{/* 1.code for register page */}
<Route path='register' element={<Register/>}/>

{/* 2.code for login page */}
<Route path='/' element={<Login/>}/>
{/* 3.code for the home page */}
<Route path='/home' element={<Home/>}/>
{/* 4.code for add friends */}
<Route element={<Add/>} path='/add'/>


      </Routes>
    </div>
  )
}

export default App
