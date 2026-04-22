import React, { useEffect, useState } from "react";
import { BadgeCheck, Heart, MessageCircle } from "lucide-react";
import moment from "moment";
import Avatar from "react-avatar";
import { useAuth } from "../AuthContext";
import { API_BASE, UPLOADS_BASE} from '../helper';

const PostCard = ({ post, feeds, setFeeds, user }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // ---------------- Helper functions ----------------
  const getUsername = (post) => {
    if (post.userId?.username) return post.userId.username;
    if (post.userId?.full_name) return post.userId.full_name;
    if (post.username) return post.username;
    if (post.creator) return post.creator;
    return "Nobody";
  };

  const getFullName = (post) => {
    if (post.userId?.full_name) return post.userId.full_name;
    if (post.creator) return post.creator;
    return "Unknown User";
  };

  const getProfilePicture = (post) => {
    if (post.userId?.profile_picture)
      return `${API_BASE}${post.userId.profile_picture}`;
    return null; // fallback to Avatar
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_BASE}${imgPath}`;
  };

  // ---------------- Like handler ----------------
  const handleLike = async (postId) => {
    try {
      const localUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!localUser?._id) return;

      const res = await fetch(
        `${API_BASE}/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: localUser._id }),
        },
      );

      const updatedPost = await res.json();

      // ✅ Update frontend state
      setFeeds((prevFeeds) =>
        prevFeeds.map((p) => (p._id === updatedPost._id ? updatedPost : p)),
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ---------------- Comment handler ----------------
 const handleComment = async () => {
  if (!comment.trim() || !currentUser?._id) return;

  try {
    const res = await fetch(
      `${API_BASE}/api/posts/${post._id}/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser.full_name || currentUser.username,
          text: comment,
        }),
      }
    );

    const updatedPost = await res.json();

    setFeeds((prevFeeds) =>
      prevFeeds.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      )
    );

    setComment("");
  } catch (err) {
    console.error(err);
  }
};
// ---------------- Follow handler ----------------
const handleFollow = async (targetUserId) => {
  if (!currentUser?._id) return alert("Login required");

  try {
    const res = await fetch(
      `${API_BASE}/api/users/${targetUserId}/follow`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      }
    );

    const data = await res.json();
    console.log("Response:", data);

    // Toggle local state
    setIsFollowing((prev) => !prev);
  } catch (err) {
    console.error("Follow error:", err);
  }
};

// ---------------- Check follow status ----------------
useEffect(() => {
  const checkFollow = async () => {
    if (!currentUser?._id || !post.userId?._id) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/users/${currentUser._id}/following`
      );
      const data = await res.json();

      // Backend returns array of user objects
      const alreadyFollowing = data.some(
        (user) => user._id === post.userId._id
      );

      setIsFollowing(alreadyFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  checkFollow();
}, [currentUser, post.userId]);
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">

  {/* TOP ROW (User Info + Follow Button) */}
  <div className="flex items-start justify-between">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-3 cursor-pointer">
      {post.userId?.profile_picture ? (
        <img
          src={`${UPLOADS_BASE}${post.userId.profile_picture.replace("uploads/","")}`}
          alt={post.userId?.username || post.creator || "User"}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <Avatar
          name={post.userId?.full_name || post.creator || "User"}
          size="48"
          round
        />
      )}

      <div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold">
            {post.userId?.username || post.creator || "Nobody"}
          </span>
          <BadgeCheck className="w-4 h-4 text-blue-500"  
          />
        </div>

        <div className="text-gray-500 text-sm">
          {moment(post.createdAt).fromNow()}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE (Follow Button) */}
   <button
  onClick={() => handleFollow(post.userId?._id)}
  className="px-3 py-1 bg-blue-500 text-white rounded h-fit"
>
  {isFollowing ? "Unfollow" : "Follow"}
</button>

  </div>

      {/* Post Content */}
      <div className="text-gray-800 text-sm whitespace-pre-line">
        <p className="font-semibold">{post.title}</p>
      </div>
      {/* post image */}
      {post.images && post.images.length > 0 && (
        <div className="mt-3 space-y-2">
          {post.images.map((img, index) => (
            <img
              key={index}
              src={`${UPLOADS_BASE}${img.replace("uploads/","")}`}
              alt="post"
              className="w-full rounded-md"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 text-gray-600 text-sm pt-2 border-t border-gray-300">
        {/* Like */}
        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 cursor-pointer ${
              currentUser &&
              post.likes?.some(
                (id) => id.toString() === currentUser._id.toString(),
              )
                ? "text-red-500 fill-red-500"
                : ""
            }`}
            onClick={() => handleLike(post._id)}
          />
          <span>{post.likes?.length || 0}</span>
        </div>
       {/* Comment input */}
<div className="flex items-center gap-2">
  <MessageCircle className="w-4 h-4 text-gray-600" />

  <input
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    placeholder="Write a comment..."
    className="border p-1 rounded flex-1"
  />

  {/* Comment Button (ONLY for adding comment) */}
  <button
    onClick={handleComment}
    className="bg-blue-500 text-white px-3 py-1 rounded"
  >
    Comment
  </button>
</div>

{/* Show Comments */}
{post.comments
  ?.slice(0, showAllComments ? post.comments.length : 1)
  .map((c, index) => (
    <p key={index}>
      <span className="font-semibold">{c.user}</span> {c.text}
    </p>
  ))}

{/* See More Button */}
{post.comments?.length > 1 && (
  <div className="flex justify-end">
    <button
      onClick={() => setShowAllComments(!showAllComments)}
      className="text-blue-500 text-sm mt-1"
    >
      {showAllComments
        ? "See less"
        : `See more (${post.comments.length - 1})`}
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default PostCard;
