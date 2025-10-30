import { message, Modal } from "antd";
import React, { type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import type { UserSigninDTO } from "../../apis/core/user.api";
import { Apis } from "../../apis";

export default function Signin({
    children
} :{
    children: ReactNode
}) {

  // let isAdmin = false;
  let isAdmin = localStorage.getItem("userLogin");


    if(isAdmin){
        return (
            <>
            {children}
            </>
        )
    }
  
  async function handleSignIn (e : FormEvent){
    e.preventDefault()

    let data : UserSigninDTO = {
      emailOrUserName: (e.target as any).emailOrUserName.value,
      password: (e.target as any).password.value,
    }
    // console.log("data", data);  
    
    try {
      let result = await Apis.user.signin(data)

      // console.log("result", result);

      localStorage.setItem("userLogin", JSON.stringify(result.data))
      Modal.confirm({
        title: "Successfully logged in!",
        content: result.message,
        onOk: ()=>{
          window.location.reload()
        },
        onCancel: ()=>{
          window.location.reload()
        }
      })
      
    } catch (error) {
      console.log("err", error);
      
      message.error(error.message)
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-4 text-blue-600 font-semibold text-lg">( •̀ ω •́ )✧ RIKKEI EDU BLOG</div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
          {/* Left side - Illustration */}
          <div className="flex items-center justify-center">
            <img
              src="src\assets\Auth\logo_sign_in.png"
              alt="login illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center max-w-md">
            {/* Social Login */}
            <div className="mb-6 flex flex-row gap-5">
              <p className="text-sm text-gray-700 mb-3 flex items-center">Sign in with</p>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="w-10 h-10 bg-blue-400 text-white rounded flex items-center justify-center hover:bg-blue-500">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="w-10 h-10 bg-blue-700 text-white rounded flex items-center justify-center hover:bg-blue-800">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 font-semibold">Or</p>
            </div>

            {/* Login Form */}
            <form onSubmit={(e)=>{
              handleSignIn(e)
            }} className="space-y-4">
              {/* Email */}
              <div>
                <input
                name="emailOrUserName"
                  type="text"
                  placeholder="Enter a valid email address"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label className="block text-xs text-gray-700 mt-1">Email address</label>
              </div>

              {/* Password */}
              <div>
                <input
                name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label className="block text-xs text-gray-700 mt-1">Password</label>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>

              {/* Register link */}
              <div className="text-sm">
                <span className="text-gray-800">Don't have an account? </span>
                <Link to="/register" className="text-red-500 font-semibold hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
        <p className="text-sm">Copyright © 2025, All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>
  );
}