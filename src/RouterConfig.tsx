import React from 'react'
import { Route, Routes } from 'react-router'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'

export default function RouterConfig() {
  return (
    <Routes>
        <Route path='/login' element={<Signin/>}></Route>
        <Route path='/register' element={<Signup/>}></Route>


    </Routes>
  )
}
