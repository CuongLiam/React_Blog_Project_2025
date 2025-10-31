import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { comment } from "../../types/user";

export const fetchCommentsByArticle = createAsyncThunk(
  "comments/fetchByArticle", 
  async (articleId: string) => {
    const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/comments?articleId=${articleId}`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (newComment: { articleId: string, userId: string, content: string }) => {
    const commentData = {
      ...newComment,
      createdAt: new Date().toISOString()
    };
    const response = await axios.post(`${import.meta.env.VITE_SV_HOST}/comments`, commentData);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [] as comment[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export default commentSlice.reducer;