import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    
    // Extract message from various possible error structures
    let message = "Request failed";
    
    if (errorData?.message) {
      message = errorData.message;
    } else if (errorData?.error) {
      message = typeof errorData.error === "string" ? errorData.error : errorData.error.message || "Request failed";
    } else if (errorData?.errors) {
      // Handle validation errors array
      if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        message = errorData.errors.map(e => e.message || e.field || e).join(", ");
      }
    } else if (error.message) {
      message = error.message;
    }

    const normalizedError = {
      status: error.response?.status,
      message: message,
      data: errorData ?? null
    };

    console.error("[API Error]", { status: normalizedError.status, message: normalizedError.message, data: normalizedError.data });

    // Surface a consistent error shape to callers.
    return Promise.reject(normalizedError);
  }
);

export default api;
