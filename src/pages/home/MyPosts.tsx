import { useState } from "react";
import { Link } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import { articles } from "../../data/fakeData";

export default function MyPosts() {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter articles by current user (hardcoded userId = 1 for demo)
  const currentUserId = 1;
  const myArticles = articles.filter((article) => article.userId === currentUserId);

  // Calculate pagination
  const totalPages = Math.ceil(myArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = myArticles.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        for (let i = 8; i <= 10; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation tabs with slide animation */}
        <div className="mb-8 flex gap-6 border-b animate-slide-down">
          <Link
            to="/"
            className="text-gray-600 pb-2 hover:text-blue-600 transition-colors"
          >
            All blog posts
          </Link>
          <Link 
            to="/my-posts" 
            className="text-blue-600 font-semibold pb-2 border-b-2 border-blue-600"
          >
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

          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {currentArticles.map((article) => (
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
                      <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
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
      <Footer />
    </>
  );
}
