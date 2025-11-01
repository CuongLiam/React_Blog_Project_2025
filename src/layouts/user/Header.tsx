import { Dropdown } from "antd";
import React, { useState } from "react";
import type { MenuProps } from "antd";

import { items as defaultItems } from "./Header_avt_items";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ searchQuery = "", onSearchChange }: HeaderProps = {}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  // Get user info from localStorage
  let avatar = "https://avatar.iran.liara.run/public";
  let displayName = "Rikkei";
  let email = "rikkei@gmail.com";
  try {
    const userLogin = localStorage.getItem("userLogin");
    if (userLogin) {
      const userData = JSON.parse(userLogin);
      // Try to get from userData.data[0] or userData[0] or userData
      const user = userData?.data?.[0] || userData?.[0] || userData;
      displayName = user.displayName || user.username || displayName;
      email = user.email || email;
      avatar = user.avatar || avatar;
    }
  } catch {}

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchChange) {
      onSearchChange(localSearch);
    }
  };

  // Clone dropdown items and inject user info
  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold">{displayName}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    ...defaultItems.filter(i => i?.key !== "profile"),
  ];

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex items-center h-14 px-6 gap-8">
        {/* logo */}
        <div className="text-sm font-semibold tracking-wide whitespace-nowrap">
          ( •̀ ω •́ )✧ RIKKEI EDU BLOG
        </div>

        {/* search */}
        <div className="relative flex-1 max-w-[1080px]">
          <input
            type="text"
            placeholder="Search for articles..."
            value={localSearch}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            className="w-full h-9 rounded-md border border-gray-300 bg-white pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ width: "1080px" }}
          />
          <button 
            onClick={() => onSearchChange && onSearchChange(localSearch)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* buttons */}
        {/* <div className="flex ml-25 items-center gap-3">
          <button
            type="button"
            className="h-9 px-4 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 cursor-pointer"
          >
            Sign Up
          </button>
          <button
            type="button"
            // className="h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
            className="h-9 px-4 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-100 cursor-pointer"
          >
            Sign In
          </button>
        </div> */}


        {/* Avatar Dropdown */}
        <Dropdown
          className="ml-27"
          menu={{ items }}
          placement="bottomLeft"
          trigger={["hover"]}
          overlayClassName="!p-0"
        >
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none flex items-center justify-center">
            <img
              // src="https://avatar.iran.liara.run/public"
              src={avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
