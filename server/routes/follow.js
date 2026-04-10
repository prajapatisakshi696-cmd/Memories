import Follow from "../models/Follow.js";
import User from "../models/User.js";
import express from "express";

const router = express.Router();

// ✅ GET FOLLOWERS
router.get("/:id/followers", async (req, res) => {
  try {
    const followers = await Follow.find({ userId: req.params.id })
      .populate("followerId", "full_name username profile_picture");
    res.json(followers.map(f => f.followerId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET FOLLOWING
router.get("/:id/following", async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.params.id })
      .populate("userId", "full_name username profile_picture");
    res.json(following.map(f => f.userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ FOLLOW / UNFOLLOW toggle
router.put("/:id/follow", async (req, res) => {
  const { userId } = req.body;
  if (userId === req.params.id) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }
  if (!userId || !req.params.id) {
    return res.status(400).json({ message: "Missing IDs" });
  }
});

// ✅ GET FOLLOW COUNTS
router.get("/:id/follow-count", async (req, res) => {
  try {
    const followersCount = await Follow.countDocuments({ userId: req.params.id });
    const followingCount = await Follow.countDocuments({ followerId: req.params.id });

    res.json({
      followers: followersCount,
      following: followingCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
