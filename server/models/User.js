import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  { 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",
      //  required: true 
      },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    full_name:{
      type: String,
      // required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      // required: true,
    },
    location: { 
      type: String
     },
    profile_picture: { 
      type: String 
    },
    followers: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: "User"
     }],
    following: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: "User" 
    }],

  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("User", userSchema);