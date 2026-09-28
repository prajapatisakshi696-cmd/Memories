import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, Smile, Send, Flame, ArrowRight } from "lucide-react";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import Sponsored from "../assets/sponsored_img.png";
import { API_BASE, getImageUrl } from "../helper";

// ⚠️ Change this to your real create-post route
const CREATE_POST_PATH = "/create-post";

// Placeholder data: replace with your API when you have a suggestions endpoint
const SUGGESTED = [
  { id: 1, name: "Sneha Patel", bio: "Traveler | Blogger" },
  { id: 2, name: "Rohit Yadav", bio: "Software Engineer" },
  { id: 3, name: "Ananya Verma", bio: "Artist | Dreamer" },
  { id: 4, name: "Vikram Singh", bio: "Fitness | Lifestyle" },
];

const TRENDING = ["Travel", "Tech", "Lifestyle", "Food", "Photography", "Motivation"];

const Avatar = ({ src, name, size = "w-10 h-10" }) =>
  src ? (
    <img src={src} alt={name} className={`${size} rounded-full object-cover shrink-0`} />
  ) : (
    <div
      className={`${size} rounded-full shrink-0 bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-sm font-semibold`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );

const Feed = ({ user }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState({});
  const navigate = useNavigate();

  // Adjust these if your user object uses different field names
  const userName = user?.full_name || user?.name || user?.username || "there";
  const firstName = userName.split(" ")[0];
  const userPic = user?.profile_picture ? getImageUrl(user.profile_picture) : null;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      const data = await res.json();
      setFeeds(data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full overflow-y-scroll no-scrollbar bg-gradient-to-b from-slate-50 to-indigo-50/40 py-6 px-3 sm:px-6 flex items-start justify-center gap-6 lg:gap-8">
      {/* Center column */}
      <div className="w-full max-w-[800px] min-w-0 ">
        {/* Composer */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-3 flex items-center gap-3">
          <Avatar src={userPic} name={userName} />
          <button
            onClick={() => navigate(CREATE_POST_PATH)}
            className="flex-1 min-w-0 text-left truncate bg-slate-50 hover:bg-slate-100 transition-colors rounded-full px-4 py-2.5 text-sm text-slate-400"
          >
            What's on your mind, {firstName}?
          </button>
          <button
            onClick={() => navigate(CREATE_POST_PATH)}
            className="hidden sm:flex p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            aria-label="Add image"
          >
            <ImageIcon size={20} />
          </button>
          <button
            onClick={() => navigate(CREATE_POST_PATH)}
            className="hidden sm:flex p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </button>
          <button
            onClick={() => navigate(CREATE_POST_PATH)}
            className="p-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:scale-105 active:scale-95 transition"
            aria-label="Create post"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Stories */}
        <div className="mt-4 overflow-x-auto no-scrollbar rounded-2xl">
          <StoriesBar />
        </div>

        {/* Posts */}
        <div className="py-4 space-y-5">
          {feeds.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-500">
              No posts yet
            </div>
          ) : (
            feeds.map((post) => (
              <div
                key={post._id}
                className="rounded-2xl transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-100/60"
              >
                <PostCard post={post} feeds={feeds} setFeeds={setFeeds} user={user} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right sidebar (desktop only, same breakpoint as before) */}
      <div className="max-xl:hidden sticky top-0 w-80 shrink-0 space-y-4">
        {/* Suggested */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Suggested for You</h3>
            <span className="text-xs text-indigo-500 cursor-pointer hover:underline">See All</span>
          </div>
          <div className="space-y-4">
            {SUGGESTED.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <Avatar name={s.name} size="w-11 h-11" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400 truncate">{s.bio}</p>
                </div>
                <button
                  onClick={() => setFollowed((f) => ({ ...f, [s.id]: !f[s.id] }))}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition hover:scale-105 active:scale-95 ${
                    followed[s.id]
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                  }`}
                >
                  {followed[s.id] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="flex items-center gap-1.5 font-semibold text-slate-800 text-sm mb-3">
            <Flame size={16} className="text-orange-500" /> Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer transition"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Community card */}
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
          <div className="h-28 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 flex items-center justify-center">
            <span className="text-2xl font-semibold italic text-indigo-700/80">Better Together</span>
          </div>
          <div className="p-4 flex items-end gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Real people. Real connections.</p>
              <p className="text-xs text-slate-500 mt-1">
                Discover, share and grow with amazing people around the world.
              </p>
            </div>
            <button
              className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-110 transition"
              aria-label="Discover"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Existing sponsored card, kept */}
        <div className="bg-white text-xs p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img src={Sponsored} alt="" className="w-full h-auto rounded-xl" />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-400">Supercharge your marketing with a powerful platform.</p>
        </div>

        <h1 className="text-slate-800 font-semibold">Recent messages</h1>
      </div>
    </div>
  );
};

export default Feed;