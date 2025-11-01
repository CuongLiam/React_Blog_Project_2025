import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import axios from "axios";
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

export default function AddArticle() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (!userLogin) {
      navigate("/login");
    }
  }, [navigate]);
  
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

  // Fetch categories
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
        imageUrl = await uploadImageToCloudinary(formData.image, "articles");
      }

      // Prepare article data
      const { image, ...rest } = formData;
      const newArticle = {
        ...rest,
        image: imageUrl,
        userId: getCurrentUserId(),
        date: new Date().toISOString().slice(0, 10),
        category: categories.find((c) => c.id === formData.category)?.name || "",
      };

      // Save to server
      await axios.post(`${import.meta.env.VITE_SV_HOST}/articles`, newArticle);

      alert("Article added successfully!");
      navigate("/my-posts");
    } catch (err) {
      console.error("Add article error:", err);
      alert("Failed to add article!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/my-posts" className="text-blue-600 hover:underline font-medium">
            ← Back to My Posts
          </Link>
          <Link
            to="/my-posts"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-times text-gray-600"></i>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold mb-8">📝 Add New Article</h1>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
              value={formData.mood}
              onChange={handleInputChange}
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
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">Visibility:</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="public"
                  checked={formData.status === "public"}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="capitalize">Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  checked={formData.status === "private"}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="capitalize">Private</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cover Image:</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-blue-400 transition-colors">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
              <p className="text-sm text-gray-600 mb-2">
                Choose an image for your article
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors font-medium"
              >
                <i className="fas fa-image mr-2"></i>
                Browse Files
              </label>
              {formData.image && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <i className="fas fa-check-circle text-green-600 mr-2"></i>
                  <span className="text-sm text-green-700 font-medium">
                    {formData.image.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Publish Article
                </>
              )}
            </button>
            <Link
              to="/my-posts"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
