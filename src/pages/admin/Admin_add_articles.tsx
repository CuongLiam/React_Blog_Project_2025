import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";
import axios from "axios";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";
import { uploadImageToCloudinary } from "../../upload/cloudinary";

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

export default function Admin_add_articles() {
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    mood: "happy",
    content: "",
    status: "public",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Get current user from localStorage
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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SV_HOST}/categories`);
        setCategories(res.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = "";
      if (formData.image) {
        imageUrl = await uploadImageToCloudinary(formData.image);
      }

      // Create article
      const payload = {
        title: formData.title,
        category: formData.category,
        mood: formData.mood,
        content: formData.content,
        status: formData.status,
        image: imageUrl,
        date: new Date().toISOString().slice(0, 10),
        userId: getCurrentUserId(),
      };

      await axios.post(`${import.meta.env.VITE_SV_HOST}/articles`, payload);
      message.success("Article added successfully!");
      navigate("/admin/articles");
    } catch {
      message.error("Failed to add article!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <Sidebar_menu activeItem="articles" />
        <div className="flex-1 p-8 flex flex-col items-center max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 w-full space-y-6">
            <h1 className="text-2xl font-bold mb-6">
              <i className="fas fa-plus-circle mr-2"></i>
              Add New Article
            </h1>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter article title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mood</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MOODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your article content..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image or leave empty for default</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/articles")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Add Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
