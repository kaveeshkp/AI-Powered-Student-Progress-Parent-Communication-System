import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../routes/paths";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --surface3:    #111d34;
  --border:      rgba(255,255,255,0.07);
  --border2:     rgba(34,211,238,0.18);
  --text:        #dde4f0;
  --muted:       #5a6480;
  --muted2:      #8892aa;
  --accent:      #f59e0b;
  --amber-dim:   rgba(245,158,11,0.1);
  --amber-glow:  rgba(245,158,11,0.22);
  --emerald:     #34d399;
  --red:         #f87171;
  --blue:        #3b82f6;
  --purple:      #a78bfa;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

.admin-pro-container {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
  display: flex;
  overflow: hidden;
}

/* SIDEBAR */
.admin-pro-sidebar {
  width: 260px;
  min-height: 100vh;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--surface) 0%, rgba(8,14,26,0.8) 100%);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.2rem;
  gap: 2rem;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.admin-pro-sidebar::-webkit-scrollbar { width: 4px; }
.admin-pro-sidebar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.admin-pro-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Fraunces', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.admin-pro-brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--amber-glow));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 0 20px var(--amber-glow);
}

.admin-pro-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.admin-pro-nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--muted2);
  transition: all 0.2s var(--ease);
  border: 1px solid transparent;
  text-decoration: none;
}

.admin-pro-nav-item:hover {
  background: var(--amber-dim);
  color: var(--accent);
  border-color: rgba(245,158,11,0.25);
}

.admin-pro-nav-item.active {
  background: var(--amber-dim);
  color: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

.admin-pro-nav-icon { font-size: 1.2rem; }

.admin-pro-sidebar-help {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.admin-pro-sidebar-help p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.admin-pro-sidebar-help-text {
  color: var(--muted2);
  font-size: 0.8rem;
  line-height: 1.5;
}

/* MAIN CONTENT */
.admin-pro-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-pro-header {
  height: 72px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(90deg, rgba(8,14,26,0.8), rgba(8,14,26,0.95));
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  gap: 2rem;
}

.admin-pro-header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  font-family: 'Fraunces', serif;
}

.admin-pro-header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: auto;
}

.admin-pro-user-info {
  text-align: right;
  font-size: 0.85rem;
}

.admin-pro-user-name {
  font-weight: 600;
  color: #fff;
}

.admin-pro-user-role {
  color: var(--muted);
  font-size: 0.75rem;
}

.admin-pro-logout {
  padding: 0.65rem 1.3rem;
  background: var(--amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s var(--ease);
}

.admin-pro-logout:hover {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 16px var(--amber-glow);
}

.admin-pro-content {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-pro-content::-webkit-scrollbar { width: 6px; }
.admin-pro-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* HERO SECTION */
.admin-pro-hero {
  background: linear-gradient(135deg, var(--amber-dim), rgba(99,102,241,0.08));
  border: 1px solid var(--border2);
  border-radius: 16px;
  padding: 2.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2.5rem;
  align-items: center;
  animation: fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) backwards;
}

.admin-pro-hero h2 {
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: #fff;
}

.admin-pro-hero p {
  color: var(--muted2);
  margin: 0 0 1.2rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.admin-pro-hero-emoji {
  font-size: 5rem;
  opacity: 0.9;
}

/* METRICS GRID */
.admin-pro-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  animation: fadeUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) backwards;
}

.admin-pro-metric-card {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.8rem;
  transition: all 0.3s var(--ease);
  position: relative;
  overflow: hidden;
}

.admin-pro-metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.3s var(--ease);
}

.admin-pro-metric-card:hover {
  border-color: var(--accent);
  background: var(--surface3);
  box-shadow: 0 8px 32px rgba(245,158,11,0.12);
  transform: translateY(-4px);
}

.admin-pro-metric-card:hover::before {
  opacity: 1;
}

.admin-pro-metric-icon {
  font-size: 2rem;
  margin-bottom: 0.8rem;
  display: inline-block;
}

.admin-pro-metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
}

.admin-pro-metric-label {
  color: var(--muted2);
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
}

.admin-pro-metric-trend {
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  width: fit-content;
  font-weight: 600;
}

.trend-up { background: rgba(52,211,153,0.15); color: var(--emerald); }
.trend-down { background: rgba(248,113,113,0.15); color: var(--red); }

/* SECTIONS GRID */
.admin-pro-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.8rem;
  animation: fadeUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) backwards;
}

.admin-pro-section-card {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 2rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: all 0.3s var(--ease);
}

.admin-pro-section-card:hover {
  border-color: var(--border2);
  box-shadow: 0 12px 48px rgba(34,211,238,0.08);
  background: var(--surface3);
  transform: translateY(-4px);
}

.admin-pro-section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.admin-pro-section-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.admin-pro-section-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.3rem;
  font-family: 'Fraunces', serif;
}

