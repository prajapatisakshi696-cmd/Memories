import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import Connections from "./pages/Connections";
import Messages from "./pages/Messages";
import { useAuth } from "./AuthContext";
import Discover from "./pages/Discover";

const App = () => {
 
  const [loading, setLoading] = useState(true);
const { currentUser, logout } = useAuth();


  return (
    <Routes>
      {!currentUser ? (
        <>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
         <Route path="/" element={<Layout user={currentUser} onLogout={logout} />}>
  <Route index element={<Feed user={currentUser} />} />
   <Route path="feed" element={<Feed user={currentUser} />} />
   <Route path="create-post" element={<CreatePost user={currentUser} />} />
   <Route path="profile" element={<Profile />} />
   <Route path="profile/:profileId" element={<Profile />} />
   <Route path="connections" element={<Connections />} />
   <Route path="discover" element={<Discover />}/>
   <Route path="messages" element={<Messages />} />
   {/* <Route path="likebutton" element={<LikeButton/>}/>
   <Route path="comment" element={<CommentSection/>}/> */}
   <Route path="messages/:userId" element={<Messages />} />
   <Route path="*" element={<Navigate to="/feed" replace />} />
 </Route>
        </>
      )}
    </Routes>
  );
};

export default App;