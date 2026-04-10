import React, { useState, useEffect } from "react";
import { Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Connections = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [currentTab, setCurrentTab] = useState("Followers");

  // ✅ Fetch followers
  const fetchFollowers = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/followers`
      );
      if (!res.ok) return console.error("Followers API error");
      const data = await res.json();
      setFollowers(data); // now data is array of user objects
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch following
  const fetchFollowing = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/following`
      );
      if (!res.ok) return console.error("Following API error");
      const data = await res.json();
      setFollowing(data); // now data is array of user objects
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch counts
  const fetchCounts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/follow-count`
      );
      if (!res.ok) return console.error("Count API error");
      const data = await res.json();
      setCounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Load all data
  useEffect(() => {
    if (!currentUser?._id) return;
    fetchFollowers();
    fetchFollowing();
    fetchCounts();
  }, [currentUser]);

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Connections</h1>

        {/* Counts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <Users className="mx-auto mb-2" />
            <b className="text-xl">{counts.followers}</b>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <UserCheck className="mx-auto mb-2" />
            <b className="text-xl">{counts.following}</b>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`px-4 py-2 rounded ${
                currentTab === tab.label ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {tab.label} (
              {tab.label === "Followers" ? counts.followers : counts.following})
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {dataArray.find((item) => item.label === currentTab)?.value.length ===
            0 && (
            <p className="text-gray-500 text-center">
              No {currentTab.toLowerCase()} yet
            </p>
          )}

          {dataArray
            .find((item) => item.label === currentTab)
            ?.value.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.profile_picture
                        ? `http://localhost:5000${user.profile_picture}`
                        : <Avatar
          name={post.userId?.full_name || post.creator || "User"}
          size="48"
          round
        />
                    }
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user?.full_name || "User"}</p>
                    <p className="text-sm text-gray-500">
                      @{user?.username || "username"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  View Profile
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
