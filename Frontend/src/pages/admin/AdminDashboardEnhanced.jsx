import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

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

.admin-sidebar::-webkit-scrollbar { width: 4px; }
.admin-sidebar::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Fraunces', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.admin-brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--amber-glow));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 0 16px var(--amber-glow);
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
}

.admin-nav-item:hover, .admin-nav-item.active {
  background: var(--amber-dim);
  color: var(--accent);
  border-color: rgba(245,158,11,0.25);
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
  backdrop-filter: blur(10px);
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

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-left: auto;
}

.admin-user-info {
  text-align: right;
  font-size: 0.85rem;
}

.admin-user-name {
  font-weight: 600;
  color: #fff;
}

.admin-user-role {
  color: var(--muted);
  font-size: 0.75rem;
}

.admin-logout-btn {
  padding: 0.6rem 1.2rem;
  background: var(--amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.admin-logout-btn:hover {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 16px var(--amber-glow);
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.admin-content::-webkit-scrollbar { width: 6px; }
.admin-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

.admin-hero {
  background: linear-gradient(135deg, var(--amber-dim), rgba(99,102,241,0.08));
  border: 1px solid var(--border2);
  border-radius: 16px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  animation: fadeUp 0.5s 0.1s var(--ease) backwards;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.admin-hero-content h2 {
  font-family: 'Fraunces', serif;
  font-size: 1.8rem;
  margin: 0 0 0.5rem;
  color: #fff;
}

.admin-hero-content p {
  color: var(--muted2);
  margin: 0;
  font-size: 0.95rem;
}

.admin-hero-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.admin-hero-actions button {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: #f59e0b;
  box-shadow: 0 0 16px var(--amber-glow);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--muted2);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--amber-dim);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
  animation: fadeUp 0.5s 0.15s var(--ease) backwards;
}

.stat-card {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s var(--ease);
}

.stat-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 24px rgba(245,158,11,0.15);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
}

.stat-label {
  color: var(--muted2);
  font-size: 0.85rem;
}

.stat-trend {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  width: fit-content;
}

.trend-up { background: rgba(52,211,153,0.15); color: var(--emerald); }
.trend-down { background: rgba(248,113,113,0.15); color: var(--red); }

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  animation: fadeUp 0.5s 0.2s var(--ease) backwards;
}

.section-card {
  background: linear-gradient(135deg, var(--surface2), rgba(13,21,38,0.8));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.8rem;
  transition: all 0.3s var(--ease);
}

.section-card:hover {
  border-color: var(--accent);
  box-shadow: 0 12px 40px rgba(245,158,11,0.12);
  transform: translateY(-6px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.section-icon {
  font-size: 1.8rem;
  background: var(--amber-dim);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.section-subtitle {
  color: var(--muted);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.content-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.content-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 0.9rem;
  color: var(--muted2);
}

.item-value {
  font-weight: 600;
  color: #fff;
}

.item-badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
}

.badge-active { background: rgba(52,211,153,0.15); color: var(--emerald); }
.badge-pending { background: rgba(245,158,11,0.15); color: var(--accent); }
.badge-critical { background: rgba(248,113,113,0.15); color: var(--red); }

.section-action {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.section-action button {
  width: 100%;
  padding: 0.7rem;
  background: var(--amber-dim);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.section-action button:hover {
  background: var(--accent);
  color: #fff;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.activity-item {
  display: flex;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.activity-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
}

.activity-desc {
  color: var(--text);
  font-weight: 500;
}

.activity-time {
  color: var(--muted);
  font-size: 0.75rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.8rem;
}

.quick-action-btn {
  padding: 1rem;
  background: linear-gradient(135deg, var(--amber-dim), transparent);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: var(--muted2);
  transition: all 0.2s var(--ease);
}

.quick-action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--amber-dim);
  transform: translateY(-2px);
}

.quick-action-icon {
  font-size: 1.4rem;
}

.quick-action-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.bar-label {
  font-size: 0.8rem;
  color: var(--muted);
  min-width: 60px;
}

.bar-container {
  flex: 1;
  height: 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--amber-glow));
  border-radius: 4px;
  transition: width 0.8s var(--ease);
  box-shadow: 0 0 12px var(--amber-glow);
}

