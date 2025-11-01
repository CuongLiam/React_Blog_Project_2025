import { useState, useEffect } from "react";
import { Link } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import axios from "axios";
import { uploadImageToCloudinary } from "../../upload/cloudinary";

const ITEMS_PER_PAGE = 6;

const MOODS = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "excited", emoji: "🤩", label: "Excited" },
  { value: "peaceful", emoji: "😌", label: "Peaceful" },
  { value: "anxious", emoji: "😰", label: "Anxious" },
  { value: "stressed", emoji: "😣", label: "Stressed" },
  { value: "grateful", emoji: "🙏", label: "Grateful" },
  { value: "motivated", emoji: "💪", label: "Motivated" },
  { value: "overwhelmed", emoji: "😵", label: "Overwhelmed" },
];

export default function MyPosts() {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    mood: "happy",
    content: "",
    status: "public",
    image: null as File | null,
    currentImageUrl: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const userLogin = localStorage.getItem("userLogin");
      if (userLogin) {
        const userData = JSON.parse(userLogin);
        const user = userData?.data?.[0] || userData?.[0] || userData;
        return user.id || "";
      }
    } catch {
      return "";
    }
    return "";
  };

  const currentUserId = getCurrentUserId();

  // Fetch articles and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SV_HOST}/articles`),
          axios.get(`${import.meta.env.VITE_SV_HOST}/categories`),
        ]);
        setArticles(articlesRes.data);
        setCategories(categoriesRes.data);
      } catch {
        setArticles([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter articles by current user
  const myArticles = articles.filter((article: any) => article.userId === currentUserId);

  // Pagination
  const totalPages = Math.ceil(myArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = myArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Open edit modal
  const handleEditClick = (article: any) => {
    setEditingArticle(article);
    const categoryId = categories.find(c => c.name === article.category)?.id || "";
    setEditFormData({
      title: article.title,
      category: categoryId,
      mood: article.mood || "happy",
      content: article.content,
      status: article.status || "public",
      image: null,
      currentImageUrl: article.image || "",
    });
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingArticle(null);
    setEditFormData({
      title: "",
      category: "",
      mood: "happy",
      content: "",
      status: "public",
      image: null,
      currentImageUrl: "",
    });
  };

  // Handle edit form input changes
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle edit form file change
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData({ ...editFormData, image: e.target.files[0] });
    }
  };

  // Submit edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    setEditLoading(true);
    try {
      // Upload new image if selected
      let imageUrl = editFormData.currentImageUrl;
      if (editFormData.image) {
        imageUrl = await uploadImageToCloudinary(editFormData.image, "articles");
      }

      // Prepare updated article
      const { image, currentImageUrl, ...rest } = editFormData;
      const updatedArticle = {
        ...editingArticle,
        ...rest,
        image: imageUrl,
        category: categories.find(c => c.id === editFormData.category)?.name || editingArticle.category,
      };

      // Update article
      await axios.put(`${import.meta.env.VITE_SV_HOST}/articles/${editingArticle.id}`, updatedArticle);
      
      // Update local state
      setArticles(articles.map((a: any) => a.id === editingArticle.id ? updatedArticle : a));
      
      alert("Article updated successfully!");
      handleCloseEditModal();
    } catch (err) {
      console.error("Edit article error:", err);
      alert("Failed to update article!");
    } finally {
      setEditLoading(false);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (articleId: string) => {
    setDeletingArticleId(articleId);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingArticleId(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingArticleId) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_SV_HOST}/articles/${deletingArticleId}`);
      
      // Update local state
      setArticles(articles.filter((a: any) => a.id !== deletingArticleId));
      
      alert("Article deleted successfully!");
      handleCloseDeleteModal();
      
      // Adjust current page if needed
      const newArticlesCount = myArticles.length - 1;
      const newTotalPages = Math.ceil(newArticlesCount / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("Delete article error:", err);
      alert("Failed to delete article!");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation tabs */}
        <div className="mb-8 flex gap-6 border-b animate-slide-down">
          <Link to="/" className="text-gray-600 pb-2 hover:text-blue-600 transition-colors">
            All blog posts
          </Link>
          <Link to="/my-posts" className="text-blue-600 font-semibold pb-2 border-b-2 border-blue-600">
            All my posts
          </Link>
        </div>

        {/* Add New Article Button */}
        <div className="text-center mb-12">
          <Link
            to="/add-article"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            ADD NEW ARTICLE
          </Link>
        </div>

        {/* My Articles Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            My Articles ({myArticles.length})
          </h2>

          {loading ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <i className="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg mb-4">Loading your articles...</p>
            </div>
          ) : currentArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {currentArticles.map((article: any) => (
                <div
                  key={article.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  <Link to={`/article/${article.id}`}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="p-4">
                    <p className="text-sm text-blue-600 mb-1">
                      Date: {article.date}
                    </p>
                    <Link to={`/article/${article.id}`}>
                      <h3 className="text-lg font-bold mb-2 hover:text-blue-600 cursor-pointer flex items-center justify-between">
                        <span className="line-clamp-1">{article.title}</span>
                        <i className="fas fa-arrow-up-right-from-square text-sm text-gray-400"></i>
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-semibold text-sm">
                        {article.category}
                      </span>
                      <button 
                        onClick={() => handleEditClick(article)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                      >
                        Edit post
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg mb-4">
                You haven't created any articles yet
              </p>
              <Link
                to="/add-article"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Article
              </Link>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-arrow-left"></i>
              Previous
            </button>

            <div className="flex gap-2">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  disabled={page === "..."}
                  className={`w-10 h-10 rounded ${
                    page === currentPage
                      ? "bg-gray-200 font-semibold"
                      : page === "..."
                      ? "cursor-default"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Next
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Article</h2>
              <button
                onClick={handleCloseEditModal}
                className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category:</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-semibold mb-2">Mood:</label>
                <select
                  name="mood"
                  value={editFormData.mood}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {MOODS.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.emoji} {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold mb-2">Content:</label>
                <textarea
                  name="content"
                  value={editFormData.content}
                  onChange={handleEditInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="public"
                      checked={editFormData.status === "public"}
                      onChange={handleEditInputChange}
                      className="w-4 h-4"
                    />
                    <span>public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="private"
                      checked={editFormData.status === "private"}
                      onChange={handleEditInputChange}
                      className="w-4 h-4"
                    />
                    <span>private</span>
                  </label>
                </div>
              </div>

              {/* Current Image Preview */}
              {editFormData.currentImageUrl && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Current Image:</label>
                  <img
                    src={editFormData.currentImageUrl}
                    alt="Current"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {editFormData.currentImageUrl ? "Change Image:" : "Add Image:"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-600 mb-3">
                    Browse and choose the file you want to upload
                  </p>
                  <input
                    type="file"
                    id="edit-file-upload"
                    onChange={handleEditFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-file-upload"
                    className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    Browse Files
                  </label>
                  {editFormData.image && (
                    <p className="mt-3 text-sm text-green-600">
                      Selected: {editFormData.image.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  disabled={editLoading}
                >
                  {editLoading ? "Updating..." : "Update Article"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(editingArticle?.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  disabled={editLoading}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                  disabled={editLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete Article</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this article? All comments, likes, and replies will also be removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}