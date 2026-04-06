export const PATHS = {
  HOME: "/",
  APP: "/app",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_INSTITUTIONS: "/admin/institutions",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SECURITY: "/admin/security",
  ADMIN_SETTINGS: "/admin/settings",
  TEACHER: "/teacher",
  PARENT: "/parent",
  MESSAGES: "/messages",
  AI_INSIGHTS: "/ai-insights"
};

export function getDefaultPathByRole(role) {
  switch (role) {
    case "ADMIN":
      return PATHS.ADMIN;
    case "TEACHER":
      return PATHS.TEACHER;
    case "PARENT":
      return PATHS.PARENT;
    default:
      return PATHS.LOGIN;
  }
}
