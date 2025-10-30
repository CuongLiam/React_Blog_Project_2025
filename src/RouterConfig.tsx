import React from 'react'
import { Route, Routes } from 'react-router'
import Signin from './pages/auth/Signin'
import Signup from './pages/auth/Signup'
import HomePage from './pages/home/HomePage'
import ArticleDetail from './pages/home/Article_detail'
import MyPosts from './pages/home/MyPosts'
import AddArticle from './pages/home/AddArticle'
import AdminCustomer from './pages/admin/Admin_customer'
import AdminEntries from './pages/admin/Admin_entries'
import AdminArticles from './pages/admin/Admin_articles'
import ProtectedAdmin from './pages/auth/ProtectedAdmin'

export default function RouterConfig() {
  return (
    <Routes>
        {/* <Route path='/login' element={<Signin>
          <HomePage/>
        </Signin>}></Route> */}
        <Route path='/register' element={<Signup/>}></Route>

        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/article/:id' element={<ArticleDetail/>}></Route>
        <Route path='/my-posts' element={<MyPosts/>}></Route>
        <Route path='/add-article' element={<AddArticle/>}></Route>
        
        {/* Admin Routes */}
        <Route path='/admin' element={
          <Signin>
            <AdminCustomer/>
          </Signin>
        }></Route>
        <Route path='/admin/customers' element={<AdminCustomer/>}></Route>
        <Route path='/admin/entries' element={<AdminEntries/>}></Route>
        <Route path='/admin/articles' element={<AdminArticles/>}></Route>

    </Routes>
  )
}
