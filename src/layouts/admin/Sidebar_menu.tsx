import React from 'react'
import { Link } from 'react-router'

interface SidebarMenuProps {
  activeItem?: string;
}

export default function Sidebar_menu({ activeItem = 'users' }: SidebarMenuProps) {
  const menuItems = [
    {
      id: 'users',
      label: 'Manage Users',
      icon: 'fas fa-users',
      href: '/admin/customers'
    },
    {
      id: 'entries',
      label: 'Manage Entries',
      icon: 'fas fa-folder',
      href: '/admin/entries'
    },
    {
      id: 'articles',
      label: 'Manage Article',
      icon: 'fas fa-newspaper',
      href: '/admin/articles'
    }
  ];

  return (
    <div className="w-60 bg-blue-100 min-h-screen p-4">
      <div className="space-y-1">
        {/* Menu Items */}
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              activeItem === item.id
                ? 'bg-blue-200 shadow-sm'
                : 'hover:bg-blue-200'
            }`}
          >
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <i className={`${item.icon} text-white text-xs`}></i>
            </div>
            <span className="text-blue-700 font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Log out */}
        <div onClick={()=>{
          localStorage.removeItem('userLogin');
          window.location.href = '/login';
        }} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-200 rounded-lg cursor-pointer transition-colors mt-4">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <i className="fas fa-sign-out-alt text-white text-xs"></i>
          </div>
          <span className="text-blue-700 font-medium">Log out</span>
        </div>
      </div>
    </div>
  )
}
