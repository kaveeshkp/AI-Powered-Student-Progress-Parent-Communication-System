import api from "./api";

export async function register(payload) {
  try {
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    // Re-throw with proper Error object to ensure message is accessible
    const err = new Error(error.message || "Registration failed");
    err.status = error.status;
    err.data = error.data;
    throw err;
  }
}

export async function login(payload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    // Re-throw with proper Error object to ensure message is accessible
    const err = new Error(error.message || "Login failed");
    err.status = error.status;
    err.data = error.data;
    throw err;
  }
}
