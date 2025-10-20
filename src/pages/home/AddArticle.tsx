import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";

export default function AddArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    mood: "happy",
    content: "",
    status: "public",
    image: null as File | null,
  });

  const categories = [
    "Daily Journal",
    "Work & Career",
    "Personal Thoughts",
    "Emotions & Feelings",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Form data:", formData);
    // For now, just navigate back to my posts
    alert("Article added successfully!");
    navigate("/my-posts");
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/my-posts"
            className="text-blue-500 hover:underline text-sm"
          >
            back
          </Link>
          <Link
            to="/my-posts"
            className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100"
          >
            <i className="fas fa-times text-gray-600"></i>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">📝 Add New Article</h1>

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

          {/* Article Categories */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Article Categories:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
              {moods.map((mood) => (
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
            <label className="block text-sm font-semibold mb-2">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="public"
                  checked={formData.status === "public"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span>public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  checked={formData.status === "private"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span>private</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
              <p className="text-sm text-gray-600 mb-2">
                Browse and chose the files you want
              </p>
              <p className="text-sm text-gray-600 mb-4">
                to upload from your computer
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
                className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Browse Files
              </label>
              {formData.image && (
                <p className="mt-3 text-sm text-green-600">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Add
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
