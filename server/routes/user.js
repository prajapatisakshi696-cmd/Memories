import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";

const router = express.Router();

// Get followers of a user
router.get("/:id/followers", async (req, res) => {
  try {
    const followers = await Follow.find({ userId: req.params.id })
      .populate("followerId", "username full_name profile_picture");

    res.json(followers.map((f) => f.followerId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get following of a user
router.get("/:id/following", async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.params.id })
      .populate("userId", "username full_name profile_picture");

    res.json(following.map((f) => f.userId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get follow counts
router.get("/:id/follow-count", async (req, res) => {
  try {
    const followersCount = await Follow.countDocuments({
      userId: req.params.id,
    });

    const followingCount = await Follow.countDocuments({
      followerId: req.params.id,
    });

    res.json({
      followers: followersCount,
      following: followingCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discover users
router.get("/discover/:id", async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.params.id },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search users
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { full_name: { $regex: query, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Follow / Unfollow user
router.put("/:id/follow", async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = req.params.id;

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      followerId: userId,
      userId: targetUserId,
    });

    if (existingFollow) {
      await Follow.deleteOne({
        followerId: userId,
        userId: targetUserId,
      });

      return res.json({ following: false });
    }

    await Follow.create({
      followerId: userId,
      userId: targetUserId,
    });

    res.json({ following: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.patch("/:id", upload.single("profile_picture"), async (req, res) => {
  try {
    const { full_name, username, bio, location } = req.body;

    const updateData = {};

    if (full_name) updateData.full_name = full_name;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;

    if (req.file) {
      updateData.profile_picture = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single user by ID (ALWAYS KEEP THIS LAST)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;