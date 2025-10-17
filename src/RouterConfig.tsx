import React from 'react'
import { Route, Routes } from 'react-router'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import HomePage from './pages/home/HomePage'

export default function RouterConfig() {
  return (
    <Routes>
        <Route path='/login' element={<Signin/>}></Route>
        <Route path='/register' element={<Signup/>}></Route>


        <Route path='/' element={<HomePage/>}></Route>

    </Routes>
  )
}
