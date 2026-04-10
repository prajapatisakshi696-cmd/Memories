
import express from "express";
import multer from "multer";
import Post from "../models/Post.js";

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= CREATE POST =================
router.post("/create-post", upload.array("images", 5), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files); // ✅ correct

    const { title, message, userId, creator } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId missing" });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const newPost = new Post({
      title,
      message,
      userId,
      creator,
      images,
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate(
      "userId",
      "username full_name profile_picture"
    );

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Server error" });
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

// routes/posts.js
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
router.get("/test", (req, res) => {
  res.send("Posts router working!");
});

// -------- Add comment --------
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
    res.status(200).json(updatedPost); // frontend ko updated post bhej rahe
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
