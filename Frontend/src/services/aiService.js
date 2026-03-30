import api from "./api";

export async function getClassInsights(params = {}) {
  const response = await api.get("/ai/insights/class", { params });
  return response.data;
}

export async function getStudentInsights(studentId, params = {}) {
  const response = await api.get(`/ai/insights/students/${studentId}`, { params });
  return response.data;
}
