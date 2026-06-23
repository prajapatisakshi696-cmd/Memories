import React, { useState, useEffect, useRef } from "react";
import { Pencil, X as CloseIcon } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { API_BASE, getImageUrl } from "../helper";
const ProfileModal = ({ onClose }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [editForm, setEditForm] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    profile_picture: null,
    full_name: currentUser?.full_name || "",
  });

  useEffect(() => {
  setEditForm({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    profile_picture: null,
    full_name: currentUser?.full_name || "",
  });
}, [currentUser]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", editForm.full_name);
    formData.append("username", editForm.username);
    formData.append("bio", editForm.bio);
    formData.append("location", editForm.location);
    if (editForm.profile_picture) {
      formData.append("profile_picture", editForm.profile_picture);
    }

    try {
      const res = await fetch(
  `${API_BASE}/api/users/${currentUser._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      onClose();
      navigate("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <CloseIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="relative w-24 h-24">
              {currentUser?.profile_picture ? (
                <img
                  src={getImageUrl(currentUser.profile_picture)}
                  alt={currentUser?.username}
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <Avatar
                  name={currentUser?.full_name || currentUser?.username || "User"}
                  size="96"
                  round={true}
                  color={Avatar.getRandomColor("sitebase", ["red", "green", "blue"])}
                />
              )}
              <div
                className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={(e) =>
                setEditForm({ ...editForm, profile_picture: e.target.files[0] })
              }
            />
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.full_name}
              onChange={(e) =>
                setEditForm({ ...editForm, full_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;