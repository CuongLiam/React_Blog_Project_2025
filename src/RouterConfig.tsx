import React from 'react'
import { Route, Routes } from 'react-router'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import HomePage from './pages/home/HomePage'
import ArticleDetail from './pages/home/Article_detail'
import MyPosts from './pages/home/MyPosts'
import AddArticle from './pages/home/AddArticle'

export default function RouterConfig() {
  return (
    <Routes>
        <Route path='/login' element={<Signin/>}></Route>
        <Route path='/register' element={<Signup/>}></Route>

        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/article/:id' element={<ArticleDetail/>}></Route>
        <Route path='/my-posts' element={<MyPosts/>}></Route>
        <Route path='/add-article' element={<AddArticle/>}></Route>

    </Routes>
  )
}
