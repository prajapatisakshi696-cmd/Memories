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
  console.log("CREATE POST API HIT");
  console.log("FILES:", req.files);
  try {
    let imageUrls = [];

for (const file of req.files) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "create-post",
  });

  console.log("FULL RESULT:", result);
  // console.log("SECURE URL:", result.secure_url);

  console.log("Cloudinary Result:", result);
  console.log("Secure URL:", result.secure_url);

  imageUrls.push(result.secure_url);
}

console.log("Final Image URLs:", imageUrls);

console.log("Image URLs:", imageUrls);

    const newPost = new Post({
      title: req.body.title,
      message: req.body.message,
      user: req.body.userId,
      images: imageUrls,
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