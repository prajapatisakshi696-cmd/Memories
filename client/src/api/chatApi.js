import { API_BASE } from "../helper";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const fetchConversations = async () => {
  const res = await fetch(`${API_BASE}/api/chat/conversations`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const fetchMessages = async (conversationId) => {
  const res = await fetch(
    `${API_BASE}/api/chat/messages/${conversationId}`,
    { headers: authHeaders() }
  );
  return handleResponse(res);
};

export const sendMessageApi = async (receiverId, text) => {
  const res = await fetch(`${API_BASE}/api/chat/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ receiverId, text }),
  });
  return handleResponse(res);
};

export const markSeenApi = async (conversationId) => {
  const res = await fetch(`${API_BASE}/api/chat/seen`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ conversationId }),
  });
  return handleResponse(res);
};