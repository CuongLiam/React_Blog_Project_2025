import { configureStore } from "@reduxjs/toolkit";




// const store = configureStore({
//     reducer
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
// })