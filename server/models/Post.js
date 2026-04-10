import mongoose from "mongoose";

// ---------------- Comment Schema ----------------
const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // name ya id (aapka choice)
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ---------------- Post Schema ----------------
const postSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    creator: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    images: [String],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [CommentSchema], // ✅ now correct
  },
  { timestamps: true }
);

// ---------------- Model Export ----------------
export default mongoose.model("Post", postSchema);