.admin-pro-section-info p {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

.admin-pro-section-items {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.admin-pro-section-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.admin-pro-item-label {
  font-size: 0.85rem;
  color: var(--muted2);
}

.admin-pro-item-value {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
}

.admin-pro-item-badge {
  display: inline-block;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-active {
  background: rgba(52,211,153,0.2);
  color: var(--emerald);
}

.badge-pending {
  background: rgba(245,158,11,0.2);
  color: var(--accent);
}

.badge-warning {
  background: rgba(248,113,113,0.2);
  color: var(--red);
}

.admin-pro-section-action {
  margin-top: auto;
}

.admin-pro-section-action button {
  width: 100%;
  padding: 0.75rem;
  background: var(--amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.admin-pro-section-action button:hover {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 16px var(--amber-glow);
}

.admin-pro-section-action a {
  text-decoration: none;
}

.admin-pro-section-action a button {
  width: 100%;
}

.admin-pro-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.admin-pro-quick-btn {
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  color: var(--muted2);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s var(--ease);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.admin-pro-quick-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--amber-dim);
}

.admin-pro-quick-icon {
  font-size: 1.5rem;
}

/* ACTIVITY SECTION */
.admin-pro-activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-pro-activity-item {
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-pro-activity-time {
  font-size: 0.75rem;
  color: var(--muted);
  min-width: 50px;
}

.admin-pro-activity-text {
  font-size: 0.85rem;
  color: var(--text);
}

.admin-pro-activity-user {
  color: var(--accent);
}

/* ANIMATIONS */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .admin-pro-metrics { grid-template-columns: repeat(2, 1fr); }
  .admin-pro-sections { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .admin-pro-container { flex-direction: column; }
  .admin-pro-sidebar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; }
  .admin-pro-content { padding: 1.5rem; gap: 1.5rem; }
  .admin-pro-hero { grid-template-columns: 1fr; }
  .admin-pro-hero-emoji { text-align: center; }
  .admin-pro-metrics { grid-template-columns: 1fr; }
  .admin-pro-sections { grid-template-columns: 1fr; }
}
`;

const adminProStats = [
  {
    icon: "👥",
    value: "1,284",
    label: "Total Users",
    trend: "↑ 12% from last week",
    type: "up",
  },
  {
    icon: "🏫",
    value: "24",
    label: "Institutions",
    trend: "↑ 2 new this month",
    type: "up",
  },
  {
    icon: "📊",
    value: "3,847",
    label: "Active Students",
    trend: "↑ 8% enrollment growth",
    type: "up",
  },
  {
    icon: "✅",
    value: "99.94%",
    label: "System Uptime",
    trend: "↑ 0.1% improvement",
    type: "up",
  },
];

const AdminDashboardPro = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview", path: PATHS.ADMIN },
    { id: "users", icon: "👥", label: "Users", path: PATHS.ADMIN_USERS },
    { id: "institutions", icon: "🏫", label: "Institutions", path: PATHS.ADMIN_INSTITUTIONS },
    { id: "reports", icon: "📈", label: "Reports", path: PATHS.ADMIN_REPORTS },
    { id: "security", icon: "🔒", label: "Security", path: PATHS.ADMIN_SECURITY },
    { id: "settings", icon: "⚙️", label: "Settings", path: PATHS.ADMIN_SETTINGS },
  ];

  const recentActivities = [
    { time: "2 hrs ago", user: "Sarah Johnson", action: "added 5 new students to Class 10A" },
    { time: "4 hrs ago", user: "James Smith", action: "updated attendance records for Biology" },
    { time: "6 hrs ago", user: "Admin User", action: "approved 3 pending institution requests" },
    { time: "1 day ago", user: "Emma Wilson", action: "created new assignment for Mathematics" },
    { time: "2 days ago", user: "Mike Brown", action: "exported student performance report" },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("users")) setActiveNav("users");
    else if (path.includes("institutions")) setActiveNav("institutions");
    else if (path.includes("reports")) setActiveNav("reports");
    else if (path.includes("security")) setActiveNav("security");
    else if (path.includes("settings")) setActiveNav("settings");
    else setActiveNav("overview");
  }, [location]);

  return (
    <div className="admin-pro-container">
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside className="admin-pro-sidebar">
        <div className="admin-pro-brand">
          <div className="admin-pro-brand-icon">📚</div>
          <span>StudentApp</span>
        </div>

        <nav className="admin-pro-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <div className={`admin-pro-nav-item ${activeNav === item.id ? "active" : ""}`}>
                <span className="admin-pro-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="admin-pro-sidebar-help">
          <p>Help & Support</p>
          <p className="admin-pro-sidebar-help-text">
            Need assistance? Check our documentation or contact the support team.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-pro-main">
        {/* Header */}
        <header className="admin-pro-header">
          <h1 className="admin-pro-header-title">
            {navItems.find((item) => item.id === activeNav)?.label || "Dashboard"}
          </h1>
          <div className="admin-pro-header-right">
            <div className="admin-pro-user-info">
              <div className="admin-pro-user-name">{user?.fullName || "Administrator"}</div>
              <div className="admin-pro-user-role">{user?.role || "ADMIN"}</div>
            </div>
            <button className="admin-pro-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="admin-pro-content">
          {/* Hero Section */}
          <div className="admin-pro-hero">
            <div>
              <h2>Welcome back! 👋</h2>
              <p>Monitor your institution's operations, manage users, and track system health in real-time. Everything you need to run your educational platform smoothly.</p>
            </div>
            <div className="admin-pro-hero-emoji">📊</div>
          </div>

          {/* Key Metrics */}
          <div className="admin-pro-metrics">
            {adminProStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="admin-pro-metric-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="admin-pro-metric-icon">{stat.icon}</div>
                <div className="admin-pro-metric-value">{stat.value}</div>
                <div className="admin-pro-metric-label">{stat.label}</div>
                <div className={`admin-pro-metric-trend trend-${stat.type}`}>{stat.trend}</div>
              </div>
            ))}
          </div>

          {/* Main Sections Grid */}
          <div className="admin-pro-sections">
            {/* User Management */}
            <div className="admin-pro-section-card">
              <div className="admin-pro-section-header">
                <div className="admin-pro-section-icon">👥</div>
                <div className="admin-pro-section-info">
                  <h3>User Management</h3>
                  <p>Manage all system users</p>
                </div>
              </div>
              <div className="admin-pro-section-items">
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Teachers</span>
                  <span className="admin-pro-item-value">384</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Parents</span>
                  <span className="admin-pro-item-value">556</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Students</span>
                  <span className="admin-pro-item-value">3,847</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Pending Approval</span>
                  <span>
                    <span className="admin-pro-item-badge badge-pending">8 new</span>
                  </span>
                </div>
              </div>
              <div className="admin-pro-section-action">
                <Link to={PATHS.ADMIN_USERS} style={{ textDecoration: "none" }}>
                  <button>Manage Users →</button>
                </Link>
              </div>
            </div>

            {/* Institutions */}
            <div className="admin-pro-section-card">
              <div className="admin-pro-section-header">
                <div className="admin-pro-section-icon">🏫</div>
                <div className="admin-pro-section-info">
                  <h3>Institutions</h3>
                  <p>Schools & colleges</p>
                </div>
              </div>
              <div className="admin-pro-section-items">
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Active Schools</span>
                  <span className="admin-pro-item-value">24</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Total Students</span>
                  <span className="admin-pro-item-value">3,847</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Billing Status</span>
                  <span>
                    <span className="admin-pro-item-badge badge-active">All Paid</span>
                  </span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Active Contracts</span>
                  <span className="admin-pro-item-value">24/24</span>
                </div>
              </div>
              <div className="admin-pro-section-action">
                <button>View All Institutions →</button>
              </div>
            </div>

            {/* Security & System Health */}
            <div className="admin-pro-section-card">
              <div className="admin-pro-section-header">
                <div className="admin-pro-section-icon">🔒</div>
                <div className="admin-pro-section-info">
                  <h3>Security Status</h3>
                  <p>System health & safety</p>
                </div>
              </div>
              <div className="admin-pro-section-items">
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">System Uptime</span>
                  <span className="admin-pro-item-value">99.94%</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">SSL Certificate</span>
                  <span>
                    <span className="admin-pro-item-badge badge-active">Valid</span>
                  </span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">Failed Logins</span>
                  <span className="admin-pro-item-value">3</span>
                </div>
                <div className="admin-pro-section-item">
                  <span className="admin-pro-item-label">System Alerts</span>
                  <span>
                    <span className="admin-pro-item-badge badge-pending">1 warning</span>
                  </span>
                </div>
              </div>
              <div className="admin-pro-section-action">
                <button>View Logs & Details →</button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-pro-section-card">
              <div className="admin-pro-section-header">
                <div className="admin-pro-section-icon">⚡</div>
                <div className="admin-pro-section-info">
                  <h3>Quick Actions</h3>
                  <p>Common tasks</p>
                </div>
              </div>
              <div className="admin-pro-quick-grid">
                <button className="admin-pro-quick-btn">
                  <div className="admin-pro-quick-icon">➕</div>
                  <div>Add User</div>
                </button>
                <button className="admin-pro-quick-btn">
                  <div className="admin-pro-quick-icon">🏢</div>
                  <div>New School</div>
                </button>
                <button className="admin-pro-quick-btn">
                  <div className="admin-pro-quick-icon">📊</div>
                  <div>Generate Report</div>
                </button>
                <button className="admin-pro-quick-btn">
                  <div className="admin-pro-quick-icon">🔑</div>
                  <div>API Keys</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-pro-section-card" style={{ gridColumn: "span 2" }}>
              <div className="admin-pro-section-header">
                <div className="admin-pro-section-icon">📋</div>
                <div className="admin-pro-section-info">
                  <h3>Recent Activity</h3>
                  <p>Latest system events</p>
                </div>
              </div>
              <div className="admin-pro-activity-list">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="admin-pro-activity-item">
                    <div className="admin-pro-activity-time">{activity.time}</div>
                    <div className="admin-pro-activity-text">
                      <span className="admin-pro-activity-user">{activity.user}</span>
                      {" "}
                      {activity.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPro;
