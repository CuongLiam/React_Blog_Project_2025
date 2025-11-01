import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import axios from "axios";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";
import { fetchArticles } from "../../store/slices/articleSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import type { AppDispatch } from "../../store";

const ITEMS_PER_PAGE = 5;

export default function AdminArticles() {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector((state: any) => state.articles);
  const { users } = useSelector((state: any) => state.users);
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [statusEdits, setStatusEdits] = useState<{[id:string]: string}>({});

  // Get current user role
  const getCurrentUserRole = () => {
    try {
      const userLogin = localStorage.getItem("userLogin");
      if (userLogin) {
        const userData = JSON.parse(userLogin);
        const user = userData?.data?.[0] || userData?.[0] || userData;
        return user.role || "USER";
      }
    } catch {
      return "USER";
    }
    return "USER";
  };

  const currentUserRole = getCurrentUserRole();

  // Check if current user can edit/delete an article
  const canEditArticle = (article: any) => {
    const articleAuthor = users.find((user: any) => user.id === article.userId);
    if (!articleAuthor) return false;

    const authorRole = articleAuthor.role;

    // USER articles cannot be edited/deleted by ADMIN or MASTER
    if (authorRole === "USER") return false;

    // ADMIN can only edit ADMIN articles
    if (currentUserRole === "ADMIN" && authorRole === "ADMIN") return true;

    // MASTER can edit ADMIN and MASTER articles
    if (currentUserRole === "MASTER" && (authorRole === "ADMIN" || authorRole === "MASTER")) return true;

    return false;
  };

  // Fetch articles and users on mount
  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Computed values
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleStatusChange = async (id: string, value: string) => {
    setStatusEdits((prev) => ({ ...prev, [id]: value }));
    try {
      await axios.patch(`${import.meta.env.VITE_SV_HOST}/articles/${id}`, { status: value });
      dispatch(fetchArticles());
      message.success("Article status updated successfully!");
    } catch {
      message.error("Failed to update article status!");
    }
  };

  const handleEdit = (article: any) => {
    if (!canEditArticle(article)) {
      message.error("You don't have permission to edit this article!");
      return;
    }

    Modal.confirm({
      title: "Edit Article",
      content: (
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              id="edit-title" 
              defaultValue={article.title} 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea 
              id="edit-content" 
              defaultValue={article.content} 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              rows={5} 
            />
          </div>
        </div>
      ),
      okText: "Save",
      cancelText: "Cancel",
      width: 600,
      async onOk() {
        const newTitle = (document.getElementById("edit-title") as HTMLInputElement)?.value;
        const newContent = (document.getElementById("edit-content") as HTMLTextAreaElement)?.value;
        
        if (!newTitle?.trim() || !newContent?.trim()) {
          message.error("Title and content cannot be empty!");
          return;
        }

        try {
          await axios.patch(`${import.meta.env.VITE_SV_HOST}/articles/${article.id}`, {
            title: newTitle,
            content: newContent,
          });
          dispatch(fetchArticles());
          message.success("Article updated successfully!");
        } catch {
          message.error("Failed to update article!");
        }
      },
    });
  };

  const handleDelete = (article: any) => {
    if (!canEditArticle(article)) {
      message.error("You don't have permission to delete this article!");
      return;
    }

    Modal.confirm({
      title: "Delete Article",
      content: "Are you sure you want to delete this article? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await axios.delete(`${import.meta.env.VITE_SV_HOST}/articles/${article.id}`);
          dispatch(fetchArticles());
          message.success("Article deleted successfully!");
        } catch {
          message.error("Failed to delete article!");
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
                to="/admin/add-articles"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                style={{ minWidth: 180 }}
              >
                <i className="fas fa-plus"></i>
                Add New Article
              </Link>
            </div>
            <div className="ml-40">
              <h2 className="text-3xl font-bold text-gray-900">Article Management</h2>
              <p className="text-sm text-gray-500 mt-1">{articles.length} total articles</p>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <i className="fas fa-spinner fa-spin text-3xl text-gray-400 mb-3"></i>
                    <p className="text-gray-500">Loading articles...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <i className="fas fa-exclamation-circle text-3xl text-red-400 mb-3"></i>
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : currentArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="far fa-file-alt text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500">No articles yet</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 font-semibold">Ảnh</th>
                        <th className="py-3 px-2 font-semibold">Tiêu đề</th>
                        <th className="py-3 px-2 font-semibold">Chủ đề</th>
                        <th className="py-3 px-2 font-semibold">Nội dung</th>
                        <th className="py-3 px-2 font-semibold">Vai trò</th>
                        <th className="py-3 px-2 font-semibold">Trạng thái</th>
                        <th className="py-3 px-2 font-semibold">Chỉnh sửa trạng thái</th>
                        <th className="py-3 px-2 font-semibold">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentArticles.map((article: any) => {
                        const author = users.find((user: any) => user.id === article.userId);
                        const authorRole = author?.role || "USER";
                        const roleColor = authorRole === "MASTER" ? "bg-purple-100 text-purple-700" : authorRole === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700";
                        
                        return (
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
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColor}`}>
                              {authorRole}
                            </span>
                          </td>
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
                              className={`px-3 py-1 rounded ${canEditArticle(article) ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                              onClick={() => handleEdit(article)}
                              disabled={!canEditArticle(article)}
                            >Sửa</button>
                            <button
                              className={`px-3 py-1 rounded ${canEditArticle(article) ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                              onClick={() => handleDelete(article)}
                              disabled={!canEditArticle(article)}
                            >Xoá</button>
                          </td>
                        </tr>
                        );
                      })}
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
