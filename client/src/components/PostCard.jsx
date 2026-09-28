import React, { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  MapPin,
  Send,
  Check,
  Link2,
  ThumbsUp,
  Smile,
} from "lucide-react";
import Avatar from "react-avatar";
import { useAuth } from "../AuthContext";
import { API_BASE, getImageUrl } from "../helper";
import moment from "moment";
 
const PostCard = ({ post, feeds, setFeeds, user }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [heartBurst, setHeartBurst] = useState(false);
  // UI-only state
  const [likePop, setLikePop] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
 
  const menuRef = useRef(null);
  const commentInputRef = useRef(null);
 
  // ---------------- Helper functions ----------------
  const getUsername = (post) => {
    if (post.userId?.username) return post.userId.username;
    if (post.userId?.full_name) return post.userId.full_name;
    if (post.username) return post.username;
    if (post.creator) return post.creator;
    return "Nobody";
  };
 
  const isLiked =
    currentUser &&
    post.likes?.some((id) => id.toString() === currentUser._id?.toString());
 
  const images = post.images || [];
  const isOwnPost = currentUser?._id === post.userId?._id;
 
  // Renders #hashtags as clean indigo text, rest stays plain
  const renderCaption = (text) =>
    text.split(/(#[\p{L}\p{N}_]+)/gu).map((part, i) =>
      part.startsWith("#") ? (
        <span
          key={i}
          className="text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer"
        >
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
 
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
 
  const onLikeClick = () => {
    setLikePop(true);
    setTimeout(() => setLikePop(false), 250);
    handleLike(post._id);
  };
 
  // Double tap on image = like (sirf like karta hai, unlike nahi)
  const handleDoubleClickLike = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 700);
    if (!isLiked) handleLike(post._id);
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
 
  // ---------------- Follow handler ----------------
  const handleFollow = async (targetUserId) => {
    if (!currentUser?._id) return;
 
    try {
      const res = await fetch(`${API_BASE}/api/users/${targetUserId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      });
 
      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };
 
  useEffect(() => {
    const checkFollow = async () => {
      if (!currentUser?._id || !post.userId?._id) return;
 
      try {
        const res = await fetch(
          `${API_BASE}/api/users/${currentUser._id}/following`
        );
        const data = await res.json();
 
        if (Array.isArray(data)) {
          setIsFollowing(data.some((u) => u._id === post.userId._id));
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("Check follow error:", err);
        setIsFollowing(false);
      }
    };
 
    checkFollow();
  }, [currentUser, post.userId]);
 
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  // ---------------- Delete handler ----------------
  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "DELETE",
      });
 
      if (res.ok) {
        setFeeds((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
 
  // ---------------- Share / copy link (front-end only) ----------------
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // clipboard blocked: nothing to do
    }
  };
 
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Memories",
          text: post.title || "Check out this post on Memories",
          url: window.location.href,
        });
      } else {
        await copyLink();
      }
    } catch (err) {
      // user cancelled the share sheet
    }
  };
 
  const comments = post.comments || [];
  const visibleComments = showAllComments ? comments : comments.slice(0, 1);
  const likeCount = post.likes?.length || 0;
  const location = post.location || post.userId?.location;
 
  return (
    <article className="bg-white rounded-2xl w-full border border-slate-100 shadow-[0_2px_12px_rgba(99,102,241,0.06)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.12)] transition-shadow duration-300">
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          {post.userId?.profile_picture ? (
            <img
              src={getImageUrl(post.userId.profile_picture)}
              alt={post.userId?.username || "User"}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
          ) : (
            <Avatar
              name={post.userId?.full_name || post.creator || "User"}
              size="44"
              round
            />
          )}
 
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 truncate">
                {getUsername(post)}
              </span>
              <BadgeCheck className="w-[18px] h-[18px] fill-blue-500 text-white shrink-0" />
            </div>
 
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span className="shrink-0">
                {moment(post.createdAt).fromNow(true)} ago
              </span>
              {location && (
                <>
                  <span>•</span>
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">{location}</span>
                </>
              )}
            </div>
          </div>
        </div>
 
        <div className="flex items-center gap-1.5 shrink-0">
          {!isOwnPost && (
            <button
              onClick={() => handleFollow(post.userId?._id)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition hover:scale-105 active:scale-95 ${
                isFollowing
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
 
          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
 
            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    copyLink();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition"
                >
                  <Link2 size={16} />
                  Copy link
                </button>
 
                {isOwnPost && (
                  <button
                    onClick={() => {
                      handleDelete(post._id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <Trash2 size={16} />
                    Delete post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
 
      {/* ---------- Caption ---------- */}
      {post.title && (
        <p className="px-4 sm:px-5 pt-1 pb-3 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line break-words">
          {renderCaption(post.title)}
        </p>
      )}
 
      {/* ---------- Image ---------- */}
      {images.length > 0 && (
        <div className="px-4 sm:px-5">
          <div
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 select-none group"
            onDoubleClick={handleDoubleClickLike}
          >
            <img
              src={images[imgIndex]}
              alt="post"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              draggable={false}
            />
 
            {/* Double tap heart */}
            {heartBurst && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart className="w-24 h-24 text-white fill-white animate-ping opacity-80" />
              </div>
            )}
 
            {/* Carousel arrows + dots (sirf multiple images par) */}
            {images.length > 1 && (
              <>
                {imgIndex > 0 && (
                  <button
                    onClick={() => setImgIndex(imgIndex - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-1.5 transition hover:scale-105"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-800" />
                  </button>
                )}
                {imgIndex < images.length - 1 && (
                  <button
                    onClick={() => setImgIndex(imgIndex + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full p-1.5 transition hover:scale-105"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-800" />
                  </button>
                )}
 
                <div className="absolute top-3 right-3 bg-black/55 text-white text-xs px-2.5 py-0.5 rounded-full">
                  {imgIndex + 1}/{images.length}
                </div>
 
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === imgIndex ? "w-4 bg-indigo-500" : "w-1.5 bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
 
      {/* ---------- Counts row ---------- */}
      <div className="flex items-center gap-2 px-4 sm:px-5 pt-3 text-xs text-slate-500">
        {likeCount > 0 && (
          <span className="flex -space-x-1.5" aria-hidden="true">
            <span className="w-5 h-5 rounded-full bg-blue-500 ring-2 ring-white flex items-center justify-center">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </span>
            <span className="w-5 h-5 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-400 ring-2 ring-white flex items-center justify-center">
              <Smile className="w-3 h-3 text-white" />
            </span>
          </span>
        )}
        <span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <span>•</span>
        <button
          onClick={() => setShowAllComments(!showAllComments)}
          className="hover:text-indigo-600 transition"
        >
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </button>
      </div>
 
      {/* ---------- Actions ---------- */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-1 pb-2">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={onLikeClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition active:scale-95 ${
              isLiked
                ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                : "text-rose-400 hover:text-rose-500 hover:bg-rose-50"
            }`}
            aria-label="Like"
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-200 ${
                likePop ? "scale-125" : "scale-100"
              } ${isLiked ? "fill-rose-500" : ""}`}
            />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>
 
          <button
            onClick={() => commentInputRef.current?.focus()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95"
            aria-label="Comment"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Comment</span>
          </button>
 
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95"
            aria-label="Share"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-500" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
          </button>
        </div>
 
        <button
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-lg transition active:scale-95 ${
            saved
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
          aria-label="Save"
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-indigo-600" : ""}`} />
        </button>
      </div>
 
      {/* ---------- Comments ---------- */}
      {comments.length > 0 && (
        <div className="px-4 sm:px-5 pt-1 pb-1 space-y-1.5 border-t border-slate-100 mt-1">
          <div className="pt-3" />
          {comments.length > 1 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition"
            >
              {showAllComments
                ? "Hide comments"
                : `View all ${comments.length} comments`}
            </button>
          )}
 
          {visibleComments.map((c, index) => (
            <p key={index} className="text-sm text-slate-700">
              <span className="font-semibold text-slate-800 mr-1.5">{c.user}</span>
              {c.text}
            </p>
          ))}
        </div>
      )}
 
      {/* ---------- Add comment ---------- */}
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3">
        <input
          ref={commentInputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
          placeholder="Add a comment..."
          className="flex-1 min-w-0 text-sm bg-slate-50 rounded-full px-4 py-2 outline-none placeholder-slate-400 focus:ring-2 focus:ring-indigo-200 transition"
        />
        <button
          onClick={handleComment}
          disabled={!comment.trim()}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Post comment"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
 
export default PostCard;