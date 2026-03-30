import api from "./api";

export async function getStudents(params = {}) {
  const response = await api.get("/students", { params });
  return response.data;
}

export async function getStudentById(studentId) {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
}

export async function getStudentGrades(studentId) {
  const response = await api.get(`/students/${studentId}/grades`);
  return response.data;
}

export async function getStudentAttendance(studentId) {
  const response = await api.get(`/students/${studentId}/attendance`);
  return response.data;
}

export async function getStudentsSummary() {
  const response = await api.get("/students/summary");
  return response.data;
}
