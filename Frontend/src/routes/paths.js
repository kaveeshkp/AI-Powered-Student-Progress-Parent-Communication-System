export const PATHS = {
  // Common
  HOME: "/",
  APP: "/app",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  MESSAGES: "/messages",
  AI_INSIGHTS: "/ai-insights",
  
  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_INSTITUTIONS: "/admin/institutions",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SECURITY: "/admin/security",
  ADMIN_SETTINGS: "/admin/settings",
  
  // Teacher
  TEACHER: "/teacher",
  TEACHER_STUDENTS: "/teacher/students",
  TEACHER_STUDENTS_DETAIL: (id) => `/teacher/students/${id}`,
  TEACHER_ASSIGNMENTS: "/teacher/assignments",
  TEACHER_GRADES: "/teacher/grades",
  TEACHER_ATTENDANCE: "/teacher/attendance",
  TEACHER_SCHEDULE: "/teacher/schedule",
  TEACHER_MESSAGES: "/teacher/messages",
  
  // Parent
  PARENT: "/parent",
  PARENT_STUDENT_DETAIL: (id) => `/parent/student/${id}`,
  
  // Student (Future use)
  STUDENT: "/student"
};

export function getDefaultPathByRole(role) {
  switch (role) {
    case "ADMIN":
      return PATHS.ADMIN;
    case "TEACHER":
      return PATHS.TEACHER;
    case "PARENT":
      return PATHS.PARENT;
    case "STUDENT":
      return PATHS.STUDENT;
    default:
      return PATHS.LOGIN;
  }
}
