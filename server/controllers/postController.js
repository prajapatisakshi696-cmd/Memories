import Post from "../models/Posts.js";
import cloudinary from "../configs/cloudinary.js";

// GET all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username full_name profile_picture").sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new post
export const createPost = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "create-post",
      });
      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.body.userId,
      image: imageUrl,
    });

    await newPost.save();
    const populatedPost = await newPost.populate("user", "username full_name profile_picture");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE LIKE (like/unlike)
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.body.userId;

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await post.populate("user", "username full_name profile_picture");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { userId, username, text } = req.body;

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, username, text, createdAt: new Date() });
    await post.save();

    const updatedPost = await post.populate("user", "username full_name profile_picture");

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};