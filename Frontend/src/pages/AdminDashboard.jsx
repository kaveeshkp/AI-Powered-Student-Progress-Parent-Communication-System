import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

/* ───────────────────────────────────────────────
   ADMIN DATA
   Replace with API data later
─────────────────────────────────────────────── */
const ADMIN_CONFIG = {
  label: "Admin",
  accent: "#f59e0b",
  accentDim: "rgba(245,158,11,0.12)",
  accentGlow: "rgba(245,158,11,0.25)",
  brand: "EduPortal",
  navItems: [
    { key: "overview", label: "Overview", icon: "⊞" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "institutions", label: "Institutions", icon: "🏫" },
    { key: "reports", label: "Reports", icon: "📊" },
    { key: "tickets", label: "Tickets", icon: "🎫" },
    { key: "security", label: "Security", icon: "🔒" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ],
  stats: [
    { label: "Total Users", value: "1,284", delta: "+38 this week", trend: "up", icon: "👥" },
    { label: "Active Sessions", value: "92", delta: "+11 live", trend: "up", icon: "🟢" },
    { label: "Open Tickets", value: "14", delta: "-3 today", trend: "down", icon: "🎫" },
    { label: "System Health", value: "99.94%", delta: "Stable", trend: "neutral", icon: "🛡️" },
  ],
  chartData: [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 75 },
    { label: "Wed", value: 71 },
    { label: "Thu", value: 88 },
    { label: "Fri", value: 79 },
    { label: "Sat", value: 54 },
    { label: "Sun", value: 67 },
  ],
  activities: [
    { text: "New teacher account approved for Westbridge School", time: "5 min ago", type: "user" },
    { text: "Nightly system backup completed successfully", time: "18 min ago", type: "system" },
    { text: "3 failed login attempts blocked from one IP", time: "42 min ago", type: "security" },
    { text: "Institution billing report generated", time: "1 hour ago", type: "report" },
    { text: "Parent portal deployment finished", time: "2 hours ago", type: "deploy" },
    { text: "Support ticket #248 moved to in progress", time: "Today", type: "ticket" },
  ],
  usersTable: [
    { name: "Nadeesha Perera", role: "Teacher", school: "Royal Heights", status: "Active" },
    { name: "Amila Fernando", role: "Parent", school: "Westbridge", status: "Pending" },
    { name: "Sahan Wijesinghe", role: "Admin", school: "Central Office", status: "Active" },
    { name: "Mihiri Silva", role: "Teacher", school: "Hillview College", status: "Suspended" },
  ],
  quickActions: [
    { icon: "➕", label: "Add User", sub: "Invite and assign role" },
    { icon: "🏫", label: "New Institution", sub: "Create school profile" },
    { icon: "📊", label: "Export Report", sub: "Download insights" },
    { icon: "🔒", label: "View Audit Logs", sub: "Check security events" },
  ],
  notifications: [
    { title: "Security alert resolved", time: "10 min ago", icon: "🔒" },
    { title: "15 new users registered", time: "35 min ago", icon: "👥" },
    { title: "Weekly analytics ready", time: "1 hour ago", icon: "📊" },
  ],
};

/* ───────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────── */
const ACTIVITY_STYLES = {
  user: { bg: "rgba(59,130,246,0.12)", dot: "#60a5fa", color: "#60a5fa" },
  system: { bg: "rgba(52,211,153,0.12)", dot: "#34d399", color: "#34d399" },
  security: { bg: "rgba(248,113,113,0.12)", dot: "#f87171", color: "#f87171" },
  report: { bg: "rgba(167,139,250,0.12)", dot: "#a78bfa", color: "#a78bfa" },
  deploy: { bg: "rgba(245,158,11,0.12)", dot: "#f59e0b", color: "#f59e0b" },
  ticket: { bg: "rgba(45,212,191,0.12)", dot: "#2dd4bf", color: "#2dd4bf" },
};

