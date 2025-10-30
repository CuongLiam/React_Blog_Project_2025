import { configureStore } from "@reduxjs/toolkit";




// const store = configureStore({
//     reducer

import userReducer from "./slices/userSlice";
import entryReducer from "./slices/entrySlice";
import articleReducer from "./slices/articleSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    entries: entryReducer,
    articles: articleReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
// })