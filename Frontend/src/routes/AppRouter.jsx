import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import TeacherDashboard from "../pages/TeacherDashboard";
import ParentDashboard from "../pages/ParentDashboard";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import MessagesPage from "../pages/MessagesPage";
import AIInsightsPage from "../pages/AIInsightsPage";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  const { isAuthenticated, user } = useAuth();
  const defaultPath =
    user?.role === "ADMIN"
      ? "/unauthorized"
      : user?.role === "TEACHER"
        ? "/teacher"
        : user?.role === "PARENT"
          ? "/parent"
          : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? defaultPath : "/login"} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/students/:studentId" element={<StudentDetailsPage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
        <Route path="/parent" element={<ParentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["TEACHER", "PARENT"]} />}>
        <Route path="/messages" element={<MessagesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
