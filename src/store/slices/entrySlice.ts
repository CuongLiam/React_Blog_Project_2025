import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntries = createAsyncThunk("entries/fetchEntries", async () => {
  const response = await axios.get(`${import.meta.env.VITE_SV_HOST}/categories`);
  return response.data;
});

export const addEntry = createAsyncThunk("entries/addEntry", async (newEntry: { name: string }) => {
  const response = await axios.post(`${import.meta.env.VITE_SV_HOST}/categories`, newEntry);
  return response.data;
});

export const editEntry = createAsyncThunk("entries/editEntry", async (entry: { id: number, name: string }) => {
  const response = await axios.put(`${import.meta.env.VITE_SV_HOST}/categories/${entry.id}`, entry);
  return response.data;
});

export const deleteEntry = createAsyncThunk("entries/deleteEntry", async (id: number) => {
  await axios.delete(`${import.meta.env.VITE_SV_HOST}/categories/${id}`);
  return id;
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
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(editEntry.fulfilled, (state, action) => {
        const idx = state.entries.findIndex((cat: any) => cat.id === action.payload.id);
        if (idx !== -1) state.entries[idx] = action.payload;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((cat: any) => cat.id !== action.payload);
      });
  },
});

export default entrySlice.reducer;
