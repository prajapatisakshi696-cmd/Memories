import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { useSocket } from "../context/SocketContext";
import { Search, UserPlus, UserCheck } from "lucide-react";
import { API_BASE, getImageUrl } from "../helper";
import UserAvatar from "../components/UserAvatar";

const Discover = () => {
  const { currentUser } = useAuth();
  const { isUserOnline } = useSocket();

  const [allUsers, setAllUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'following'
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const [usersRes, followingRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/discover/${currentUser._id}`),
        fetch(`${API_BASE}/api/users/${currentUser._id}/following`),
      ]);

      const usersData = await usersRes.json();
      const followingData = await followingRes.json();

      setAllUsers(usersData);
      setFollowingIds(new Set(followingData.map((u) => u._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async (query) => {
    setSearchInput(query);
    if (!query.trim()) {
      loadData();
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/users/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setAllUsers(data.filter((u) => u._id !== currentUser._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (targetUserId) => {
    const isCurrentlyFollowing = followingIds.has(targetUserId);

    // Optimistic UI update
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) {
        next.delete(targetUserId);
      } else {
        next.add(targetUserId);
      }
      return next;
    });

    try {
      await fetch(`${API_BASE}/api/users/${targetUserId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id }),
      });
    } catch (err) {
      console.error(err);
      // Revert on failure
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyFollowing) {
          next.add(targetUserId);
        } else {
          next.delete(targetUserId);
        }
        return next;
      });
    }
  };

  const displayedUsers =
    activeTab === "following"
      ? allUsers.filter((u) => followingIds.has(u._id))
      : allUsers;

  const suggestions = allUsers
    .filter((u) => !followingIds.has(u._id))
    .slice(0, 4);

  return (
    <div className="px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Discover People
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          Connect with amazing people and grow your network 💜
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 border border-slate-200 bg-white rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 w-full max-w-md">
          <Search className="text-slate-400 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Search people by name, username, bio or location"
            className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm bg-transparent"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchInput}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === "following"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Following
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main grid */}
        <div>
          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading...</div>
          ) : displayedUsers.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              {activeTab === "following"
                ? "You're not following anyone yet"
                : "No users found"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  isFollowing={followingIds.has(user._id)}
                  isOnline={isUserOnline(user._id)}
                  onFollow={() => handleFollow(user._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Suggestions sidebar */}
        {suggestions.length > 0 && (
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-4">
              <h3 className="font-semibold text-slate-900 mb-4">
                Suggestions for you
              </h3>
              <div className="space-y-4">
                {suggestions.map((user) => (
                  <div key={user._id} className="flex items-center gap-3">
                    <UserAvatar user={user} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate text-slate-900">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFollow(user._id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shrink-0 hover:shadow-md transition-shadow"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user, isFollowing, isOnline, onFollow }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
         <UserAvatar user={user} size={48} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 truncate">
            {user.full_name || user.username}
          </h3>
          <p className="text-xs text-slate-400 truncate">@{user.username}</p>
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{user.bio}</p>
      )}

      {user.location && (
        <p className="text-xs text-slate-400 mb-3">📍 {user.location}</p>
      )}

      <button
        onClick={onFollow}
        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
          isFollowing
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md"
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck size={16} /> Following
          </>
        ) : (
          <>
            <UserPlus size={16} /> Follow
          </>
        )}
      </button>
    </div>
  );
};

export default Discover;