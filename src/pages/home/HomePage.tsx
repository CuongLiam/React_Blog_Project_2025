import React from "react";
import { articles } from "../../data/fakeData";
import { Link } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";

export default function HomePage() {
  // Get recent posts (first 3 articles)
  const recentPosts = articles.slice(0, 3);

  // Categories for filtering
  const categories = [
    "Daily Journal",
    "Work & Career",
    "Personal Thoughts",
    "Emotions & Feelings",
  ];

  return (
    <>
    <Header/>
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Recent blog posts section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent blog posts</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Large featured post */}
          <div className="col-span-1">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"
              alt="blog post"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-purple-600 mb-2">Date: 2025-02-25</p>
            <h3 className="text-xl font-bold mb-2">A Productive Day at Work</h3>
            <p className="text-gray-600 text-sm mb-3">
              Today was a really productive day at work. I managed to finish a
              report ahead of schedule and received positive feedback from my
              manager.
            </p>
            <Link
              to="#"
              className="text-purple-600 font-semibold text-sm hover:underline"
            >
              Daily Journal
            </Link>
          </div>

          {/* Small posts */}
          <div className="col-span-1 space-y-6">
            {recentPosts.slice(1).map((article) => (
              <div key={article.id} className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300"
                  alt="blog post"
                  className="w-40 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm text-purple-600 mb-1">
                    Date: {article.date}
                  </p>
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{article.content}</p>
                  <Link
                    to="#"
                    className="text-purple-600 font-semibold text-sm hover:underline"
                  >
                    Work & Career
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
          to="#"
          className="text-blue-600 font-semibold pb-2 border-b-2 border-blue-600"
        >
          All blog posts
        </Link>
        <Link to="#" className="text-gray-600 pb-2 hover:text-blue-600">
          All my posts
        </Link>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
          >
            {category}
          </button>
        ))}
      </div>

      {/* All blog posts grid */}
      <section className="mb-12">
        <div className="grid grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
                alt="blog post"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Date: {article.date}
                </p>
                <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                  {article.title}
                  <i className="fas fa-arrow-up-right-from-square text-sm text-gray-400"></i>
                </h3>
                <p className="text-gray-600 text-sm mb-3">{article.content}</p>
                <Link
                  to="#"
                  className="text-purple-600 font-semibold text-sm hover:underline"
                >
                  {article.mood === "happy" ? "Daily Journal" : "Personal Thoughts"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <i className="fas fa-arrow-left"></i>
          Previous
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded ${
                page === 1
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          Next
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
}