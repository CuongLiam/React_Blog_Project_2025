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

  // Redux selectors
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

  // Current user (you can get this from auth context/redux)
  const currentUserId = "1"; // Replace with actual current user ID

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/articles/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId !== "0") {
      fetchArticle();
      // Fetch related data
      dispatch(fetchCommentsByArticle(articleId));
      dispatch(fetchAllReplies());
      dispatch(fetchLikesByArticle(articleId));
      dispatch(fetchUsers());
    }
  }, [articleId, dispatch]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          <div className="text-gray-500">Loading article...</div>
        </div>
        <Footer />
      </>
    );
  }

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

  const author = users.find((u: any) => u.id === article.userId);
  const isLiked = likes.some((like: any) => like.userId === currentUserId);

  // Handle like/unlike
  const handleLike = () => {
    if (isLiked) {
      dispatch(removeLike({ articleId, userId: currentUserId }));
    } else {
      dispatch(addLike({ articleId, userId: currentUserId }));
    }
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({
      articleId,
      userId: currentUserId,
      content: newComment
    }));
    setNewComment("");
  };

  // Handle add reply
  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    dispatch(addReply({
      commentId,
      userId: currentUserId,
      content: replyContent
    }));
    setReplyContent("");
    setReplyTo(null);
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    if (showReplies.includes(commentId)) {
      setShowReplies(showReplies.filter((id) => id !== commentId));
    } else {
      setShowReplies([...showReplies, commentId]);
    }
  };

  // Get replies for a comment
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
              <span className="font-semibold">
                {likes.length} Like{likes.length !== 1 ? "s" : ""}
              </span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="far fa-comment text-xl"></i>
              <span className="font-semibold">
                {comments.length} Comment{comments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
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
              disabled={commentsLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {commentsLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading comments...</div>
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
                      <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
                        <i className="far fa-thumbs-up"></i>
                        <span>Like</span>
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}