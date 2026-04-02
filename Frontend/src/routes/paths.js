export const PATHS = {
  HOME: "/",
  APP: "/app",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  ADMIN: "/admin",
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
