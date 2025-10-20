import React, { useState } from "react";
import { articles } from "../../data/fakeData";
import { Link } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";

export default function HomePage() {
  const ITEMS_PER_PAGE = 6; // Adjust this to change items per page
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categories for filtering
  const categories = [
    "Daily Journal",
    "Work & Career",
    "Personal Thoughts",
    "Emotions & Feelings",
  ];

  // Filter articles by category
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles;

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Get recent posts (first 3 articles)
  const recentPosts = articles.slice(0, 3);

  // Handle category filter
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Recent blog posts section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent blog posts</h2>
          <div className="grid grid-cols-2 gap-6">
          {/* Large featured post */}
          <div className="col-span-1">
            <Link to={`/article/${recentPosts[0]?.id}`}>
              <img
                src={recentPosts[0]?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"}
                alt="blog post"
                className="w-full h-64 object-cover rounded-lg mb-4 hover:opacity-90 transition-opacity cursor-pointer"
              />
            </Link>
            <p className="text-sm text-purple-600 mb-2">Date: {recentPosts[0]?.date}</p>
            <Link to={`/article/${recentPosts[0]?.id}`}>
              <h3 className="text-xl font-bold mb-2 hover:text-blue-600 cursor-pointer">{recentPosts[0]?.title}</h3>
            </Link>
            <p className="text-gray-600 text-sm mb-3">
              {recentPosts[0]?.content.substring(0, 150)}...
            </p>
            <Link
              to="#"
              className="text-purple-600 font-semibold text-sm hover:underline"
            >
              {recentPosts[0]?.category}
            </Link>
          </div>            {/* Small posts */}
            <div className="col-span-1 space-y-6">
              {recentPosts.slice(1).map((article) => (
                <div key={article.id} className="flex gap-4">
                  <Link to={`/article/${article.id}`}>
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300"}
                      alt="blog post"
                      className="w-40 h-32 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm text-purple-600 mb-1">
                      Date: {article.date}
                    </p>
                    <Link to={`/article/${article.id}`}>
                      <h3 className="text-lg font-bold mb-2 hover:text-blue-600 cursor-pointer">{article.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2">
                      {article.content.substring(0, 100)}...
                    </p>
                    <Link
                      to="#"
                      className="text-purple-600 font-semibold text-sm hover:underline"
                    >
                      {article.category}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation tabs */}
        <div className="mb-8 flex gap-6 border-b">
          <Link
            to="/"
            className="text-blue-600 font-semibold pb-2 border-b-2 border-blue-600"
          >
            All blog posts
          </Link>
          <Link to="/my-posts" className="text-gray-600 pb-2 hover:text-blue-600">
            All my posts
          </Link>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Display filter info */}
        {selectedCategory && (
          <div className="mb-4 text-sm text-gray-600 ">
            Showing {filteredArticles.length} articles in "{selectedCategory}"
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 text-blue-600 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* All blog posts grid */}
        <section className="mb-12">
          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {currentArticles.map((article) => (
                <div key={article.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/article/${article.id}`}>
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"}
                      alt="blog post"
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </Link>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Date: {article.date}
                    </p>
                    <Link to={`/article/${article.id}`}>
                      <h3 className="text-lg font-bold mb-2 flex items-center justify-between hover:text-blue-600 cursor-pointer">
                        <span className="line-clamp-1">{article.title}</span>
                        <i className="fas fa-arrow-up-right-from-square text-sm text-gray-400"></i>
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.content}
                    </p>
                    <Link
                      to="#"
                      className="text-purple-600 font-semibold text-sm hover:underline"
                    >
                      {article.category}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No articles found in this category.
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900"
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
                  className={`w-8 h-8 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white font-semibold"
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
              className={`flex items-center gap-2 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Next
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}