const STATUS_STYLES = {
  Active: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
  Pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  Suspended: { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
};

function useOutsideClick(refs, handler, active = true) {
  useEffect(() => {
    if (!active) return;

    const listener = (event) => {
      const clickedInside = refs.some((ref) => ref.current && ref.current.contains(event.target));
      if (!clickedInside) handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler, active]);
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const raw = String(value);
    const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""));
    const prefix = raw.match(/^[^0-9]*/)?.[0] || "";
    const suffix = raw.match(/[^0-9.]+$/)?.[0] || "";

    if (Number.isNaN(numeric)) {
      setDisplay(raw);
      return;
    }

    let frameId;
    let start;

    const duration = 1000;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numeric;

      const formatted = Number.isInteger(numeric)
        ? Math.round(current).toLocaleString()
        : current.toFixed(2).replace(/\.00$/, "");

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span>{display}</span>;
}

function Sparkline({ color, animated }) {
  const points = [32, 48, 38, 59, 51, 73, 67, 84, 78, 94];
  const h = 40;
  const w = 120;
  const step = w / (points.length - 1);
  const max = 100;

  const coords = points.map((p, i) => `${i * step},${h - (p / max) * h}`);
  const pathD = `M${coords.join("L")}`;
  const fillD = `M0,${h}L${coords.join("L")}L${(points.length - 1) * step},${h}Z`;
  const gradientId = `sg-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: 84, height: 30, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        style={
          animated
            ? {
                strokeDasharray: 300,
                strokeDashoffset: 300,
                animation: "drawLine 1.1s ease forwards",
              }
            : {}
        }
      />
    </svg>
  );
}

function StatCard({ stat, accent, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  const trendClass =
    stat.trend === "up" ? "up" : stat.trend === "down" ? "down" : "neutral";

  return (
    <section
      className={`stat-card ${visible ? "visible" : ""}`}
      style={{ animationDelay: `${delay}s` }}
      aria-label={stat.label}
    >
      <div className="stat-top">
        <span className="stat-emoji" aria-hidden="true">
          {stat.icon}
        </span>
        <span className={`stat-delta ${trendClass}`}>{stat.delta}</span>
      </div>

      <div className="stat-value">
        {visible ? <AnimatedNumber value={stat.value} /> : "0"}
      </div>

      <div className="stat-bottom">
        <span className="stat-label">{stat.label}</span>
        <Sparkline color={accent} animated={visible} />
      </div>
    </section>
  );
}

function AnimatedPanel({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <section
      className={`panel ${visible ? "visible" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

function BarChart({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="chart-area">
      {data.map((item, index) => (
        <div className="bar-row" key={item.label}>
          <div className="bar-meta">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${animated ? "animated" : ""}`}
              style={{
                width: `${item.value}%`,
                transitionDelay: `${index * 0.08}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ accent, value = 82, label = "Operational Score", sub = "Healthy across all services" }) {
  const [animated, setAnimated] = useState(false);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const pct = value / 100;
  const offset = circumference * (1 - pct);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ring-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90" className="ring-svg" aria-hidden="true">
        <circle className="ring-bg" cx="45" cy="45" r={radius} strokeWidth="8" />
        <circle
          className={`ring-fill ${animated ? "animated" : ""}`}
          cx="45"
          cy="45"
          r={radius}
          strokeWidth="8"
          stroke={accent}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
        />
      </svg>

      <div className="ring-info">
        <div className="ring-value">{value}%</div>
        <div className="ring-label">{label}</div>
        <div className="ring-sub">{sub}</div>
      </div>
    </div>
  );
}

function QuickActions({ items }) {
  return (
    <div className="quick-grid">
      {items.map((item) => (
        <button key={item.label} className="quick-btn" type="button">
          <span className="quick-btn-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="quick-btn-label">{item.label}</span>
          <span className="quick-btn-sub">{item.sub}</span>
        </button>
      ))}
    </div>
  );
}

function UsersTable({ users }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Institution</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.Pending;
            return (
              <tr key={`${user.name}-${user.role}`}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.school}</td>
                <td>
                  <span
                    className="status-pill"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const cfg = ADMIN_CONFIG;

  const [activeNav, setActiveNav] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const notifBtnRef = useRef(null);
  const profileBtnRef = useRef(null);

  useOutsideClick(
    [notifRef, notifBtnRef, profileRef, profileBtnRef],
    () => {
      setNotifOpen(false);
      setProfileOpen(false);
    },
    notifOpen || profileOpen
  );

  const initials = useMemo(() => {
    const source = user?.fullName || user?.email || "User";
    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const activePage = cfg.navItems[activeNav]?.label || "Overview";

  const handleNavClick = (index) => {
    setActiveNav(index);
    setMobileSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; }

        :root {
          --bg: #080b14;
          --surface: #0d1120;
          --surface2: #111829;
          --surface3: #151d31;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.10);
          --text: #e8eaf2;
          --muted: #6b7280;
          --muted2: #9ca3af;
          --accent: ${cfg.accent};
          --accent-dim: ${cfg.accentDim};
          --accent-glow: ${cfg.accentGlow};
          --green: #34d399;
          --red: #f87171;
          --yellow: #f59e0b;
          --sidebar-w: 250px;
          --sidebar-collapsed: 74px;
          --topbar-h: 68px;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dash-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(245,158,11,0.08), transparent 28%),
            radial-gradient(circle at bottom left, rgba(99,102,241,0.08), transparent 24%),
            var(--bg);
          color: var(--text);
          display: flex;
          font-family: 'Outfit', sans-serif;
        }

        .sidebar-overlay {
          display: none;
        }

        .sidebar {
          width: var(--sidebar-w);
          min-height: 100vh;
          background: rgba(13,17,32,0.94);
          backdrop-filter: blur(18px);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width 0.32s var(--ease), transform 0.32s var(--ease);
          position: relative;
          z-index: 50;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }

        .sidebar-logo {
          height: var(--topbar-h);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #7c3aed));
          color: white;
          font-size: 1rem;
          box-shadow: 0 0 22px var(--accent-glow);
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Instrument Serif', serif;
          font-size: 1.24rem;
          white-space: nowrap;
          transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .logo-text,
        .sidebar.collapsed .nav-label-text,
        .sidebar.collapsed .footer-button-label,
        .sidebar.collapsed .nav-section-label {
          opacity: 0;
          pointer-events: none;
        }

        .nav-section-label {
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1.35rem 1rem 0.5rem;
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }

        .sidebar-nav {
          padding: 0.3rem 0.55rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 0;
          background: transparent;
          color: var(--muted2);
          padding: 0.72rem 0.85rem;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          font-size: 0.88rem;
          font-weight: 500;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          position: relative;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text);
        }

        .nav-item.active {
          background: var(--accent-dim);
          color: var(--accent);
          box-shadow: inset 3px 0 0 var(--accent);
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .nav-icon {
          width: 18px;
          display: inline-flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-label-text {
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }

        .sidebar-footer {
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding: 0.8rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .footer-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          border: 0;
          background: transparent;
          color: var(--muted2);
          border-radius: 10px;
          padding: 0.7rem 0.85rem;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }

        .footer-button:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text);
        }

        .footer-button-label {
          font-size: 0.84rem;
          white-space: nowrap;
          transition: opacity 0.2s ease;
        }

        .main-area {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: var(--topbar-h);
          background: rgba(13,17,32,0.85);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.4rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .mobile-menu-btn,
        .icon-btn,
        .avatar-btn {
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--muted2);
          transition: background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s;
        }

        .mobile-menu-btn,
        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu-btn:hover,
        .icon-btn:hover {
          background: var(--accent-dim);
          color: var(--accent);
          border-color: var(--accent);
        }

        .mobile-menu-btn {
          display: none;
        }

        .topbar-greeting {
          flex: 1;
          min-width: 0;
        }

        .greeting-text {
          font-size: 0.76rem;
          color: var(--muted);
        }

        .greeting-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.15rem;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 0.5rem 0.8rem;
          min-width: 230px;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .search-bar:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .search-bar input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.84rem;
          font-family: inherit;
        }

        .search-bar input::placeholder {
          color: var(--muted);
        }

        .badge-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--red);
          top: 6px;
          right: 6px;
          box-shadow: 0 0 8px var(--red);
          border: 2px solid var(--surface2);
        }

        .avatar-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #7c3aed));
        }

        .avatar-btn:hover {
          box-shadow: 0 0 0 3px var(--accent-dim), 0 0 14px var(--accent-glow);
          border-color: transparent;
        }

        .dropdown-anchor {
          position: relative;
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 230px;
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: 14px;
          box-shadow: 0 22px 60px rgba(0,0,0,0.45);
          overflow: hidden;
          z-index: 100;
          animation: dropIn 0.22s var(--ease);
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dropdown-header {
          padding: 0.8rem 0.95rem 0.45rem;
          font-size: 0.74rem;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          width: 100%;
          padding: 0.72rem 0.95rem;
          border: 0;
          background: transparent;
          color: var(--muted2);
          text-align: left;
          cursor: pointer;
          font-size: 0.82rem;
          transition: background 0.16s, color 0.16s;
        }

        .dropdown-item:hover {
          background: var(--accent-dim);
          color: var(--accent);
        }

        .dropdown-item.danger:hover {
          background: rgba(248,113,113,0.12);
          color: var(--red);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 0.2rem 0;
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .content::-webkit-scrollbar {
          width: 6px;
        }

        .content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.10);
          border-radius: 999px;
        }

        .page-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          opacity: 0;
          transform: translateY(14px);
          animation: fadeUp 0.5s 0.05s var(--ease) forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          line-height: 1;
          margin: 0;
        }

        .page-subtitle {
          margin: 0.35rem 0 0;
          color: var(--muted);
          font-size: 0.82rem;
        }

        .page-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .ghost-btn,
        .primary-btn {
          border-radius: 11px;
          padding: 0.72rem 1rem;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.18s, background 0.18s, border-color 0.18s, box-shadow 0.18s;
        }

        .ghost-btn {
          background: var(--surface2);
          color: var(--text);
          border-color: var(--border);
        }

        .ghost-btn:hover {
          transform: translateY(-1px);
          border-color: var(--border2);
        }

        .primary-btn {
          background: var(--accent);
          color: #140d03;
          box-shadow: 0 10px 24px var(--accent-glow);
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          background: color-mix(in srgb, var(--accent) 88%, white);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: rgba(13,17,32,0.86);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.2rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          box-shadow: 0 0 28px var(--accent-dim);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.18s;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card.visible {
          animation: statIn 0.5s var(--ease) forwards;
        }

        @keyframes statIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-top,
        .stat-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .stat-emoji {
          font-size: 1.35rem;
        }

        .stat-delta {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 999px;
        }

        .stat-delta.up {
          background: rgba(52,211,153,0.12);
          color: var(--green);
        }

        .stat-delta.down {
          background: rgba(248,113,113,0.12);
          color: var(--red);
        }

        .stat-delta.neutral {
          background: rgba(255,255,255,0.06);
          color: var(--muted2);
        }

        .stat-value {
          font-family: 'Instrument Serif', serif;
          font-size: 2.15rem;
          line-height: 1;
          color: white;
        }

        .stat-label {
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
          gap: 1rem;
          align-items: start;
        }

        .left-stack,
        .right-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel {
          background: rgba(13,17,32,0.86);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
        }

        .panel.visible {
          animation: fadeUp 0.5s var(--ease) forwards;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--border);
        }

        .panel-title {
          font-size: 0.92rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .panel-title-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        .panel-action {
          border: 0;
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          font-size: 0.76rem;
          padding: 0.25rem 0.45rem;
          border-radius: 8px;
        }

        .panel-action:hover {
          background: var(--accent-dim);
        }

        .chart-area {
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .bar-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          color: var(--muted2);
        }

        .bar-track {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #7c3aed));
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.8s var(--ease);
        }

        .bar-fill.animated {
          transform: scaleX(1);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 0.95rem 1.2rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.16s;
        }

        .activity-item:last-child {
          border-bottom: 0;
        }

        .activity-item:hover {
          background: rgba(255,255,255,0.02);
        }

        .activity-dot-wrap {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .activity-text {
          font-size: 0.84rem;
          line-height: 1.45;
        }

        .activity-time {
          color: var(--muted);
          font-size: 0.72rem;
          margin-top: 0.18rem;
        }

        .ring-wrap {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ring-svg {
          transform: rotate(-90deg);
          flex-shrink: 0;
        }

        .ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.06);
        }

        .ring-fill {
          fill: none;
          stroke-linecap: round;
          transition: stroke-dashoffset 1.1s var(--ease);
          filter: drop-shadow(0 0 6px var(--accent));
        }

        .ring-info {
          min-width: 0;
        }

        .ring-value {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          line-height: 1;
        }

        .ring-label {
          margin-top: 0.2rem;
          color: var(--muted);
          font-size: 0.8rem;
        }

        .ring-sub {
          margin-top: 0.3rem;
          font-size: 0.74rem;
          color: var(--green);
        }

        .quick-grid {
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .quick-btn {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 0.9rem 0.95rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          cursor: pointer;
          color: var(--text);
          text-align: left;
          transition: transform 0.18s, background 0.18s, border-color 0.18s;
        }

        .quick-btn:hover {
          transform: translateY(-2px);
          background: var(--accent-dim);
          border-color: var(--accent);
        }

        .quick-btn-icon {
          font-size: 1.2rem;
        }

        .quick-btn-label {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .quick-btn-sub {
          font-size: 0.72rem;
          color: var(--muted);
        }

        .table-wrap {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 560px;
        }

        .data-table th,
        .data-table td {
          padding: 0.95rem 1.2rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 0.82rem;
        }

        .data-table th {
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .data-table tbody tr:hover {
          background: rgba(255,255,255,0.02);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.28rem 0.6rem;
          font-size: 0.72rem;
          font-weight: 700;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        @media (max-width: 1080px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 860px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: var(--sidebar-w);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: var(--sidebar-w);
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(2px);
            z-index: 45;
          }

          .mobile-menu-btn {
            display: inline-flex;
          }

          .search-bar {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .topbar {
            padding: 0 1rem;
          }

          .content {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .page-actions {
            justify-content: stretch;
          }

          .page-actions > * {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }

          .ring-wrap {
            flex-direction: column;
            align-items: flex-start;
          }

          .greeting-name {
            font-size: 1rem;
          }

          .page-title {
            font-size: 1.7rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="dash-root">
        {mobileSidebarOpen && (
          <button
            className="sidebar-overlay"
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={[
            "sidebar",
            sidebarCollapsed ? "collapsed" : "",
            mobileSidebarOpen ? "mobile-open" : "",
          ].join(" ")}
        >
          <div className="sidebar-logo">
            <div className="logo-icon" aria-hidden="true">
              🛡️
            </div>
            <span className="logo-text">{cfg.brand}</span>
          </div>

          <div className="nav-section-label">Administration</div>

          <nav className="sidebar-nav" aria-label="Sidebar navigation">
            {cfg.navItems.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className={`nav-item ${activeNav === index ? "active" : ""}`}
                onClick={() => handleNavClick(index)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-label-text">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button
              type="button"
              className="footer-button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              <span aria-hidden="true">{sidebarCollapsed ? "➡️" : "⬅️"}</span>
              <span className="footer-button-label">
                {sidebarCollapsed ? "Expand" : "Collapse"}
              </span>
            </button>

            <button type="button" className="footer-button" onClick={logout}>
              <span aria-hidden="true">🚪</span>
              <span className="footer-button-label">Sign out</span>
            </button>
          </div>
        </aside>

        <div className="main-area">
          <header className="topbar">
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileSidebarOpen(true)}
            >
              ☰
            </button>

            <div className="topbar-greeting">
              <div className="greeting-text">{greeting} 👋</div>
              <div className="greeting-name">{user?.fullName || user?.email || "Administrator"}</div>
            </div>

            <div className="topbar-actions">
              <label className="search-bar" aria-label="Search">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--muted)" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input placeholder="Search users, logs, institutions..." />
              </label>

              <div className="dropdown-anchor">
                <button
                  ref={notifBtnRef}
                  type="button"
                  className="icon-btn"
                  aria-label="Notifications"
                  onClick={() => {
                    setNotifOpen((prev) => !prev);
                    setProfileOpen(false);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="badge-dot" />
                </button>

                {notifOpen && (
                  <div ref={notifRef} className="dropdown">
                    <div className="dropdown-header">Notifications</div>
                    {cfg.notifications.map((item) => (
                      <button key={item.title} type="button" className="dropdown-item">
                        <span aria-hidden="true">{item.icon}</span>
                        <div>
                          <div style={{ color: "var(--text)", lineHeight: 1.35 }}>{item.title}</div>
                          <div style={{ color: "var(--muted)", fontSize: "0.7rem", marginTop: 2 }}>
                            {item.time}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-anchor">
                <button
                  ref={profileBtnRef}
                  type="button"
                  className="avatar-btn"
                  aria-label="Profile menu"
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setNotifOpen(false);
                  }}
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div ref={profileRef} className="dropdown">
                    <div style={{ padding: "0.85rem 0.95rem 0.65rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.82rem" }}>
                        {user?.fullName || "Administrator"}
                      </div>
                      <div style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 2 }}>
                        {user?.role || "ADMIN"}
                      </div>
                    </div>

                    <div className="dropdown-divider" />
                    <button type="button" className="dropdown-item">👤 Profile</button>
                    <button type="button" className="dropdown-item">⚙️ Settings</button>
                    <button type="button" className="dropdown-item">📄 Billing</button>
                    <div className="dropdown-divider" />
                    <button type="button" className="dropdown-item danger" onClick={logout}>
                      🚪 Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="content">
            <div className="page-header">
              <div>
                <h1 className="page-title">{activePage}</h1>
                <p className="page-subtitle">
                  {cfg.label} dashboard · full visibility across users, institutions, and system operations
                </p>
              </div>

              <div className="page-actions">
                <button type="button" className="ghost-btn">
                  Export Report
                </button>
                <button type="button" className="primary-btn">
                  Add User
                </button>
              </div>
            </div>

            <div className="stats-grid">
              {cfg.stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  accent={cfg.accent}
                  delay={0.08 + index * 0.07}
                />
              ))}
            </div>

            <div className="dashboard-grid">
              <div className="left-stack">
                <AnimatedPanel delay={0.28}>
                  <div className="panel-header">
                    <div className="panel-title">
                      <span className="panel-title-dot" />
                      Weekly Platform Usage
                    </div>
                    <button type="button" className="panel-action">
                      View all
                    </button>
                  </div>
                  <BarChart data={cfg.chartData} />
                </AnimatedPanel>

                <AnimatedPanel delay={0.36}>
                  <div className="panel-header">
                    <div className="panel-title">Recent Activity</div>
                    <button type="button" className="panel-action">
                      See more
                    </button>
                  </div>

                  <div className="activity-list">
                    {cfg.activities.map((activity) => {
                      const style = ACTIVITY_STYLES[activity.type] || ACTIVITY_STYLES.system;

                      return (
                        <div className="activity-item" key={`${activity.text}-${activity.time}`}>
                          <div className="activity-dot-wrap" style={{ background: style.bg }}>
                            <span
                              className="activity-dot"
                              style={{
                                background: style.dot,
                                boxShadow: `0 0 8px ${style.dot}`,
                              }}
                            />
                          </div>

                          <div>
                            <div className="activity-text">{activity.text}</div>
                            <div className="activity-time">{activity.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AnimatedPanel>

                <AnimatedPanel delay={0.44}>
                  <div className="panel-header">
                    <div className="panel-title">Latest User Overview</div>
                    <button type="button" className="panel-action">
                      Manage users
                    </button>
                  </div>
                  <UsersTable users={cfg.usersTable} />
                </AnimatedPanel>
              </div>

              <div className="right-stack">
                <AnimatedPanel delay={0.32}>
                  <div className="panel-header">
                    <div className="panel-title">Operational Score</div>
                  </div>
                  <ProgressRing
                    accent={cfg.accent}
                    value={82}
                    label="Platform stability"
                    sub="All core systems performing normally"
                  />
                </AnimatedPanel>

                <AnimatedPanel delay={0.4}>
                  <div className="panel-header">
                    <div className="panel-title">Quick Actions</div>
                  </div>
                  <QuickActions items={cfg.quickActions} />
                </AnimatedPanel>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}