import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    emptyPosts: (state) => {
      state.posts = [];
    },
  },
});

export const { addPost, emptyPosts, setPosts } = postSlice.actions;
export default postSlice.reducer;
