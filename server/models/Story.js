import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    media_url: {
      type: String,
      default: "",
    },
    media_type: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
    },
    background_color: {
      type: String,
      default: "#4f46e5",
    },
  },
  { timestamps: true }
);

// Auto-delete stories 24 hours after creation (TTL index)
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("Story", storySchema);