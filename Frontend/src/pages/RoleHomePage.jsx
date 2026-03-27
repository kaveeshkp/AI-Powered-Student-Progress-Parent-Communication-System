import { useAuth } from "../context/AuthContext";

function RoleHomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <header className="topbar">
        <h1>{user?.role} Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <p>Welcome, {user?.fullName || user?.email}.</p>
        <p>This is a protected, role-based page.</p>
      </main>
    </div>
  );
}

export default RoleHomePage;
