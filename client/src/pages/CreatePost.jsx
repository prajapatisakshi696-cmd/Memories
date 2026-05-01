import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE, getImageUrl } from '../helper';
import Avatar from "react-avatar";
const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const storedUser =
    JSON.parse(localStorage.getItem("currentUser")) || dummyUserData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Stored User:", storedUser);
    try {
      const formData = new FormData();
      formData.append("title", content);
      formData.append("message", content);
      formData.append("userId", storedUser._id);
      formData.append("creator", storedUser?.username);
      console.log(storedUser);
      // append multiple images if available
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${API_BASE}/api/posts/create-post`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");

      toast.success("Post Added ✅");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  console.log("Stored User:", storedUser);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto"
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
        <p className="text-sm text-gray-500">
          Share your thoughts with the world
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {storedUser?.profile_picture ? (
            <img
              src={getImageUrl(storedUser?.profile_picture)}
              alt={storedUser?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Avatar
              name={storedUser?.full_name || storedUser?.username || "User"}
              size="48"
              round={true}
              color={Avatar.getRandomColor("sitebase", [
                "red",
                "green",
                "blue",
              ])}
            />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {storedUser?.full_name || storedUser?.username}
          </h2>
          <p className="text-sm text-gray-500">@{storedUser?.username}</p>
        </div>
      </div>

      <textarea
        placeholder="What's happening?"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={4}
        required
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {images.map((image, i) => (
            <div key={i} className="relative group">
              <img
                src={getImageUrl(URL.createObjectURL(image))}
                className="h-20 rounded-md object-cover"
                alt=""
              />
              <div
                onClick={() =>
                  setImages(images.filter((_, index) => index !== i))
                }
                className="absolute hidden group-hover:flex justify-center items-center 
                top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
              >
                <X className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        htmlFor="images"
        className="inline-block text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium mt-3"
      >
        Add Images
      </label>
      <input
        type="file"
        id="images"
        accept="image/*"
        hidden
        multiple
        onChange={(e) => setImages([...images, ...e.target.files])}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 
        hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition 
        text-white font-medium px-6 py-2 rounded-md cursor-pointer"
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
};

export default CreatePost;
