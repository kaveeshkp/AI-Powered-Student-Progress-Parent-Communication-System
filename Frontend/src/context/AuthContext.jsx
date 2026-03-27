import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";
import { decodeJwt } from "../utils/jwt";

const AuthContext = createContext(null);

function buildUserFromToken(token, fallback = {}) {
  const decoded = decodeJwt(token);
  const role = decoded?.role || fallback.role || null;

  return {
    id: fallback.userId || null,
    fullName: fallback.fullName || "",
    email: fallback.email || decoded?.sub || "",
    role
  };
}

export function AuthProvider({ children }) {
  const existingToken = localStorage.getItem("authToken");
  const [token, setToken] = useState(existingToken);
  const [user, setUser] = useState(existingToken ? buildUserFromToken(existingToken) : null);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    localStorage.setItem("authToken", data.token);
    setToken(data.token);
    setUser(buildUserFromToken(data.token, data));
    return data;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    localStorage.setItem("authToken", data.token);
    setToken(data.token);
    setUser(buildUserFromToken(data.token, data));
    return data;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
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
