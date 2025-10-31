import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { like } from "../../types/user";

export const fetchLikesByArticle = createAsyncThunk(
  "likes/fetchByArticle",
  async (articleId: string) => {
    const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/likes?articleId=${articleId}`);
    return response.data;
  }
);

export const addLike = createAsyncThunk(
  "likes/addLike",
  async (likeData: { articleId: string, userId: string }) => {
    const newLike = {
      ...likeData,
      createdAt: new Date().toISOString()
    };
    const response = await axios.post(`${import.meta.env.VITE_SV_HOST}/likes`, newLike);
    return response.data;
  }
);

export const removeLike = createAsyncThunk(
  "likes/removeLike", 
  async ({ articleId, userId }: { articleId: string, userId: string }) => {
    // First find the like
    const likesResponse = await axios.get(`${import.meta.env.VITE_SV_HOST}/likes?articleId=${articleId}&userId=${userId}`);
    const like = likesResponse.data[0];
    
    if (like) {
      await axios.delete(`${import.meta.env.VITE_SV_HOST}/likes/${like.id}`);
      return like.id;
    }
    throw new Error("Like not found");
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    likes: [] as like[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikesByArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikesByArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload;
      })
      .addCase(fetchLikesByArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch likes";
      })
      .addCase(addLike.fulfilled, (state, action) => {
        state.likes.push(action.payload);
      })
      .addCase(removeLike.fulfilled, (state, action) => {
        state.likes = state.likes.filter(like => like.id !== action.payload);
      });
  },
});

export default likeSlice.reducer;