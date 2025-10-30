import React from 'react'
import Header from './layouts/user/Header'

import "./main.css"
import Footer from './layouts/user/Footer'
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin'
import RouterConfig from './RouterConfig'

import '@ant-design/v5-patch-for-react-19';

export default function App() {
  return (
    <RouterConfig/>
  )
}
