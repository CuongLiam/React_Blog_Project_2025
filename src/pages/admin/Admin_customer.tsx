import { useState } from 'react'
import AdminHeader from '../../layouts/admin/Header'
import Sidebar_menu from '../../layouts/admin/Sidebar_menu'

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Olivia Rhye",
    username: "@olivia",
    email: "olivia@untitledui.com",
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/1"
  },
  {
    id: 2,
    name: "Phoenix Baker",
    username: "@phoenix",
    email: "phoenix@untitledui.com", 
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/2"
  },
  {
    id: 3,
    name: "Lana Steiner",
    username: "@lana",
    email: "lana@untitledui.com",
    status: "hoạt động", 
    avatar: "https://avatar.iran.liara.run/public/3"
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    username: "@demi",
    email: "demi@untitledui.com",
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/4"
  },
  {
    id: 5,
    name: "Candice Wu",
    username: "@candice", 
    email: "candice@untitledui.com",
    status: "hoạt động",
    avatar: "CW",
    isInitials: true
  },
  {
    id: 6,
    name: "Natali Craig",
    username: "@natali",
    email: "natali@untitledui.com",
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/6"
  },
  {
    id: 7,
    name: "Drew Cano", 
    username: "@drew",
    email: "drew@untitledui.com",
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/7"
  },
  {
    id: 8,
    name: "Orlando Diggs",
    username: "@orlando",
    email: "orlando@untitledui.com",
    status: "hoạt động",
    avatar: "OD",
    isInitials: true
  },
  {
    id: 9,
    name: "Andi Lane",
    username: "@andi", 
    email: "andi@untitledui.com",
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/9"
  },
  {
    id: 10,
    name: "Kate Morrison",
    username: "@kate",
    email: "kate@untitledui.com", 
    status: "hoạt động",
    avatar: "https://avatar.iran.liara.run/public/10"
  }
];

export default function Admin_customer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 7;

  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar_menu activeItem="users" />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team members</h1>
                <p className="text-sm text-blue-600">100 users</p>
              </div>
              
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search user"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
              {/* Table Header */}
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="font-medium text-gray-700">Name</span>
                    <i className="fas fa-sort text-gray-400 text-xs"></i>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Status</span>
                      <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="font-medium text-gray-700">Email address</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Actions</span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Name */}
                      <div className="col-span-4 flex items-center gap-3">
                        {user.isInitials ? (
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                            {user.avatar}
                          </div>
                        ) : (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="col-span-3">
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center gap-3">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          block
                        </button>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          unblock
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
              >
                &lt; Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-2 py-1 rounded ${currentPage === idx + 1 ? "bg-purple-100 text-purple-700 font-bold" : "text-gray-600 hover:text-purple-700"}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
