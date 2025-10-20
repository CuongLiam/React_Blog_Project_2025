import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import { articles, comments, replies, likes, users } from "../../data/fakeData";
import type { comment as CommentType, reply as ReplyType } from "../../types/user";

export default function Article_detail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || "0");

  // Find the article
  const article = articles.find((a) => a.id === articleId);

  // Get article data
  const articleLikes = likes.filter((like) => like.articleId === articleId);
  const articleComments = comments.filter((comment) => comment.articleId === articleId);

  // State management
  const [currentLikes, setCurrentLikes] = useState(articleLikes);
  const [currentComments, setCurrentComments] = useState(articleComments);
  const [currentReplies, setCurrentReplies] = useState(replies);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState<number[]>([]);

  // Current user (hardcoded for demo)
  const currentUserId = 1;

  if (!article) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const author = users.find((u) => u.id === article.userId);
  const isLiked = currentLikes.some((like) => like.userId === currentUserId);

  // Handle like/unlike
  const handleLike = () => {
    if (isLiked) {
      // Unlike
      setCurrentLikes(currentLikes.filter((like) => like.userId !== currentUserId));
    } else {
      // Like
      const newLike = {
        id: Date.now(),
        articleId: articleId,
        userId: currentUserId,
        createdAt: new Date().toISOString(),
      };
      setCurrentLikes([...currentLikes, newLike]);
    }
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: CommentType = {
      id: Date.now(),
      articleId: articleId,
      userId: currentUserId,
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setCurrentComments([...currentComments, comment]);
    setNewComment("");
  };

  // Handle add reply
  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const reply: ReplyType = {
      id: Date.now(),
      commentId: commentId,
      userId: currentUserId,
      content: replyContent,
      createdAt: new Date().toISOString(),
    };

    setCurrentReplies([...currentReplies, reply]);
    setReplyContent("");
    setReplyTo(null);
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: number) => {
    if (showReplies.includes(commentId)) {
      setShowReplies(showReplies.filter((id) => id !== commentId));
    } else {
      setShowReplies([...showReplies, commentId]);
    }
  };

  // Get replies for a comment
  const getCommentReplies = (commentId: number) => {
    return currentReplies.filter((reply) => reply.commentId === commentId);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <i className="fas fa-arrow-left"></i>
          Back
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={author?.avatar || "https://avatar.iran.liara.run/public"}
              alt={author?.firstname}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">
                {author?.firstname} {author?.lastname}
              </h3>
              <p className="text-sm text-gray-500">{article.date}</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-purple-600 font-semibold">{article.category}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{article.mood}</span>
          </div>

          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />

          <p className="text-lg text-gray-700 leading-relaxed">{article.content}</p>
        </div>

        {/* Like Section */}
        <div className="border-y py-4 mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                isLiked ? "text-red-500" : "text-gray-600"
              } hover:text-red-500 transition-colors`}
            >
              <i className={`${isLiked ? "fas" : "far"} fa-heart text-xl`}></i>
              <span className="font-semibold">{currentLikes.length} Like{currentLikes.length !== 1 ? "s" : ""}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="far fa-comment text-xl"></i>
              <span className="font-semibold">{currentComments.length} Comment{currentComments.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {currentComments.length} Comment{currentComments.length !== 1 ? "s" : ""}
          </h2>

          {/* Add Comment */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {currentComments.map((comment) => {
              const commentAuthor = users.find((u) => u.id === comment.userId);
              const commentReplies = getCommentReplies(comment.id);

              return (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  {/* Comment Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={commentAuthor?.avatar || "https://avatar.iran.liara.run/public"}
                      alt={commentAuthor?.firstname}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {commentAuthor?.firstname} {commentAuthor?.lastname}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 ml-13 mb-3">
                    <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
                      <i className="far fa-thumbs-up"></i>
                      <span>15 Like</span>
                    </button>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      <i className="far fa-comment"></i>
                      <span>{commentReplies.length} Replies</span>
                    </button>
                  </div>

                  {/* View Replies Button */}
                  {commentReplies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-sm text-blue-600 hover:underline ml-13 mb-3"
                    >
                      {showReplies.includes(comment.id)
                        ? "Hide replies"
                        : `View all ${commentReplies.length} comments`}
                    </button>
                  )}

                  {/* Replies List */}
                  {showReplies.includes(comment.id) && (
                    <div className="ml-13 space-y-4 mb-4">
                      {commentReplies.map((reply) => {
                        const replyAuthor = users.find((u) => u.id === reply.userId);
                        return (
                          <div key={reply.id} className="flex items-start gap-3">
                            <img
                              src={replyAuthor?.avatar || "https://avatar.iran.liara.run/public"}
                              alt={replyAuthor?.firstname}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-sm">
                                  {replyAuthor?.firstname} {replyAuthor?.lastname}
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1">
                                  <i className="far fa-thumbs-up"></i>
                                  <span>15 Like</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyTo === comment.id && (
                    <div className="ml-13 mt-4">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo(null);
                            setReplyContent("");
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
