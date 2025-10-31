import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { reply } from "../../types/user";

export const fetchRepliesByComment = createAsyncThunk(
  "replies/fetchByComment",
  async (commentId: string) => {
    const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/replies?commentId=${commentId}`);
    return response.data;
  }
);

export const fetchAllReplies = createAsyncThunk(
  "replies/fetchAll",
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/replies`);
    return response.data;
  }
);

export const addReply = createAsyncThunk(
  "replies/addReply", 
  async (newReply: { commentId: string, userId: string, content: string }) => {
    const replyData = {
      ...newReply,
      createdAt: new Date().toISOString()
    };
    const response = await axios.post(`${import.meta.env.VITE_SV_HOST}/replies`, replyData);
    return response.data;
  }
);

const replySlice = createSlice({
  name: "replies",
  initialState: {
    replies: [] as reply[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReplies.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(fetchAllReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch replies";
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.replies.push(action.payload);
      });
  },
});

export default replySlice.reducer;