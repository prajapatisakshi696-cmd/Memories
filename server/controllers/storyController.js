import Story from "../models/Story.js";
import Follow from "../models/Follow.js";
import cloudinary from "../configs/cloudinary.js";

// GET /api/stories — stories from people you follow + your own
export const getStories = async (req, res) => {
  try {
    const userId = req.user.id;

    const followingDocs = await Follow.find({ followerId: userId }).select("userId");
    const followingIds = followingDocs.map((f) => f.userId);

    const relevantUserIds = [...followingIds, userId];

    const stories = await Story.find({ user: { $in: relevantUserIds } })
      .populate("user", "username full_name profile_picture")
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories — create a new story (text, image, or video)
export const createStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, background_color, media_type } = req.body;

    if (!media_type || !["text", "image", "video"].includes(media_type)) {
      return res.status(400).json({ message: "Invalid or missing media_type" });
    }

    let media_url = "";

    if (media_type !== "text") {
      if (!req.file) {
        return res.status(400).json({ message: "Media file is required" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stories",
        resource_type: media_type === "video" ? "video" : "image",
      });

      media_url = result.secure_url;
    }

    const newStory = await Story.create({
      user: userId,
      content: content || "",
      media_url,
      media_type,
      background_color: background_color || "#4f46e5",
    });

    const populatedStory = await newStory.populate(
      "user",
      "username full_name profile_picture"
    );

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/stories/:id — only the owner can delete their own story
export const deleteStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own story" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};