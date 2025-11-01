import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export default function Header() {
  // Get admin info from localStorage
  const getUserData = () => {
    try {
      const data = localStorage.getItem('userLogin');
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed?.data?.[0] || null;
    } catch (error) {
      console.error('Error parsing userLogin from localStorage:', error);
      return null;
    }
  };

  const userLogin = getUserData();
  const adminName = userLogin?.displayName || 'Admin User';
  const adminEmail = userLogin?.email || 'admin@example.com';
  const adminAvatar = userLogin?.avatar || 'https://avatar.iran.liara.run/public/girl';
  const adminRole = userLogin?.role || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('userLogin');
    window.location.reload();
  };

  const dropdownMenu: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="py-2 px-2 min-w-[240px]">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={adminAvatar}
              alt="Admin Avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{adminName}</h4>
              <p className="text-xs text-gray-500">{adminEmail}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs text-blue-600 font-medium">{adminRole}</span>
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <span className="text-red-500 font-medium">
          <i className="fas fa-sign-out-alt mr-2"></i>
          Log out
        </span>
      ),
      onClick: handleLogout,
    },
  ];
  
  return (
    <header className="w-full bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        {/* Mail notification icon */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <i className="far fa-envelope text-xl"></i>
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

        {/* User avatar dropdown */}
        <Dropdown menu={{ items: dropdownMenu }} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src={adminAvatar}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
