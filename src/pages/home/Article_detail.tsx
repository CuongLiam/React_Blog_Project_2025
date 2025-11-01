import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../layouts/user/Header";
import Footer from "../../layouts/user/Footer";
import type { AppDispatch, RootState } from "../../store";
import { fetchCommentsByArticle, addComment } from "../../store/slices/commentSlice";
import { fetchAllReplies, addReply } from "../../store/slices/replySlice";
import { fetchLikesByArticle, addLike, removeLike } from "../../store/slices/likeSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import axios from "axios";

export default function Article_detail() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const articleId = id || "0";

  // Redux state
  const { comments, loading: commentsLoading } = useSelector((state: RootState) => state.comments);
  const { replies } = useSelector((state: RootState) => state.replies);
  const { likes } = useSelector((state: RootState) => state.likes);
  const { users } = useSelector((state: RootState) => state.users);

  // Local state
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState<string[]>([]);

  // Get current user from localStorage
  const getCurrentUserId = () => {
    try {
      const userLogin = localStorage.getItem("userLogin");
      if (userLogin) {
        const userData = JSON.parse(userLogin);
        const user = userData?.data?.[0] || userData?.[0] || userData;
        return user.id || "1";
      }
    } catch {
      return "1";
    }
    return "1";
  };

  const currentUserId = getCurrentUserId();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (articleId === "0") return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/articles/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    dispatch(fetchCommentsByArticle(articleId));
    dispatch(fetchAllReplies());
    dispatch(fetchLikesByArticle(articleId));
    dispatch(fetchUsers());
  }, [articleId, dispatch]);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Loading article...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Not found state
  if (!article) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <i className="fas fa-file-circle-question text-6xl text-gray-300 mb-4"></i>
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Computed values
  const author = users.find((u: any) => u.id === article.userId);
  const isLiked = likes.some((like: any) => like.userId === currentUserId);
  const likeCount = likes.length;
  const commentCount = comments.length;

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const userLogin = localStorage.getItem("userLogin");
    return !!userLogin;
  };

  // Handlers
  const handleLike = () => {
    if (!isUserLoggedIn()) {
      alert("Please sign in to like articles");
      navigate("/login");
      return;
    }
    if (isLiked) {
      dispatch(removeLike({ articleId, userId: currentUserId }));
    } else {
      dispatch(addLike({ articleId, userId: currentUserId }));
    }
  };

  const handleAddComment = () => {
    if (!isUserLoggedIn()) {
      alert("Please sign in to comment");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;
    dispatch(addComment({
      articleId,
      userId: currentUserId,
      content: newComment
    }));
    setNewComment("");
  };

  const handleAddReply = (commentId: string) => {
    if (!isUserLoggedIn()) {
      alert("Please sign in to reply");
      navigate("/login");
      return;
    }
    if (!replyContent.trim()) return;
    dispatch(addReply({
      commentId,
      userId: currentUserId,
      content: replyContent
    }));
    setReplyContent("");
    setReplyTo(null);
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const getCommentReplies = (commentId: string) => {
    return replies.filter((reply: any) => reply.commentId === commentId);
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
              alt={author?.displayName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{author?.displayName}</h3>
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
            src={article.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"}
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
              <span className="font-semibold">{likeCount} Like{likeCount !== 1 ? "s" : ""}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="far fa-comment text-xl"></i>
              <span className="font-semibold">{commentCount} Comment{commentCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {commentCount} Comment{commentCount !== 1 ? "s" : ""}
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
              disabled={commentsLoading || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentsLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <p>Loading comments...</p>
            </div>
          ) : commentCount === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="far fa-comment text-4xl mb-3"></i>
              <p className="text-lg">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment: any) => {
                const commentAuthor = users.find((u: any) => u.id === comment.userId);
                const commentReplies = getCommentReplies(comment.id);
                return (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                    {/* Comment Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={commentAuthor?.avatar || "https://avatar.iran.liara.run/public"}
                        alt={commentAuthor?.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{commentAuthor?.displayName}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 ml-13 mb-3">
                      <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        <i className="far fa-comment"></i>
                        <span>Reply {commentReplies.length > 0 && `(${commentReplies.length})`}</span>
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
                          : `View all ${commentReplies.length} replies`}
                      </button>
                    )}

                    {/* Replies List */}
                    {showReplies.includes(comment.id) && (
                      <div className="ml-13 space-y-4 mb-4">
                        {commentReplies.map((reply: any) => {
                          const replyAuthor = users.find((u: any) => u.id === reply.userId);
                          return (
                            <div key={reply.id} className="flex items-start gap-3">
                              <img
                                src={replyAuthor?.avatar || "https://avatar.iran.liara.run/public"}
                                alt={replyAuthor?.displayName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1 bg-white rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-sm">
                                    {replyAuthor?.displayName}
                                  </h5>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyTo === comment.id && (
                      <div className="ml-13 mt-4 bg-white rounded-lg p-4">
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
                            disabled={!replyContent.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyTo(null);
                              setReplyContent("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}