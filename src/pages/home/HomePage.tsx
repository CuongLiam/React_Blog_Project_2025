import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";


export default function HomePage() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;
  const CATEGORY_PAGE_SIZE = 5;

  // State
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryPage, setCategoryPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setCategories(categoriesRes.data.map((cat: any) => cat.name));
        setError("");
      } catch (err) {
        setError("Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle category filter (multi-select)
  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Computed values
  let filteredArticles = articles;
  
  // Apply search filter
  if (searchQuery.trim()) {
    filteredArticles = filteredArticles.filter((article: any) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply category filter
  if (selectedCategories.length > 0) {
    filteredArticles = filteredArticles.filter((article: any) =>
      selectedCategories.includes(article.category)
    );
  }

  const recentPosts = [...articles]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination helper
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <>
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Recent blog posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent blog posts</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading articles...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : recentPosts.length > 0 ? (
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
                  {recentPosts[0]?.content?.substring(0, 150)}...
                </p>
                <Link
                  to="#"
                  className="text-purple-600 font-semibold text-sm hover:underline"
                >
                  {recentPosts[0]?.category}
                </Link>
              </div>
              {/* Small posts */}
              <div className="col-span-1 space-y-6">
                {recentPosts.slice(1).map((article: any) => (
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
                        {article.content?.substring(0, 100)}...
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
          ) : (
            <div className="text-center py-12 text-gray-500">No articles yet</div>
          )}
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
        <div className="mb-8 flex items-center gap-2">
          <button
            onClick={() => setCategoryPage((p) => Math.max(0, p - 1))}
            disabled={categoryPage === 0}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
              categoryPage === 0 
                ? "text-gray-400 cursor-not-allowed" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Previous"
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories
              .slice(categoryPage * CATEGORY_PAGE_SIZE, (categoryPage + 1) * CATEGORY_PAGE_SIZE)
              .map((category: string) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>

          <button
            onClick={() => setCategoryPage((p) => Math.min(Math.ceil(categories.length / CATEGORY_PAGE_SIZE) - 1, p + 1))}
            disabled={(categoryPage + 1) * CATEGORY_PAGE_SIZE >= categories.length}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
              (categoryPage + 1) * CATEGORY_PAGE_SIZE >= categories.length
                ? "text-gray-400 cursor-not-allowed" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Next"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* Active filters and search */}
        {(selectedCategories.length > 0 || searchQuery.trim()) && (
          <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
            <span className="text-gray-600">
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              {searchQuery.trim() && ` for "${searchQuery}"`}
              {selectedCategories.length > 0 && " in:"}
            </span>
            {selectedCategories.map(cat => (
              <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {cat}
              </span>
            ))}
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSearchQuery("");
              }}
              className="ml-2 text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* All blog posts */}
        <section className="mb-12">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading articles...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : currentArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {currentArticles.map((article: any) => (
                <div key={article.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  <Link to={`/article/${article.id}`}>
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"}
                      alt={article.title}
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {article.date}
                    </p>
                    <Link to={`/article/${article.id}`}>
                      <h3 className="text-lg font-bold mb-2 hover:text-blue-600 line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.content}
                    </p>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">
                {selectedCategories.length > 0 
                  ? "No articles found in selected categories" 
                  : "No articles available"}
              </p>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-arrow-left"></i>
              Previous
            </button>

            <div className="flex gap-2">
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(Number(page))}
                    className={`w-10 h-10 rounded transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
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