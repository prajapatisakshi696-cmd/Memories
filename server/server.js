import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import messageRoutes from "./routes/messages.js";
import usersRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import followRoutes from "./routes/follow.js";
import http from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.js";
import { initChatSocket } from "./socket/chatSocket.js";


dotenv.config();
console.log("ENV TEST:", process.env.CLOUD_NAME);
console.log("ENV API KEY:", process.env.CLOUDINARY_API_KEY);
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://memories-13ld.vercel.app", // another domain
  "https://memories-13ld-git-main-prajapatisakshi696-3250s-projects.vercel.app", // another domain
];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initChatSocket(io);

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
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
