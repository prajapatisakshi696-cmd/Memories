import { ArrowLeft, TextIcon, Sparkle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE } from "../helper";

const StoryModal = ({ setShowModal, fetchstories }) => {
  const bgColors = [
    "#ef4444",
    "#3b82f6",
    "#000000",
    "#22c55e",
    "#ffffff",
    "#a855f7",
    "#0ea5e9",
  ];
  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async () => {
    if (mode === "text" && !text.trim()) {
      throw new Error("Please write something for your story");
    }
    if (mode === "media" && !media) {
      throw new Error("Please select an image or video");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (mode === "text") {
        formData.append("media_type", "text");
        formData.append("content", text.trim());
        formData.append("background_color", background);
      } else {
        const isVideo = media.type.startsWith("video");
        formData.append("media_type", isVideo ? "video" : "image");
        formData.append("media", media);
        formData.append("content", text.trim());
      }

      const res = await fetch(`${API_BASE}/api/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create story");
      }

      await fetchstories();
      setShowModal(false);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    toast.promise(handleCreateStory(), {
      loading: "Saving...",
      success: <p>Story added</p>,
      error: (e) => <p>{e.message}</p>,
    });
  };

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: mode === "text" ? background : "#000" }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video
                src={previewUrl}
                className="object-contain max-h-full"
                controls
              />
            ))}
        </div>

        {mode === "text" && (
          <div className="flex mt-4 gap-2">
            {bgColors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full ring cursor-pointer ${
                  background === color ? "ring-2 ring-white" : "ring-white/30"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setBackground(color)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
              type="file"
              accept="image/*, video/*"
              className="hidden"
            />
            Upload Media
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkle size={18} /> {loading ? "Saving..." : "Create Story"}
        </button>
      </div>
    </div>
  );
};

export default StoryModal;