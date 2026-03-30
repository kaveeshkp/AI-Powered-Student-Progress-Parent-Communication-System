import api from "./api";

export async function getThreads() {
  const response = await api.get("/messages/threads");
  return response.data;
}

export async function getThreadMessages(threadId) {
  const response = await api.get(`/messages/threads/${threadId}`);
  return response.data;
}

export async function sendMessage(threadId, payload) {
  const response = await api.post(`/messages/threads/${threadId}/messages`, payload);
  return response.data;
}
