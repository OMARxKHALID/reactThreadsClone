import User from "../models/userModel.js";
import Post from "../models/postModel.js"; 
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";

const signUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    };

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    };

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      bio: newUser.bio,
      profilePic: newUser.profilePic,
      followers: newUser.followers,
      following: newUser.following,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in signUpUser:", err);
  }
};

const logInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    };

    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in logInUser:", err);
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in logOutUser:", err);
  }
};

const followAndUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res.status(400).json({ error: "You cannot follow yourself" });

    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in followAndUnfollowUser:", err);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);


    user = await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in updateUser:", err);
  }
};


const getUserProfile = async (req, res) => {
  const { query } = req.params;
  // we will fetch the user profile by either username or userId by query
  try {
    let user;
    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password -updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query }).select(
        "-password -updatedAt"
      ); // excluding password and updatedAt fields
    }

    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log("error in getUserProfile:", err);
    res.status(500).json({ error: err.message });
  }
};

export {
  signUpUser,
  logInUser,
  logOutUser,
  followAndUnfollowUser,
  updateUser,
  getUserProfile,
};
