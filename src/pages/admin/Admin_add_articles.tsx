import React, { useState } from "react";
// If you get an import error, install react-router-dom: npm install react-router-dom
import { useNavigate } from "react-router";
import { message } from "antd";
import axios from "axios";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";

export default function Admin_add_articles() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    mood: "happy",
    content: "",
    status: "public",
    image: "", // Only URL string
  });

  const categories = [
    "Personal Diary",
    "Work Log",
    "Thoughts",
    "Travel & Adventure",
    "Health & Fitness",
    "Food & Recipes",
    "Technology",
    "Books & Reading",
    "Music & Entertainment",
    "Family & Relationships",
  ];

  const moods = [
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "excited", emoji: "🤩", label: "Excited" },
    { value: "peaceful", emoji: "😌", label: "Peaceful" },
    { value: "anxious", emoji: "😰", label: "Anxious" },
    { value: "stressed", emoji: "😣", label: "Stressed" },
    { value: "grateful", emoji: "🙏", label: "Grateful" },
    { value: "motivated", emoji: "💪", label: "Motivated" },
    { value: "overwhelmed", emoji: "😵", label: "Overwhelmed" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Removed file upload for admin, only use image URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For simplicity, only send image URL (not upload file)
      // Get userId from localStorage
      let userId = "1";
      try {
        const userLogin = localStorage.getItem("userLogin");
        if (userLogin) {
          const userData = JSON.parse(userLogin);
          // Try to get id from userData.data[0].id or userData[0].id
          userId = userData?.data?.[0]?.id || userData?.[0]?.id || userId;
        }
      } catch {}
      const payload = {
        ...formData,
        image:
          typeof formData.image === "string"
            ? formData.image
            : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600", // fallback
        date: new Date().toISOString().slice(0, 10),
        userId,
      };
      await axios.post(`${import.meta.env.VITE_SV_HOST}/articles`, payload);
      message.success("Thêm bài viết thành công!");
      navigate("/admin/articles");
    } catch (err) {
      message.error("Lỗi khi thêm bài viết!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <Sidebar_menu activeItem="articles" />
        <div className="flex-1 p-8 flex flex-col items-center max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 w-full space-y-6">
            <h1 className="text-2xl font-bold mb-6">📝 Thêm mới bài viết (Admin)</h1>
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chủ đề</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tâm trạng</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {moods.map((m) => (
                  <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nội dung</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ảnh (URL)</label>
              <input
                type="text"
                name="image"
                value={typeof formData.image === "string" ? formData.image : ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dán URL ảnh hoặc để trống để dùng mặc định"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Thêm bài viết
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
