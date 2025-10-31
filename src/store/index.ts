import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import entryReducer from "./slices/entrySlice"; 
import articleReducer from "./slices/articleSlice";
import commentReducer from "./slices/commentSlice";
import replyReducer from "./slices/replySlice";
import likeReducer from "./slices/likeSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    entries: entryReducer,
    articles: articleReducer,
    comments: commentReducer,
    replies: replyReducer,
    likes: likeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;