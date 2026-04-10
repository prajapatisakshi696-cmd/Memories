// models/Follow.js
import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // jisko follow kiya
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // jisne follow kiya
  },
  { timestamps: true }
);

export default mongoose.model("Follow", followSchema);