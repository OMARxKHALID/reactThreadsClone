import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isState: "login",
  user: null,
  userProfile: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeState: (state, action) => {
      state.isState = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.userProfile = null;
    },
    followUser: (state, action) => {
      const { userId, authUserId } = action.payload;
      state.userProfile = {
        ...state.userProfile,
        followers: [...state.userProfile.followers, authUserId],
      };
      state.user = {
        ...state.user,
        following: [...state.user.following, userId],
      };
    },
    unfollowUser: (state, action) => {
      const { userId, authUserId } = action.payload;
      state.userProfile = {
        ...state.userProfile,
        followers: state.userProfile.followers.filter(
          (followerId) => followerId !== authUserId
        ),
      };
      state.user = {
        ...state.user,
        following: state.user.following.filter(
          (followingId) => followingId !== userId
        ),
      };
    },
  },
});

export const {
  changeState,
  setUser,
  setIsLoading,
  setUserProfile,
  followUser,
  unfollowUser,
  setLogout,
} = authSlice.actions;

export default authSlice.reducer;
