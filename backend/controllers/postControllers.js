import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, img, text } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "PostBy and text field are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLenght = 500;
    if (text.length > maxLenght) {
      return res
        .status(400)
        .json({ message: `Text must be less then ${maxLenght} charaters` });
    }

    const newPost = new Post({ postedBy, img, text });
    await newPost.save();

    res.status(200).json({ message: "Post created successfully", newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in createPost:", err);
  }
};

const getPosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post found", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in getPosts:", err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unathorized to delete post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in getPosts:", err);
  }
};

const likeAndUnLikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const likedByUser = post.likes.includes(userId);

    if (likedByUser) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully", post });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in likeAndUnLikePost:", err);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reply = {
      userId,
      text,
      userProfilePic: user.profilePic,
      username: user.username,
    };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply added successfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in replyToPost:", err);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("error in replyToPost:", err);
  }
};

export {
  createPost,
  getPosts,
  deletePost,
  likeAndUnLikePost,
  replyToPost,
  getFeedPosts,
};
