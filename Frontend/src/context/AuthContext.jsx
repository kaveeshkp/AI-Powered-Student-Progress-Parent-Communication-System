import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";
import { decodeJwt } from "../utils/jwt";

const AuthContext = createContext(null);
const STORAGE_KEY = "authToken";
const DEV_MODE = false; // ✅ DISABLED - Users must login now!

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
  // Check for stored token
  const existingToken = localStorage.getItem(STORAGE_KEY);

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
    try {
      const data = await loginRequest(credentials);
      setSession(data.token, data);
      return data;
    } catch (error) {
      console.error("[Login Error]", error);
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const data = await registerRequest(payload);
      setSession(data.token, data);
      return data;
    } catch (error) {
      console.error("[Register Error]", error);
      throw error;
    }
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
