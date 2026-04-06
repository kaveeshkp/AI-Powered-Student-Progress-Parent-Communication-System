import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export default function AdminTestPage() {
  const { user, logout } = useAuth();

  console.log("🎯 AdminTestPage rendering - User:", user);

  return (
    <div style={{ background: "#1a1a2e", color: "#eee", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>✅ Admin Dashboard Working!</h1>
      
      <div style={{ background: "#16213e", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2>Authenticated User:</h2>
        <p><strong>Name:</strong> {user?.fullName || "No name"}</p>
        <p><strong>Email:</strong> {user?.email || "No email"}</p>
        <p><strong>Role:</strong> {user?.role || "No role"}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        <Link to={PATHS.ADMIN} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>📊 Overview</button>
        </Link>
        <Link to={PATHS.ADMIN_USERS} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>👥 Users</button>
        </Link>
        <Link to={PATHS.ADMIN_INSTITUTIONS} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>🏫 Institutions</button>
        </Link>
        <Link to={PATHS.ADMIN_REPORTS} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>📈 Reports</button>
        </Link>
        <Link to={PATHS.ADMIN_SECURITY} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>🔒 Security</button>
        </Link>
        <Link to={PATHS.ADMIN_SETTINGS} style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>⚙️ Settings</button>
        </Link>
      </div>

      <button 
        onClick={logout}
        style={{ padding: "10px 20px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}
      >
        Logout
      </button>
    </div>
  );
}
