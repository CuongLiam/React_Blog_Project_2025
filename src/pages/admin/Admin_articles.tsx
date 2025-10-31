
import React from "react";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";
import { Link } from "react-router";
import axios from "axios";
import { Modal, message } from "antd";

// ...existing code...


import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchArticles } from "../../store/slices/articleSlice";
import type { AppDispatch } from "../../store";

const ITEMS_PER_PAGE = 5;

export default function AdminArticles() {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector((state: any) => state.articles);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusEdits, setStatusEdits] = useState<{[id:string]: string}>({});

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  // Status change handler (API PATCH)
  const handleStatusChange = async (id: string, value: string) => {
    setStatusEdits({ ...statusEdits, [id]: value });
    try {
      await axios.patch(`${import.meta.env.VITE_SV_HOST}/articles/${id}`, { status: value });
      dispatch(fetchArticles());
      message.success("Đã cập nhật trạng thái bài viết!");
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  // Edit handler (prompt + PATCH)
  const handleEdit = async (article: any) => {
    Modal.confirm({
      title: "Chỉnh sửa bài viết",
      content: (
        <div>
          <div className="mb-2">Tiêu đề hiện tại: <b>{article.title}</b></div>
          <input id="edit-title" defaultValue={article.title} className="w-full border rounded px-2 py-1 mb-2" />
          <div className="mb-2">Nội dung hiện tại:</div>
          <textarea id="edit-content" defaultValue={article.content} className="w-full border rounded px-2 py-1" rows={4} />
        </div>
      ),
      okText: "Lưu",
      cancelText: "Hủy",
      async onOk() {
        const newTitle = (document.getElementById("edit-title") as HTMLInputElement)?.value;
        const newContent = (document.getElementById("edit-content") as HTMLTextAreaElement)?.value;
        try {
          await axios.patch(`${import.meta.env.VITE_SV_HOST}/articles/${article.id}`, {
            title: newTitle,
            content: newContent,
          });
          dispatch(fetchArticles());
          message.success("Đã cập nhật bài viết!");
        } catch (err) {
          message.error("Lỗi khi cập nhật bài viết!");
        }
      },
    });
  };

  // Delete handler (Antd Modal + DELETE)
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá bài viết này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await axios.delete(`${import.meta.env.VITE_SV_HOST}/articles/${id}`);
          dispatch(fetchArticles());
          message.success("Đã xoá bài viết!");
        } catch (err) {
          message.error("Lỗi khi xoá bài viết!");
        }
      },
    });
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
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Đang tải bài viết...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : currentArticles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Không có bài viết nào.</div>
                ) : (
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
                      {currentArticles.map((article: any) => (
                        <tr key={article.id} className="border-b hover:bg-gray-50 ">
                          <td className="py-6 px-2">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-20 h-16 object-cover rounded-lg border"
                            />
                          </td>
                          <td className="py-3 px-2 font-medium">{article.title}</td>
                          <td className="py-3 px-2">{article.category}</td>
                          <td className="py-3 px-2 text-gray-600 truncate max-w-xs">{article.content}</td>
                          <td className="py-3 px-2">{article.status}</td>
                          <td className="py-3 px-2">
                            <select
                              value={statusEdits[article.id] ?? article.status}
                              onChange={e => handleStatusChange(article.id, e.target.value)}
                              className="border rounded px-2 py-1"
                            >
                              <option value="public">Công khai</option>
                              <option value="private">Riêng tư</option>
                            </select>
                          </td>
                          <td className="py-3 px-2 flex gap-2">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => handleEdit(article)}
                            >Sửa</button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={() => handleDelete(article.id)}
                            >Xoá</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
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