.bar-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  min-width: 35px;
}
`;

function AdminDashboardEnhanced() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState(0);

  const navItems = [
    { icon: "⊞", label: "Overview" },
    { icon: "👥", label: "Users" },
    { icon: "🏫", label: "Institutions" },
    { icon: "📊", label: "Reports" },
    { icon: "🔒", label: "Security" },
    { icon: "⚙️", label: "Settings" },
  ];

  const stats = [
    { icon: "👥", label: "Total Users", value: "1,284", trend: "+12% this month", type: "up" },
    { icon: "🏫", label: "Institutions", value: "24", trend: "All active", type: "neutral" },
    { icon: "🟢", label: "Online Now", value: "287", trend: "+45 in 1 hour", type: "up" },
    { icon: "🔒", label: "System Health", value: "99.94%", trend: "Stable", type: "neutral" },
  ];

  const activities = [
    { text: "3 new teacher accounts created", time: "5 min ago" },
    { text: "Parent portal update deployed", time: "18 min ago" },
    { text: "Security audit completed", time: "42 min ago" },
    { text: "Nightly backup successful", time: "1 hour ago" },
    { text: "Database optimization finished", time: "2 hours ago" },
  ];

  const chartData = [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 75 },
    { label: "Wed", value: 71 },
    { label: "Thu", value: 88 },
    { label: "Fri", value: 79 },
    { label: "Sat", value: 54 },
    { label: "Sun", value: 67 },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-root">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-icon">⚡</div>
            <span>EduAdmin</span>
          </div>

          <nav className="admin-nav">
            {navItems.map((item, idx) => (
              <button
                key={item.label}
                className={`admin-nav-item ${idx === activeNav ? "active" : ""}`}
                onClick={() => setActiveNav(idx)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Help
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted2)", lineHeight: "1.4", margin: 0 }}>
              Check documentation or contact support team.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <h1 className="admin-header-title">{navItems[activeNav]?.label || "Overview"}</h1>
            <div className="admin-header-right">
              <div className="admin-user-info">
                <div className="admin-user-name">{user?.fullName || "Administrator"}</div>
                <div className="admin-user-role">{user?.role || "ADMIN"}</div>
              </div>
              <button className="admin-logout-btn" onClick={logout}>
                Sign Out
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="admin-content">
            {/* Hero Section */}
            <div className="admin-hero">
              <div className="admin-hero-content">
                <h2>Welcome back! 👋</h2>
                <p>Monitor your institution's operations, manage users, and track system health in real-time.</p>
                <div className="admin-hero-actions">
                  <button className="btn-primary">View Reports</button>
                  <button className="btn-secondary">Run Security Check</button>
                </div>
              </div>
              <div style={{ fontSize: "4rem" }}>📊</div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={stat.label} className="stat-card" style={{ animationDelay: `${idx * 0.05}s`, animation: "fadeUp 0.5s vars(--ease) backwards" }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className={`stat-trend trend-${stat.type}`}>{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Sections Grid */}
            <div className="sections-grid">
              {/* Users Management */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">👥</div>
                  <div>
                    <div className="section-title">User Management</div>
                    <div className="section-subtitle">Active accounts</div>
                  </div>
                </div>
                <div className="section-content">
                  <div className="content-item">
                    <span className="item-label">Teachers</span>
                    <span className="item-value">384</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Parents</span>
                    <span className="item-value">556</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Admins</span>
                    <span className="item-value">12</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Pending</span>
                    <span><span className="item-badge badge-pending">8 new</span></span>
                  </div>
                </div>
                <div className="section-action">
                  <button>Manage Users</button>
                </div>
              </div>

              {/* Institutions */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🏫</div>
                  <div>
                    <div className="section-title">Institutions</div>
                    <div className="section-subtitle">Schools & Colleges</div>
                  </div>
                </div>
                <div className="section-content">
                  <div className="content-item">
                    <span className="item-label">Active Schools</span>
                    <span className="item-value">24</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Total Students</span>
                    <span className="item-value">3,847</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Billing Status</span>
                    <span><span className="item-badge badge-active">Paid</span></span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Contracts</span>
                    <span className="item-value">24/24</span>
                  </div>
                </div>
                <div className="section-action">
                  <button>View Institutions</button>
                </div>
              </div>

              {/* System Health */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">🔒</div>
                  <div>
                    <div className="section-title">Security Status</div>
                    <div className="section-subtitle">System security</div>
                  </div>
                </div>
                <div className="section-content">
                  <div className="content-item">
                    <span className="item-label">Uptime</span>
                    <span className="item-value">99.94%</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">SSL Status</span>
                    <span><span className="item-badge badge-active">Valid</span></span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Failed Logins</span>
                    <span className="item-value">3</span>
                  </div>
                  <div className="content-item">
                    <span className="item-label">Alerts</span>
                    <span><span className="item-badge badge-pending">1 warning</span></span>
                  </div>
                </div>
                <div className="section-action">
                  <button>View Logs</button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">⚡</div>
                  <div>
                    <div className="section-title">Quick Actions</div>
                    <div className="section-subtitle">Common tasks</div>
                  </div>
                </div>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">➕</div>
                    <div className="quick-action-label">Add User</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">📋</div>
                    <div className="quick-action-label">Create Role</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">📊</div>
                    <div className="quick-action-label">Report</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon">🔑</div>
                    <div className="quick-action-label">API Keys</div>
                  </button>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📊</div>
                  <div>
                    <div className="section-title">Weekly Activity</div>
                    <div className="section-subtitle">Platform usage</div>
                  </div>
                </div>
                <div className="chart-bars">
                  {chartData.map((item) => (
                    <div key={item.label} className="bar-item">
                      <div className="bar-label">{item.label}</div>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${item.value}%` }} />
                      </div>
                      <div className="bar-value">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📝</div>
                  <div>
                    <div className="section-title">Recent Activity</div>
                    <div className="section-subtitle">Latest events</div>
                  </div>
                </div>
                <div className="activity-list">
                  {activities.map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-dot" />
                      <div className="activity-text">
                        <div className="activity-desc">{activity.text}</div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardEnhanced;
