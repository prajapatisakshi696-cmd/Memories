import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react'
import { API_BASE } from '../helper';

const Discover = () => {
 const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

const navigate = useNavigate();

  const handleSearch = async () => {
    const res = await fetch(`${API_BASE}/api/users/search?query=${search}`);
    const data = await res.json();
    setUsers(data);
  };

   const handleFollow = async (userId) => {
    await fetch(`${API_BASE}/api/users/${userId}/follow`, {
      method: "POST",
      body: JSON.stringify({ followerId: currentUser._id }),
      headers: { "Content-Type": "application/json" }
    });
    // Optionally refresh list
  };

   useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${API_BASE}/api/users/discover/${currentUser._id}`);
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [currentUser]);

  return (
  <div className="px-6 py-8 max-w-4xl mx-auto">
    <div className="">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Discover People
        </h1>
        <p className="text-slate-600">
          Connect with amazing people and grow your network
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 border border-slate-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 w-full max-w-md">
          <Search className="text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search people by name, username, bio or location"
            className="flex-1 outline-none text-slate-700 placeholder-slate-400"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyUp={handleSearch}
          />
        </div>
        
      </div>
    </div>
  </div>
)
}
export default Discover