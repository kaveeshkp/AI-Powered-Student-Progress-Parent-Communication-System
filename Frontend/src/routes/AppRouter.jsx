import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { getDefaultPathByRole, PATHS } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import RouteErrorBoundary from "../components/RouteErrorBoundary";

// Lazy load all page components for code splitting
const HomePage = lazy(() => import("../pages/common/HomePage"));
const LoginPage = lazy(() => import("../pages/common/LoginPage"));
const RegisterPage = lazy(() => import("../pages/common/RegisterPage"));
const UnauthorizedPage = lazy(() => import("../pages/common/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/common/NotFoundPage"));

// Admin pages
const AdminDashboardPro = lazy(() => import("../pages/admin/AdminDashboardPro"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
const AdminPlaceholderPage = lazy(() => import("../pages/admin/AdminPlaceholderPage"));

// Teacher pages
const TeacherDashboard = lazy(() => import("../pages/teacher/TeacherDashboard"));
const StudentListPage = lazy(() => import("../pages/teacher/StudentListPage"));
const StudentDetailsPage = lazy(() => import("../pages/teacher/StudentDetailsPage"));
const AssignmentsPage = lazy(() => import("../pages/teacher/AssignmentsPage"));
const GradesPage = lazy(() => import("../pages/teacher/GradesPage"));
const AttendancePage = lazy(() => import("../pages/teacher/AttendancePage"));
const SchedulePage = lazy(() => import("../pages/teacher/SchedulePage"));
const MessagesSectionPage = lazy(() => import("../pages/teacher/MessagesSectionPage"));
const AIInsightsPage = lazy(() => import("../pages/teacher/AIInsightsPage"));

// Parent pages
const ParentDashboard = lazy(() => import("../pages/parent/ParentDashboard"));

// Student pages
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentAssignmentsPage = lazy(() => import("../pages/student/StudentAssignmentsPage"));
const StudentGradesPage = lazy(() => import("../pages/student/StudentGradesPage"));
const StudentSchedulePage = lazy(() => import("../pages/student/StudentSchedulePage"));

// Shared pages
const MessagesPage = lazy(() => import("../pages/shared/MessagesPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6",
  }}>
    <div style={{
      textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        margin: "0 auto 1rem",
      }} />
      <p style={{ color: "#666", fontSize: "14px" }}>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

function AppRouter() {
  const { user } = useAuth();
  const defaultPath = getDefaultPathByRole(user?.role);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.APP} element={<Navigate to={defaultPath} replace />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route
          element={
            <RouteErrorBoundary>
              <ProtectedRoute allowedRoles={["ADMIN"]} />
            </RouteErrorBoundary>
          }
        >
          <Route path={PATHS.ADMIN} element={<AdminDashboardPro />} />
          <Route path={PATHS.ADMIN_USERS} element={<AdminUsersPage />} />
          <Route
            path={PATHS.ADMIN_INSTITUTIONS}
            element={<AdminPlaceholderPage title="Institutions" icon="🏫" sectionName="institutions" />}
          />
          <Route
            path={PATHS.ADMIN_REPORTS}
            element={<AdminPlaceholderPage title="Reports" icon="📊" sectionName="reports" />}
          />
          <Route
            path={PATHS.ADMIN_SECURITY}
            element={<AdminPlaceholderPage title="Security" icon="🔒" sectionName="security" />}
          />
          <Route
            path={PATHS.ADMIN_SETTINGS}
            element={<AdminPlaceholderPage title="Settings" icon="⚙️" sectionName="settings" />}
          />
        </Route>

        {/* Teacher Routes */}
        <Route
          element={
            <RouteErrorBoundary>
              <ProtectedRoute allowedRoles={["TEACHER"]} />
            </RouteErrorBoundary>
          }
        >
          <Route path={PATHS.TEACHER} element={<TeacherDashboard />} />
          <Route path={PATHS.TEACHER_STUDENTS} element={<StudentListPage />} />
          <Route path={`${PATHS.TEACHER}/students/:studentId`} element={<StudentDetailsPage />} />
          <Route path={PATHS.TEACHER_ASSIGNMENTS} element={<AssignmentsPage />} />
          <Route path={PATHS.TEACHER_GRADES} element={<GradesPage />} />
          <Route path={PATHS.TEACHER_ATTENDANCE} element={<AttendancePage />} />
          <Route path={PATHS.TEACHER_SCHEDULE} element={<SchedulePage />} />
          <Route path={PATHS.AI_INSIGHTS} element={<AIInsightsPage />} />
        </Route>

        {/* Parent Routes */}
        <Route
          element={
            <RouteErrorBoundary>
              <ProtectedRoute allowedRoles={["PARENT"]} />
            </RouteErrorBoundary>
          }
        >
          <Route path={PATHS.PARENT} element={<ParentDashboard />} />
          <Route path={`${PATHS.PARENT}/student/:id`} element={<StudentDetailsPage />} />
        </Route>

        {/* Student Routes */}
        <Route
          element={
            <RouteErrorBoundary>
              <ProtectedRoute allowedRoles={["STUDENT"]} />
            </RouteErrorBoundary>
          }
        >
          <Route path={PATHS.STUDENT} element={<StudentDashboard />} />
          <Route path={PATHS.STUDENT_ASSIGNMENTS} element={<StudentAssignmentsPage />} />
          <Route path={PATHS.STUDENT_GRADES} element={<StudentGradesPage />} />
          <Route path={PATHS.STUDENT_SCHEDULE} element={<StudentSchedulePage />} />
        </Route>

        {/* Shared Routes */}
        <Route
          element={
            <RouteErrorBoundary>
              <ProtectedRoute allowedRoles={["ADMIN", "TEACHER", "PARENT", "STUDENT"]} />
            </RouteErrorBoundary>
          }
        >
          <Route path={PATHS.MESSAGES} element={<MessagesPage />} />
        </Route>

        {/* Catch-all Routes */}
        <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={PATHS.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
