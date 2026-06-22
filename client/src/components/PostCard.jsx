import React, { useEffect, useState } from "react";
import {BadgeCheck,Heart, MessageCircle,Trash2,MoreVertical} from "lucide-react";
import Avatar from "react-avatar";
import { useAuth } from "../AuthContext";
import { API_BASE, getImageUrl } from "../helper";
import moment from "moment";

const PostCard = ({ post, feeds, setFeeds, user }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

// const getProfilePicture = (post) => {
//   console.log("Profile Picture:", post.userId?.profile_picture);

//   if (post.userId?.profile_picture) {
//     return post.userId.profile_picture;
//   }

//   return null;
// };

  // ---------------- Like handler ----------------
  const handleLike = async (postId) => {
    try {
      const localUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!localUser?._id) return;

      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: localUser._id }),
      });

      const updatedPost = await res.json();

      setFeeds((prevFeeds) =>
        prevFeeds.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ---------------- Comment handler ----------------
  const handleComment = async () => {
    if (!comment.trim() || !currentUser?._id) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser.full_name || currentUser.username,
          text: comment,
        }),
      });

      const updatedPost = await res.json();

      setFeeds((prevFeeds) =>
        prevFeeds.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );

      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/users/${targetUserId}/follow`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser._id,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  // ---------------- Follow handler ----------------
  useEffect(() => {
  const checkFollow = async () => {
    if (!currentUser?._id || !post.userId?._id) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/users/${currentUser._id}/following`
      );

      const data = await res.json();

      console.log("Following API Response:", data);

      if (Array.isArray(data)) {
        const alreadyFollowing = data.some(
          (user) => user._id === post.userId._id
        );

        setIsFollowing(alreadyFollowing);
      } else {
        console.error("Expected array but got:", data);
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Check follow error:", err);
      setIsFollowing(false);
    }
  };

  checkFollow();
}, [currentUser, post.userId]);

console.log(
  "Final Profile URL:",
  getImageUrl(post.userId?.profile_picture)
);

const handleDelete = async (postId) => {
  console.log("Deleting post:", postId);

  try {
    const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    console.log("Delete Response:", data);

    if (res.ok) {
      setFeeds((prev) => prev.filter((p) => p._id !== postId));
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};


  return (
  <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
    {/* TOP ROW */}
    <div className="flex items-start justify-between">
      {/* LEFT SIDE - User Info */}
      <div className="flex items-center gap-3 cursor-pointer">
        {post.userId?.profile_picture ? (
          <img
            src={getImageUrl(post.userId.profile_picture)}
            alt={post.userId?.username || "User"}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => console.log("Failed URL:", e.target.src)}
          />
        ) : (
          <Avatar
            name={post.userId?.full_name || post.creator || "User"}
            size="48"
            round
          />
        )}

        <div>
          <p className="font-semibold flex items-center gap-1">
            {getFullName(post)}
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </p>

          <p className="text-sm text-gray-500">@{getUsername(post)}</p>

          <p className="text-xs text-gray-400">
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - 3 Dots Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
            {currentUser?._id !== post.userId?._id && (
              <button
                onClick={() => {
                  handleFollow(post.userId?._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            {currentUser?._id === post.userId?._id && (
              <button
                onClick={() => {
                  handleDelete(post._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Post Content */}
    <div className="text-gray-800 text-sm whitespace-pre-line">
      <p className="font-semibold">{post.title}</p>
    </div>

    {/* Post images */}
    {post.images && post.images.length > 0 && (
      <div className="mt-3 space-y-2">
        {post.images.map((img, index) => (
          <img
            key={index}
            src={img}
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
              (id) => id.toString() === currentUser._id.toString()
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
