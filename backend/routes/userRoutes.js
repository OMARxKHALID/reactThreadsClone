import express from "express";
import {
  logInUser,
  signUpUser,
  logOutUser,
  followAndUnfollowUser,
  updateUser,
  getUserProfile
} from "../controllers/userController.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const reducer = express.Router();

reducer.get("/profile/:username", getUserProfile)
reducer.post("/signup", signUpUser);
reducer.post("/login", logInUser);
reducer.post("/logout", logOutUser);
reducer.post("/follow/:id", protectedRoute, followAndUnfollowUser);
reducer.post("/update/:id", protectedRoute, updateUser);


export default reducer;