import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoleHomePage from "../pages/RoleHomePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<RoleHomePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route path="/teacher" element={<RoleHomePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
        <Route path="/parent" element={<RoleHomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;
