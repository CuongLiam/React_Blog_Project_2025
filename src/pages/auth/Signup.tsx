import React from "react";
import { Link } from "react-router";

export default function Signup() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/src/assets/Auth/Signup_background.png')",
        backgroundSize: "cover",
        // backgroundPosition: "center",
      }}
    >
      {/* Left side - Welcome text */}
      <div className="absolute left-20 top-1/2 -translate-y-1/2 text-white z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to the website</h1>
        <p className="text-base text-gray-200 mt-8">RIKKEI EDUCATION</p>
      </div>

      {/* Right side - Signup form */}
      <div className="absolute right-75 top-1/2 -translate-y-1/2 bg-gray-100 rounded-lg shadow-2xl p-10 w-[492px] z-10">
        <form className="space-y-4">
          {/* First name and Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="block text-xs text-gray-700 mt-1">First name</label>
            </div>
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="block text-xs text-gray-700 mt-1">Last name</label>
            </div>
          </div>

          {/* Email address */}
          <div>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Email address</label>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Password</label>
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Confirm Password</label>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Sign up
          </button>

          {/* Login link */}
          <div className="text-sm mt-3">
            <span className="text-gray-800 font-bold">Already have an account? </span>
            <Link to="/login" className="text-red-500 font-semibold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}