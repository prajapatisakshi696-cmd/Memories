import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { API_BASE, getImageUrl } from "../../helper";

const NewMessageModal = ({ currentUser, onClose, onSelectUser }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/users/${currentUser._id}/following`)
      .then((res) => res.json())
      .then(setFollowing)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser._id]);

  const filtered = following.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.full_name || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-[15px]">New Message</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loading ? (
            <div className="text-center text-gray-400 text-sm py-6">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-6">
              {search ? "No matches found" : "You're not following anyone yet"}
            </div>
          ) : (
            filtered.map((user) => (
              <button
                key={user._id}
                onClick={() => onSelectUser(user)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left"
              >
                <img
                  src={user.profile_picture ? getImageUrl(user.profile_picture) : "/avatar.png"}
                  alt={user.username}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-medium text-[15px] truncate">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;