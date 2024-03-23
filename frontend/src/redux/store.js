import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import messageReducer from "./messageSlice";

const preloadedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : {};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    message: messageReducer,
  },
  preloadedState: preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("reduxState", JSON.stringify(state));
});
