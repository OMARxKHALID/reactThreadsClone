import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  likeAndUnLikePost,
  replyToPost,
  getFeedPosts,
} from "../controllers/postControllers.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const reducer = express.Router();

reducer.get("/feed", protectedRoute, getFeedPosts);
reducer.get("/:id", getPosts);
reducer.post("/create", protectedRoute, createPost);
reducer.delete("/:id", protectedRoute, deletePost);
reducer.post("/like/:id", protectedRoute, likeAndUnLikePost);
reducer.post("/reply/:id", protectedRoute, replyToPost)


export default reducer;
