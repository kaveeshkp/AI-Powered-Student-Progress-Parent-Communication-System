import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../routes/paths";

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --border:      rgba(255,255,255,0.07);
  --border2:     rgba(34,211,238,0.18);
  --text:        #dde4f0;
  --muted:       #5a6480;
  --muted2:      #8892aa;
  --accent:      #f59e0b;
  --amber-dim:   rgba(245,158,11,0.1);
  --amber-glow:  rgba(245,158,11,0.22);
  --emerald:     #34d399;
  --cyan:        #22d3ee;
  --red:         #f87171;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

.admin-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
  display: flex;
  overflow: hidden;
}

.admin-sidebar {
  width: 248px;
  min-height: 100vh;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--surface) 0%, rgba(8,14,26,0.8) 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.2rem;
  gap: 1.5rem;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--muted2);
  transition: all 0.2s var(--ease);
  border: 1px solid transparent;
  text-decoration: none;
  background: transparent;
}

.admin-nav-item:hover, .admin-nav-item.active {
  background: var(--amber-dim);
  color: var(--accent);
  border-color: rgba(245,158,11,0.25);
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.admin-nav-icon { font-size: 1.1rem; }

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  height: 68px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(90deg, rgba(8,14,26,0.8), rgba(8,14,26,0.95));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

.admin-header-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #fff;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.placeholder-section {
  background: linear-gradient(135deg, var(--surface2), rgba(13,21,38,0.8));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 3rem;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.6;
}

.placeholder-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.placeholder-text {
  color: var(--muted2);
  font-size: 1rem;
  max-width: 400px;
}

.coming-soon-badge {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: var(--amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 1rem;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}
`;

function AdminPlaceholderPage({ title, icon, sectionName }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: "⊞", label: "Overview", path: PATHS.ADMIN },
    { icon: "👥", label: "Users", path: PATHS.ADMIN_USERS },
    { icon: "🏫", label: "Institutions", path: PATHS.ADMIN_INSTITUTIONS },
    { icon: "📊", label: "Reports", path: PATHS.ADMIN_REPORTS },
    { icon: "🔒", label: "Security", path: PATHS.ADMIN_SECURITY },
    { icon: "⚙️", label: "Settings", path: PATHS.ADMIN_SETTINGS },
  ];

  const getActiveNavIndex = () => {
    if (location.pathname === PATHS.ADMIN) return 0;
    if (location.pathname === PATHS.ADMIN_USERS) return 1;
    if (location.pathname === PATHS.ADMIN_INSTITUTIONS) return 2;
    if (location.pathname === PATHS.ADMIN_REPORTS) return 3;
    if (location.pathname === PATHS.ADMIN_SECURITY) return 4;
    if (location.pathname === PATHS.ADMIN_SETTINGS) return 5;
    return 0;
  };

  const activeNavIndex = getActiveNavIndex();

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-root">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--amber-glow))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", boxShadow: "0 0 16px var(--amber-glow)"
            }}>⚡</div>
            <span>EduAdmin</span>
          </div>

          <nav className="admin-nav">
            {navItems.map((item, idx) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <button className={`admin-nav-item ${idx === activeNavIndex ? "active" : ""}`}>
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="admin-main">
          <header className="admin-header">
            <h1 className="admin-header-title">{title}</h1>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, color: "#fff" }}>{user?.fullName || "Administrator"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{user?.role || "ADMIN"}</div>
              </div>
              <button onClick={logout} style={{
                padding: "0.8rem 1.2rem", background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 8, color: "var(--accent)", fontWeight: 700, cursor: "pointer"
              }}>
                Sign Out
              </button>
            </div>
          </header>

          <div className="admin-content">
            <div className="placeholder-section">
              <div className="placeholder-icon">{icon}</div>
              <h2 className="placeholder-title">{title}</h2>
              <p className="placeholder-text">
                This section is currently under development. We're working on creating a robust {sectionName} management interface for you.
              </p>
              <div className="coming-soon-badge">🚀 Coming Soon</div>
              <Link to={PATHS.ADMIN} style={{ marginTop: "1.5rem", textDecoration: "none" }}>
                <button style={{
                  padding: "0.8rem 1.6rem", background: "var(--accent)", color: "white",
                  borderRadius: 8, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }} onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}>
                  ← Back to Overview
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPlaceholderPage;
