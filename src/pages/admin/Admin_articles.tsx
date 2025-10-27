
import React, { useState } from "react";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";
import { articles } from "../../data/fakeData";
import { Link } from "react-router";

const ITEMS_PER_PAGE = 5;

export default function AdminArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusEdits, setStatusEdits] = useState<{[id:number]: string}>({});

  // Pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Status dropdown handler (UI only)
  const handleStatusChange = (id: number, value: string) => {
    setStatusEdits({ ...statusEdits, [id]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <Sidebar_menu activeItem="articles" />
        <div className="flex-1 p-8 flex flex-col items-center max-w-9xl">
          <div className="flex w-full mb-8">
            <div className="flex items-start w-1/4">
              <Link
                to="/add-article"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                style={{ minWidth: 180 }}
              >
                Thêm mới bài viết
              </Link>
            </div>
            <div className="ml-40">
              <h2 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h2>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-2 font-semibold">Ảnh</th>
                      <th className="py-3 px-2 font-semibold">Tiêu đề</th>
                      <th className="py-3 px-2 font-semibold">Chủ đề</th>
                      <th className="py-3 px-2 font-semibold">Nội dung</th>
                      <th className="py-3 px-2 font-semibold">Trạng thái</th>
                      <th className="py-3 px-2 font-semibold">Chỉnh sửa trạng thái</th>
                      <th className="py-3 px-2 font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentArticles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-20 h-16 object-cover rounded-lg border"
                          />
                        </td>
                        <td className="py-3 px-2 font-medium">{article.title}</td>
                        <td className="py-3 px-2">{article.category}</td>
                        <td className="py-3 px-2 text-gray-600 truncate max-w-xs">{article.content}</td>
                        <td className="py-3 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${article.status === "public" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {article.status === "public" ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={statusEdits[article.id] || article.status}
                            onChange={(e) => handleStatusChange(article.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-semibold">Sửa</button>
                            <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
                >
                  &lt; Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2 py-1 rounded ${currentPage === idx + 1 ? "bg-purple-100 text-purple-700 font-bold" : "text-gray-600 hover:text-purple-700"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
    </div>
  );
}
