import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import TeacherDashboard from "../pages/TeacherDashboard";
import ParentDashboard from "../pages/ParentDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import MessagesPage from "../pages/MessagesPage";
import AIInsightsPage from "../pages/AIInsightsPage";
import { useAuth } from "../context/AuthContext";
import { getDefaultPathByRole, PATHS } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  const { user } = useAuth();
  const defaultPath = getDefaultPathByRole(user?.role);

  return (
    <Routes>
      <Route path={PATHS.HOME} element={<HomePage />} />
      <Route path={PATHS.APP} element={<Navigate to={defaultPath} replace />} />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.UNAUTHORIZED} element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path={PATHS.ADMIN} element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route path={PATHS.TEACHER} element={<TeacherDashboard />} />
        <Route path={`${PATHS.TEACHER}/students/:studentId`} element={<StudentDetailsPage />} />
        <Route path={PATHS.AI_INSIGHTS} element={<AIInsightsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
        <Route path={PATHS.PARENT} element={<ParentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "TEACHER", "PARENT"]} />}>
        <Route path={PATHS.MESSAGES} element={<MessagesPage />} />
      </Route>

      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
}

export default AppRouter;
