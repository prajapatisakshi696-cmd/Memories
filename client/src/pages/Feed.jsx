import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import Sponsored from "../assets/sponsored_img.png";
import { useAuth } from "../AuthContext";
import { API_BASE, getImageUrl } from "../helper";

const Feed = ({ user }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch posts (GET request)
  console.log(API_BASE);
  const fetchPosts = async () => {
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/posts`);

    console.log("Status:", res.status);

    const data = await res.json();

    console.log("Posts:", data);

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

  // ✅ Show spinner only while loading
  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className="h-full overflow-y-scroll no-scrollbar py-10 
      xl:pr-5 flex items-start justify-center xl:gap-8"
    >
      {/* stories and post list */}
      <div>
        <StoriesBar />

        <div className="p-4 space-y-6">
          {feeds.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            feeds.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                feeds={feeds}
                setFeeds={setFeeds}
                user={user}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img src={Sponsored} alt="" className="w-75 h-50 rounded-md" />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-400">
            Supercharge your marketing with a powerful platform.
          </p>
        </div>

        <h1 className="mt-4 text-slate-800 font-semibold">Recent messages</h1>
      </div>
    </div>
  );
};

export default Feed;
