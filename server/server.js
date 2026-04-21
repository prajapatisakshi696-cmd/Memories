import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import usersRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import followRoutes from "./routes/follow.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://memories-xlaf-git-main-prajapatisakshi696-3250s-projects.vercel.app"
];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Static folder (IMPORTANT)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes); // better naming
app.use("/api/users", usersRoutes); 
app.use("/api/follow", followRoutes);


// Test route (optional but useful)
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