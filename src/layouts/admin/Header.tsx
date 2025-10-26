import React from 'react'

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        {/* Mail notification icon */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <i className="far fa-envelope text-xl"></i>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Bell notification icon */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <i className="far fa-bell text-xl"></i>
          </button>
        </div>

        {/* User avatar */}
        <div className="flex items-center">
          <img
            src="https://avatar.iran.liara.run/public/girl"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </div>
    </header>
  )
}
