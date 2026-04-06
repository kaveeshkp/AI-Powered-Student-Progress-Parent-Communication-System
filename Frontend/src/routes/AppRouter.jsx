import { Navigate, Route, Routes } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  UnauthorizedPage,
} from "../pages/common";
import {
  TeacherDashboard,
  StudentListPage,
  StudentDetailsPage,
  AssignmentsPage,
  GradesPage,
  AttendancePage,
  SchedulePage,
  MessagesSectionPage,
  AIInsightsPage,
} from "../pages/teacher";
import {
  AdminDashboard,
  AdminUsersPage,
  AdminPlaceholderPage,
} from "../pages/admin";
import AdminDashboardPro from "../pages/admin/AdminDashboardPro";
import { ParentDashboard } from "../pages/parent";
import { MessagesPage } from "../pages/shared";
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
        <Route path={PATHS.ADMIN} element={<AdminDashboardPro />} />
        <Route path={PATHS.ADMIN_USERS} element={<AdminUsersPage />} />
        <Route path={PATHS.ADMIN_INSTITUTIONS} element={<AdminPlaceholderPage title="Institutions" icon="🏫" sectionName="institutions" />} />
        <Route path={PATHS.ADMIN_REPORTS} element={<AdminPlaceholderPage title="Reports" icon="📊" sectionName="reports" />} />
        <Route path={PATHS.ADMIN_SECURITY} element={<AdminPlaceholderPage title="Security" icon="🔒" sectionName="security" />} />
        <Route path={PATHS.ADMIN_SETTINGS} element={<AdminPlaceholderPage title="Settings" icon="⚙️" sectionName="settings" />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route path={PATHS.TEACHER} element={<TeacherDashboard />} />
        <Route path={`${PATHS.TEACHER}/students`} element={<StudentListPage />} />
        <Route path={`${PATHS.TEACHER}/students/:studentId`} element={<StudentDetailsPage />} />
        <Route path={`${PATHS.TEACHER}/assignments`} element={<AssignmentsPage />} />
        <Route path={`${PATHS.TEACHER}/grades`} element={<GradesPage />} />
        <Route path={`${PATHS.TEACHER}/attendance`} element={<AttendancePage />} />
        <Route path={`${PATHS.TEACHER}/schedule`} element={<SchedulePage />} />
        <Route path={`${PATHS.TEACHER}/messages`} element={<MessagesSectionPage />} />
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
