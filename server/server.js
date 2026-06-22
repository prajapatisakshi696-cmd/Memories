import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";

import usersRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import followRoutes from "./routes/follow.js";

dotenv.config();
console.log("ENV TEST:", process.env.CLOUD_NAME);
console.log("ENV API KEY:", process.env.CLOUDINARY_API_KEY);
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://memories-13ld.vercel.app", // another domain
  "https://memories-13ld-git-main-prajapatisakshi696-3250s-projects.vercel.app", // another domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Static folder
app.use(compression()); // enable gzip/brotli
app.use("/uploads", express.static("uploads", {
  maxAge: "1d", // cache for 1 day
}));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/follow", followRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
