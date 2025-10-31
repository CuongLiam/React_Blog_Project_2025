import React, { useState, useEffect } from 'react';
import AdminHeader from '../../layouts/admin/Header';
import Sidebar_menu from '../../layouts/admin/Sidebar_menu';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';
import type { AppDispatch } from '../../store';

export default function Admin_customer() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: any) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users based on search
  let filteredUsers = users.filter((user: any) =>
    (user.displayName || user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users by name
  filteredUsers = filteredUsers.sort((a: any, b: any) => {
    const nameA = (a.displayName || a.username || "").toLowerCase();
    const nameB = (b.displayName || b.username || "").toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortClick = () => {
    setSortAsc((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar_menu activeItem="users" />
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team members</h1>
                <p className="text-sm text-blue-600">{users.length} users</p>
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
                  <div className="col-span-4 flex items-center gap-2 cursor-pointer" onClick={handleSortClick}>
                    <span className="font-medium text-gray-700">Name</span>
                    <i className={`fas fa-sort${sortAsc ? '-alpha-down' : '-alpha-up'} text-gray-400 text-xs`}></i>
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
                {loading ? (
                  <div className="px-6 py-4 text-center text-gray-500">Loading...</div>
                ) : error ? (
                  <div className="px-6 py-4 text-center text-red-500">{error}</div>
                ) : currentUsers.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500">No users found.</div>
                ) : (
                  currentUsers.map((user: any) => (
                    <div key={user.id} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Name */}
                        <div className="col-span-4 flex items-center gap-3">
                          <img
                            src={user.avatar || `https://avatar.iran.liara.run/public/${user.id}`}
                            alt={user.displayName || user.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{user.displayName || user.username}</div>
                            <div className="text-sm text-gray-500">{user.role}</div>
                          </div>
                        </div>
                        {/* Status */}
                        <div className="col-span-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "ACTIVE" ? "bg-green-100 text-green-800" : user.status === "BAN" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
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
                  ))
                )}
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
  );
}
