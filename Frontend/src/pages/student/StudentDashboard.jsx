import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../routes/paths";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #040810;
  --surface: #080e1a;
  --surface2: #0d1526;
  --border: rgba(255,255,255,0.07);
  --text: #dde4f0;
  --muted: #5a6480;
  --muted2: #8892aa;
  --indigo: #6366f1;
  --indigo-dim: rgba(99,102,241,0.1);
  --indigo-glow: rgba(99,102,241,0.22);
  --emerald: #34d399;
  --amber: #fbbf24;
  --red: #f87171;
  --ease: cubic-bezier(0.16,1,0.3,1);
  --sidebar-w: 248px;
  --topbar-h: 64px;
}

.sd-root { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); display: flex; overflow: hidden; }

/* Sidebar */
.sd-sidebar { width: var(--sidebar-w); min-height: 100vh; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 1.5rem; overflow-y: auto; position: sticky; top: 0; z-index: 40; }
.sd-sidebar-logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; font-family: 'Fraunces', serif; }
.sd-sidebar-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--indigo), #818cf8); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 18px var(--indigo-glow); }
.sd-nav { display: flex; flex-direction: column; gap: 0.5rem; }
.sd-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; font-size: 0.85rem; color: var(--muted2); text-decoration: none; transition: background 0.2s, color 0.2s; }
.sd-nav-item:hover { background: rgba(99,102,241,0.1); color: var(--text); }
.sd-nav-item.active { background: var(--indigo-dim); color: var(--indigo); border-left: 3px solid var(--indigo); padding-left: calc(1rem - 3px); }
.sd-nav-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1rem; }

/* Main */
.sd-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Top Bar */
.sd-topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 1.75rem; gap: 1.5rem; position: sticky; top: 0; z-index: 30; }
.sd-topbar-title { font-size: 1.3rem; font-weight: 700; color: #fff; font-family: 'Fraunces', serif; }
.sd-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 1rem; }
.sd-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--indigo), #818cf8); border: 2px solid var(--indigo-dim); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.sd-logout-btn { padding: 0.5rem 1rem; border-radius: 8px; background: var(--surface2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background 0.2s; }
.sd-logout-btn:hover { background: rgba(99,102,241,0.15); }

/* Content */
.sd-content { flex: 1; overflow-y: auto; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1.75rem; }
.sd-content::-webkit-scrollbar { width: 4px; }
.sd-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* Hero */
.sd-hero { border-radius: 16px; background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.05) 100%); border: 1px solid var(--border); padding: 2rem; }
.sd-hero-title { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
.sd-hero-desc { font-size: 0.95rem; color: var(--muted2); line-height: 1.6; }

/* Stats Grid */
.sd-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.sd-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s, transform 0.2s; }
.sd-stat-card:hover { border-color: var(--indigo); transform: translateY(-2px); }
.sd-stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--muted); }
.sd-stat-value { font-size: 2rem; font-weight: 700; color: var(--indigo); margin-top: 0.5rem; }
.sd-stat-helper { font-size: 0.7rem; color: var(--muted); margin-top: 0.3rem; }

/* Cards Grid */
.sd-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.sd-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem; }
.sd-card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.sd-card-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--indigo-dim); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.sd-card-title { font-size: 1rem; font-weight: 700; color: #fff; }
.sd-card-desc { font-size: 0.8rem; color: var(--muted); margin-top: 0.2rem; }
.sd-card-body { display: flex; flex-direction: column; gap: 1rem; }
.sd-card-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; }
.sd-card-item:last-child { border-bottom: none; }
.sd-card-item-label { color: var(--muted2); }
.sd-card-item-value { font-weight: 700; color: var(--indigo); }

@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
.anim { opacity: 0; transform: translateY(20px); animation: fadeUp 0.55s var(--ease) forwards; }

