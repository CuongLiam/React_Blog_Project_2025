import React from 'react';
import { Dropdown, Menu } from 'antd';

// const handleLogout = () => {
//   localStorage.removeItem('userLogin');
//   window.location.href = '/login';
// };

// const menu = (
//   <Menu>
//     <Menu.Item key="logout" onClick={handleLogout}>
//       <span className="text-red-500">Log out</span>
//     </Menu.Item>
//   </Menu>
// );

export default function Header() {
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
        {/* <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight"> */}
          <div className="flex items-center cursor-pointer">
            <img
              src="https://avatar.iran.liara.run/public/girl"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </div>
        {/* </Dropdown> */}
      </div>
    </header>
  );
}
