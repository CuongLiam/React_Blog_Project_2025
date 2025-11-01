import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";
import axios from "axios";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import { uploadImageToCloudinary } from "../../upload/cloudinary";

export default function MyProfile() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (!userLogin) {
      navigate("/login");
    }
  }, [navigate]);

  // Get current user data
  const getCurrentUser = () => {
    try {
      const userLogin = localStorage.getItem("userLogin");
      if (userLogin) {
        const userData = JSON.parse(userLogin);
        return userData?.data?.[0] || userData?.[0] || userData;
      }
    } catch {
      return null;
    }
    return null;
  };

  const currentUser = getCurrentUser();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    role: currentUser?.role || "USER",
    status: currentUser?.status || "ACTIVE",
  });

  // Stats
  const [stats, setStats] = useState({
    totalArticles: 0,
    publicArticles: 0,
    privateArticles: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      try {
        const [articlesRes, likesRes, commentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SV_HOST}/articles?userId=${currentUser.id}`),
          axios.get(`${import.meta.env.VITE_SV_HOST}/likes`),
          axios.get(`${import.meta.env.VITE_SV_HOST}/comments?userId=${currentUser.id}`),
        ]);

        const userArticles = articlesRes.data;
        const allLikes = likesRes.data;
        
        // Count likes for user's articles
        const userArticleIds = userArticles.map((a: any) => a.id);
        const userLikes = allLikes.filter((like: any) => userArticleIds.includes(like.articleId));

        setStats({
          totalArticles: userArticles.length,
          publicArticles: userArticles.filter((a: any) => a.status === "public").length,
          privateArticles: userArticles.filter((a: any) => a.status === "private").length,
          totalLikes: userLikes.length,
          totalComments: commentsRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [currentUser]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploadingAvatar(true);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData({ ...formData, avatar: imageUrl });
      message.success("Avatar uploaded successfully!");
    } catch (err) {
      message.error("Failed to upload avatar!");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const updatedUser = {
        ...currentUser,
        displayName: formData.displayName,
        email: formData.email,
        avatar: formData.avatar,
      };

      await axios.put(`${import.meta.env.VITE_SV_HOST}/users/${currentUser.id}`, updatedUser);

      // Update localStorage
      const userLogin = localStorage.getItem("userLogin");
      if (userLogin) {
        const userData = JSON.parse(userLogin);
        if (userData?.data?.[0]) {
          userData.data[0] = updatedUser;
        } else if (userData?.[0]) {
          userData[0] = updatedUser;
        } else {
          userData.data = [updatedUser];
        }
        localStorage.setItem("userLogin", JSON.stringify(userData));
      }

      message.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Reload page to update header
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      message.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({
      displayName: currentUser?.displayName || currentUser?.username || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
      role: currentUser?.role || "USER",
      status: currentUser?.status || "ACTIVE",
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={formData.avatar || "https://avatar.iran.liara.run/public"}
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                        {uploadingAvatar ? (
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        ) : (
                          <i className="fas fa-camera text-white"></i>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-4">{formData.displayName}</h2>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                  
                  {/* Role Badge */}
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.role === "MASTER" ? "bg-purple-100 text-purple-700" :
                      formData.role === "ADMIN" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {formData.role}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      formData.status === "BAN" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {formData.status}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="fas fa-file-alt text-blue-600"></i>
                      Total Articles
                    </span>
                    <span className="font-semibold text-gray-900">{stats.totalArticles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="fas fa-eye text-green-600"></i>
                      Public
                    </span>
                    <span className="font-semibold text-gray-900">{stats.publicArticles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="fas fa-lock text-gray-600"></i>
                      Private
                    </span>
                    <span className="font-semibold text-gray-900">{stats.privateArticles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="fas fa-heart text-red-600"></i>
                      Total Likes
                    </span>
                    <span className="font-semibold text-gray-900">{stats.totalLikes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="fas fa-comment text-purple-600"></i>
                      Comments Made
                    </span>
                    <span className="font-semibold text-gray-900">{stats.totalComments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{formData.displayName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{formData.email}</p>
                    )}
                  </div>

                  {/* Username (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <p className="text-gray-500">
                      {currentUser.username}
                      <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
                    </p>
                  </div>

                  {/* User ID (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <p className="text-gray-500 font-mono text-sm">{currentUser.id}</p>
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        formData.status === "BAN" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {formData.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Role: <span className="font-medium text-gray-900">{formData.role}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/my-posts")}
                    className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <i className="fas fa-file-alt text-blue-600"></i>
                    <span>My Posts</span>
                  </button>
                  <button
                    onClick={() => navigate("/add-article")}
                    className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <i className="fas fa-plus-circle text-green-600"></i>
                    <span>Create Article</span>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <i className="fas fa-home text-purple-600"></i>
                    <span>Home</span>
                  </button>
                  <button
                    className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <i className="fas fa-cog text-gray-600"></i>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