@media (max-width: 768px) {
  .sd-root { flex-direction: column; }
  .sd-sidebar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; }
  .sd-content { padding: 1.5rem; gap: 1rem; }
  .sd-stats { grid-template-columns: repeat(2, 1fr); }
  .sd-cards { grid-template-columns: 1fr; }
}
`;

const NAV = [
  { label: "Overview", icon: "⊞", to: PATHS.STUDENT },
  { label: "Assignments", icon: "📋", to: PATHS.STUDENT_ASSIGNMENTS },
  { label: "Grades", icon: "📊", to: PATHS.STUDENT_GRADES },
  { label: "Schedule", icon: "🗓️", to: PATHS.STUDENT_SCHEDULE },
  { label: "Messages", icon: "💬", to: PATHS.MESSAGES },
];

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="sd-root">
        {/* Sidebar */}
        <aside className="sd-sidebar">
          <div className="sd-sidebar-logo">
            <div className="sd-sidebar-logo-icon">🎓</div>
            <span>StudentPortal</span>
          </div>

          <nav className="sd-nav">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `sd-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="sd-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="sd-main">
          {/* Top Bar */}
          <header className="sd-topbar">
            <h1 className="sd-topbar-title">My Dashboard</h1>
            <div className="sd-topbar-right">
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>
                  {user?.fullName || user?.email || "Student"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>STUDENT</p>
              </div>
              <div className="sd-avatar">{user?.fullName?.charAt(0) || "S"}</div>
              <button className="sd-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="sd-content">
            {/* Hero */}
            <div className="sd-hero anim">
              <h2 className="sd-hero-title">Welcome back! 👋</h2>
              <p className="sd-hero-desc">
                Track your assignments, view your grades, and stay on top of your schedule. Everything you need for academic success.
              </p>
            </div>

            {/* Statistics */}
            <div className="sd-stats">
              <div className="sd-stat-card anim" style={{ animationDelay: "0.1s" }}>
                <div className="sd-stat-label">📊 GPA</div>
                <div className="sd-stat-value">3.8</div>
                <div className="sd-stat-helper">Current semester</div>
              </div>
              <div className="sd-stat-card anim" style={{ animationDelay: "0.15s" }}>
                <div className="sd-stat-label">✅ Attendance</div>
                <div className="sd-stat-value">95%</div>
                <div className="sd-stat-helper">Classes attended</div>
              </div>
              <div className="sd-stat-card anim" style={{ animationDelay: "0.2s" }}>
                <div className="sd-stat-label">📋 Pending</div>
                <div className="sd-stat-value">3</div>
                <div className="sd-stat-helper">Assignments due</div>
              </div>
              <div className="sd-stat-card anim" style={{ animationDelay: "0.25s" }}>
                <div className="sd-stat-label">⭐ Achievements</div>
                <div className="sd-stat-value">12</div>
                <div className="sd-stat-helper">Badges earned</div>
              </div>
            </div>

            {/* Cards */}
            <div className="sd-cards">
              {/* Latest Assignments */}
              <div className="sd-card anim" style={{ animationDelay: "0.3s" }}>
                <div className="sd-card-header">
                  <div className="sd-card-icon">📋</div>
                  <div>
                    <div className="sd-card-title">Latest Assignments</div>
                    <div className="sd-card-desc">Your upcoming work</div>
                  </div>
                </div>
                <div className="sd-card-body">
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">Math Homework</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--amber)" }}>Due Tomorrow</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">English Essay</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--amber)" }}>Due in 3 days</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">Science Project</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--emerald)" }}>Submitted</span>
                  </div>
                </div>
                <Link to={PATHS.STUDENT_ASSIGNMENTS} style={{ marginTop: "1rem", color: "var(--indigo)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                  View all →
                </Link>
              </div>

              {/* Recent Grades */}
              <div className="sd-card anim" style={{ animationDelay: "0.35s" }}>
                <div className="sd-card-header">
                  <div className="sd-card-icon">📊</div>
                  <div>
                    <div className="sd-card-title">Recent Grades</div>
                    <div className="sd-card-desc">Latest results</div>
                  </div>
                </div>
                <div className="sd-card-body">
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">Mathematics</span>
                    <span className="sd-card-item-value">A</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">English</span>
                    <span className="sd-card-item-value">A-</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">Science</span>
                    <span className="sd-card-item-value">B+</span>
                  </div>
                </div>
                <Link to={PATHS.STUDENT_GRADES} style={{ marginTop: "1rem", color: "var(--indigo)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                  View all →
                </Link>
              </div>

              {/* Next Classes */}
              <div className="sd-card anim" style={{ animationDelay: "0.4s" }}>
                <div className="sd-card-header">
                  <div className="sd-card-icon">🗓️</div>
                  <div>
                    <div className="sd-card-title">Today's Classes</div>
                    <div className="sd-card-desc">Schedule</div>
                  </div>
                </div>
                <div className="sd-card-body">
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">09:00 - Mathematics</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--indigo)" }}>Room 101</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">11:00 - English</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--indigo)" }}>Room 205</span>
                  </div>
                  <div className="sd-card-item">
                    <span className="sd-card-item-label">13:00 - Science</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--indigo)" }}>Lab 301</span>
                  </div>
                </div>
                <Link to={PATHS.STUDENT_SCHEDULE} style={{ marginTop: "1rem", color: "var(--indigo)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                  View full schedule →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
