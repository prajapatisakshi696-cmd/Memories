import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import cloudinary, { storage } from "../configs/cloudinary.js";

const router = express.Router();

const upload = multer({ storage });

router.post("/create-post", upload.array("images", 5), async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const images = req.files
      ? req.files.map((file) => file.path)
      : [];

    console.log("Images:", images);

    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      userId: req.body.userId,
      creator: req.body.creator,
      images,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ================= GET ALL POSTS =================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username full_name profile_picture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET USER POSTS =================
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate("userId", "username full_name profile_picture")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LIKE POST =================
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Toggle like/unlike
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "userId",
      "username full_name profile_picture"
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= COMMENT =================
router.post("/:postId/comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user, text };
    post.comments.push(newComment);

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/test", (req, res) => {
  res.send("Posts router working!");
});

export default router;
