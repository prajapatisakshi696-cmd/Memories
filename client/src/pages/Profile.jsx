import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import ProfileModal from "../components/ProfileModal";
import { useAuth } from "../AuthContext";
import { API_BASE } from '../helper';

const Profile = () => {
  const { profileId } = useParams();   // param name from Route
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (profileId) {
          // viewing someone else
          const res = await fetch(`${API_BASE}/api/users/${profileId}`);
          const data = await res.json();
          if (res.ok) setUser(data);
          else setUser(null);
        } else {
          // viewing own profile
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, [profileId, currentUser]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const idToFetch = profileId || currentUser?._id;
        if (!idToFetch) return;

        const res = await fetch(`${API_BASE}/api/posts/user/${idToFetch}`);
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [profileId, currentUser]);

  if (!user) return <Loading />;

  return (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user?.cover_photo && (
              <img src={user.cover_photo} alt="" className="w-full h-full object-cover" />
            )}
          </div>

          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdits={() => setShowModal(true)}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {["posts", "media"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm rounded-lg ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.length === 0 ? (
                <p>No posts yet</p>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    feeds={posts}
                    setFeeds={setPosts}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 gap-2">
              {posts.filter((post) => post.image).map((post) => (
                <Link key={post._id} to={post.image} target="_blank">
                  <img src={post.image} className="w-40 h-40 object-cover" alt="" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Profile;
