import { useAuth } from "../context/AuthContext";

/**
 * Conditionally renders children if the current user's role is allowed.
 * Use this to hide buttons/sections without changing routing.
 */
function RoleGate({ allowedRoles = [], fallback = null, children }) {
  const { role } = useAuth();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return fallback;
  }
  return children;
}

export default RoleGate;
