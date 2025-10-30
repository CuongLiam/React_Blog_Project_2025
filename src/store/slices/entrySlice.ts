import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntries = createAsyncThunk("entries/fetchEntries", async () => {
  const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/categories`);
  return response.data;
});

const entrySlice = createSlice({
  name: "entries",
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch entries";
      });
  },
});

export default entrySlice.reducer;
