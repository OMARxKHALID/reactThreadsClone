import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  likeAndUnLikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
} from "../controllers/postControllers.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const reducer = express.Router();

reducer.get("/feed", protectedRoute, getFeedPosts);
reducer.get("/:id", getPosts);
reducer.get("/user/:username", getUserPosts);
reducer.post("/create", protectedRoute, createPost);
reducer.delete("/:id", protectedRoute, deletePost);
reducer.put("/like/:id", protectedRoute, likeAndUnLikePost);
reducer.put("/reply/:id", protectedRoute, replyToPost)


export default reducer;
