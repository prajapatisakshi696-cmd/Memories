// import { useEffect, useState } from "react";
// import { getImageUrl } from "../helper";

// const ChatBox = ({ currentUser, selectedUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     if (!currentUser?._id || !selectedUser?._id) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/messages/${currentUser._id}/${selectedUser._id}`,
//         );

//         const data = await res.json();
//         setMessages(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMessages();
//   }, [currentUser, selectedUser]);

//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     try {
//       const res = await fetch("http://localhost:5000/api/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sender: currentUser._id,
//           receiver: selectedUser._id,
//           text,
//         }),
//       });

//       const newMessage = await res.json();

//       setMessages((prev) => [...prev, newMessage]);
//       setText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-gray-500">
//         Select a user to start chatting
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-white">
//       {/* Header */}
//       <div className="border-b p-4 flex items-center gap-3">
//         <img
//           src={
//             selectedUser.profile_picture
//               ? getImageUrl(selectedUser.profile_picture)
//               : "https://ui-avatars.com/api/?name=User"
//           }
//           alt=""
//           className="w-12 h-12 rounded-full object-cover"
//         />

//         <div>
//           <h2 className="font-semibold text-lg">{selectedUser.full_name}</h2>

//           <p className="text-sm text-green-500">Active now</p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100">
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`mb-4 flex ${
//               msg.sender === currentUser._id ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl break-words ${
//                 msg.sender === currentUser._id
//                   ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
//                   : "bg-white shadow"
//               }`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="p-3 md:p-4 border-t bg-white">
//         <div className="flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 border rounded-full px-4 py-3"
//           />

//           <button
//             onClick={sendMessage}
//             className="px-4 md:px-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
