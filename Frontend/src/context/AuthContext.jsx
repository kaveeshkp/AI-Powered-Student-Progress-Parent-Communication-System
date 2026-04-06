import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";
import { decodeJwt } from "../utils/jwt";

const AuthContext = createContext(null);
const STORAGE_KEY = "authToken";
const DEV_MODE = true; // Set to false to disable dev mode

// Mock token for development testing
const MOCK_DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDAwIiwiZnVsbE5hbWUiOiJBZG1pbiBVc2VyIiwic3ViIjoiYWRtaW5AZGV2LnRlc3QiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE0MjI3NzU5MjR9.DhO1-ECKLqbPSMF-7GRt5j5PXLM2H35HG7B_qj3Wm5E";

function parseToken(token) {
  if (!token) return null;
  try {
    return decodeJwt(token);
  } catch (err) {
    console.warn("Failed to decode token, using fallback:", err.message);
    return null;
  }
}

function buildUser(token, fallback = {}) {
  const decoded = parseToken(token) || {};
  const role = fallback.role || decoded.role || null;

  return {
    id: fallback.userId || decoded.userId || null,
    fullName: fallback.fullName || decoded.fullName || "",
    email: fallback.email || decoded.sub || "",
    role
  };
}

export function AuthProvider({ children }) {
  // Check for stored token or use dev mode token
  let existingToken = localStorage.getItem(STORAGE_KEY);
  
  // Enable dev mode with mock admin user
  if (DEV_MODE && !existingToken) {
    existingToken = MOCK_DEV_TOKEN;
    localStorage.setItem(STORAGE_KEY, existingToken);
    console.log("✅ Development mode: Mock admin user token set");
  }

  const [token, setToken] = useState(existingToken);
  const [user, setUser] = useState(existingToken ? buildUser(existingToken) : null);
  
  console.log("🔐 Auth initialized - User:", user, "Token present:", !!token);

  const setSession = (nextToken, metadata = {}) => {
    if (nextToken) {
      localStorage.setItem(STORAGE_KEY, nextToken);
      setToken(nextToken);
      setUser(buildUser(nextToken, metadata));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    setSession(data.token, data);
    return data;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    setSession(data.token, data);
    return data;
  };

  const logout = () => setSession(null);

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
