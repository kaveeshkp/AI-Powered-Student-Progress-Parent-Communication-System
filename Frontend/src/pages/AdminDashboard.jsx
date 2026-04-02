import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

/* ───────────────────────────────────────────────
   MOCK DATA  (swap with real API calls)
─────────────────────────────────────────────── */
const ROLE_CONFIG = {
  TEACHER: {
    label: "Teacher",
    accent: "#22d3ee",
    accentDim: "rgba(34,211,238,0.12)",
    accentGlow: "rgba(34,211,238,0.25)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    stats: [
      { label: "Active Classes", value: "12", delta: "+2", up: true, icon: "🎓" },
      { label: "Total Students", value: "348", delta: "+24", up: true, icon: "👨‍🎓" },
      { label: "Assignments Due", value: "7", delta: "-3", up: false, icon: "📋" },
      { label: "Avg. Grade", value: "84%", delta: "+1.2%", up: true, icon: "📊" },
    ],
    activities: [
      { text: "Maria submitted Assignment 3", time: "2 min ago", type: "submit" },
      { text: "Class 9B test graded", time: "18 min ago", type: "grade" },
      { text: "New student enrolled: Jake T.", time: "1h ago", type: "enroll" },
      { text: "Parent meeting scheduled — Thu 3 PM", time: "3h ago", type: "meeting" },
      { text: "Science quiz results published", time: "Yesterday", type: "publish" },
    ],
    navItems: ["Overview", "Classes", "Students", "Assignments", "Grades", "Schedule"],
  },
  PARENT: {
    label: "Parent",
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.12)",
    accentGlow: "rgba(167,139,250,0.25)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    stats: [
      { label: "Children", value: "2", delta: "", up: true, icon: "👧" },
      { label: "Upcoming Tests", value: "3", delta: "This week", up: true, icon: "📝" },
      { label: "Avg. Attendance", value: "96%", delta: "+2%", up: true, icon: "✅" },
      { label: "Pending Notes", value: "1", delta: "New", up: false, icon: "📨" },
    ],
    activities: [
      { text: "Emma scored 92/100 on Math Quiz", time: "1h ago", type: "grade" },
      { text: "Teacher note from Mr. Davis", time: "3h ago", type: "meeting" },
      { text: "Lucas attendance marked present", time: "Today", type: "enroll" },
      { text: "School fee receipt generated", time: "Yesterday", type: "publish" },
      { text: "Emma submitted Science project", time: "2 days ago", type: "submit" },
    ],
    navItems: ["Overview", "Children", "Grades", "Attendance", "Messages", "Payments"],
  },
};

const FALLBACK = {
  label: "Admin",
  accent: "#f59e0b",
  accentDim: "rgba(245,158,11,0.12)",
  accentGlow: "rgba(245,158,11,0.25)",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  ),
  stats: [
    { label: "Total Users", value: "1,204", delta: "+12", up: true, icon: "👥" },
    { label: "Active Sessions", value: "87", delta: "+5", up: true, icon: "🟢" },
    { label: "Open Tickets", value: "14", delta: "-2", up: false, icon: "🎫" },
    { label: "System Health", value: "99.8%", delta: "Stable", up: true, icon: "🛡️" },
  ],
  activities: [
    { text: "System backup completed", time: "5 min ago", type: "publish" },
    { text: "New teacher account created", time: "30 min ago", type: "enroll" },
    { text: "Security scan passed", time: "1h ago", type: "grade" },
    { text: "Parent portal updated", time: "3h ago", type: "submit" },
  ],
  navItems: ["Overview", "Users", "Reports", "Settings", "Logs", "Security"],
};

/* ── Mini sparkline ─────────────────────────────────────────────────────── */
function Sparkline({ color, animated }) {
  const points = [30, 55, 38, 72, 60, 85, 70, 95, 80, 100];
  const h = 40, w = 120;
  const step = w / (points.length - 1);
  const max = 100;
  const coords = points.map((p, i) => `${i * step},${h - (p / max) * h}`);
  const pathD = `M${coords.join("L")}`;
  const fillD = `M0,${h}L${coords.join("L")}L${(points.length - 1) * step},${h}Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: 80, height: 30, overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path
        d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        style={animated ? { strokeDasharray: 300, strokeDashoffset: 300, animation: "drawLine 1.2s ease forwards" } : {}}
      />
    </svg>
  );
}

/* ── Activity type pill ─────────────────────────────────────────────────── */
const TYPE_STYLES = {
  submit:  { bg: "rgba(34,211,238,0.12)",  color: "#22d3ee",  dot: "#22d3ee"  },
  grade:   { bg: "rgba(167,139,250,0.12)", color: "#a78bfa",  dot: "#a78bfa"  },
  enroll:  { bg: "rgba(52,211,153,0.12)",  color: "#34d399",  dot: "#34d399"  },
  meeting: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24",  dot: "#fbbf24"  },
  publish: { bg: "rgba(248,113,113,0.12)", color: "#f87171",  dot: "#f87171"  },
};

/* ── Counter animation ──────────────────────────────────────────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState("0");
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  const suffix = value.match(/[^0-9.]+$/)?.[0] || "";

  useEffect(() => {
    if (isNaN(numeric)) { setDisplay(value); return; }
    let start = 0;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = eased * numeric;
      setDisplay(
        prefix +
        (Number.isInteger(numeric)
          ? Math.round(current).toLocaleString()
          : current.toFixed(1)) +
        suffix
      );
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span>{display}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
function RoleHomePage() {
  const { user, logout } = useAuth();
  const cfg = ROLE_CONFIG[user?.role] || FALLBACK;

  const [activeNav, setActiveNav] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const initials = (user?.fullName || user?.email || "U")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #080b14;
          --surface:   #0d1120;
          --surface2:  #111829;
          --border:    rgba(255,255,255,0.06);
          --border2:   rgba(255,255,255,0.1);
          --text:      #e8eaf2;
          --muted:     #6b7280;
          --muted2:    #9ca3af;
          --accent:    ${cfg.accent};
          --accent-dim:${cfg.accentDim};
          --accent-glow:${cfg.accentGlow};
          --sidebar-w: 240px;
          --topbar-h:  64px;
          --ease:      cubic-bezier(0.16,1,0.3,1);
          --red:       #f87171;
          --green:     #34d399;
        }

        .dash-root {
          font-family: 'Outfit', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--text);
          display: flex;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: var(--sidebar-w);
          min-height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 0;
          flex-shrink: 0;
          transition: width 0.35s var(--ease), transform 0.35s var(--ease);
          position: relative; z-index: 40;
          overflow: hidden;
        }
        .sidebar.collapsed { width: 68px; }

        .sidebar-logo {
          height: var(--topbar-h);
          display: flex; align-items: center;
          gap: 0.75rem;
          padding: 0 1.1rem;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .logo-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #7c3aed));
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 0 20px var(--accent-glow);
        }
        .logo-icon svg { width: 18px; height: 18px; }
        .logo-text {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem; font-weight: 400;
          color: #fff; white-space: nowrap;
          opacity: 1; transition: opacity 0.2s;
        }
        .sidebar.collapsed .logo-text { opacity: 0; pointer-events: none; }

        .nav-section-label {
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted);
          padding: 1.5rem 1.1rem 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s;
        }
        .sidebar.collapsed .nav-section-label { opacity: 0; }

        .nav-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.65rem 1.1rem;
          margin: 0.1rem 0.6rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.875rem; font-weight: 500;
          color: var(--muted2);
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          white-space: nowrap; overflow: hidden;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .nav-item.active {
          background: var(--accent-dim);
          color: var(--accent);
          box-shadow: inset 3px 0 0 var(--accent);
        }
        .nav-item-icon {
          width: 18px; height: 18px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-item-label { transition: opacity 0.2s; }
        .sidebar.collapsed .nav-item-label { opacity: 0; }

        /* active indicator dot */
        .nav-item.active::after {
          content: '';
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }
        .sidebar.collapsed .nav-item.active::after { opacity: 0; }

        .sidebar-footer {
          margin-top: auto;
          padding: 1rem 0.6rem;
          border-top: 1px solid var(--border);
        }

        .collapse-btn {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 0.5rem;
          border-radius: 8px; border: none; background: transparent;
          color: var(--muted); cursor: pointer; font-size: 0.8rem;
          transition: background 0.2s, color 0.2s;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .collapse-btn svg { flex-shrink: 0; transition: transform 0.35s var(--ease); }
        .sidebar.collapsed .collapse-btn svg { transform: rotate(180deg); }

        /* ── Main area ── */
        .main-area {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        /* ── Topbar ── */
        .topbar {
          height: var(--topbar-h);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center;
          padding: 0 1.75rem;
          gap: 1rem;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 30;
        }

        .topbar-greeting {
          flex: 1; min-width: 0;
        }
        .greeting-text {
          font-size: 0.78rem; color: var(--muted); font-weight: 400;
        }
        .greeting-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.1rem; color: #fff; font-weight: 400;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .topbar-actions { display: flex; align-items: center; gap: 0.5rem; }

        /* search */
        .search-bar {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.45rem 0.75rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-bar:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .search-bar input {
          background: none; border: none; outline: none;
          color: var(--text); font-family: 'Outfit', sans-serif;
          font-size: 0.8rem; width: 160px;
        }
        .search-bar input::placeholder { color: var(--muted); }

        .icon-btn {
          width: 36px; height: 36px; border-radius: 9px; border: none;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--muted2); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          position: relative;
        }
        .icon-btn:hover { background: var(--accent-dim); color: var(--accent); border-color: var(--accent); }
        .icon-btn .badge-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--red);
          border: 1.5px solid var(--surface);
          box-shadow: 0 0 6px var(--red);
        }

        .avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 50%, #7c3aed));
          border: 2px solid var(--accent-dim);
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.05em;
          transition: box-shadow 0.2s;
        }
        .avatar-btn:hover { box-shadow: 0 0 0 3px var(--accent-dim), 0 0 16px var(--accent-glow); }

        /* dropdown */
        .dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: 14px;
          padding: 0.5rem;
          min-width: 180px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          z-index: 100;
          animation: dropIn 0.25s var(--ease);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.55rem 0.75rem;
          border-radius: 9px; cursor: pointer;
          font-size: 0.82rem; color: var(--muted2);
          transition: background 0.15s, color 0.15s;
        }
        .dropdown-item:hover { background: var(--accent-dim); color: var(--accent); }
        .dropdown-item.danger:hover { background: rgba(248,113,113,0.12); color: var(--red); }
        .dropdown-divider { height: 1px; background: var(--border); margin: 0.35rem 0; }

        /* ── Content ── */
        .content {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 2rem 1.75rem;
          display: flex; flex-direction: column; gap: 1.75rem;
        }
        .content::-webkit-scrollbar { width: 4px; }
        .content::-webkit-scrollbar-track { background: transparent; }
        .content::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

        /* page header */
        .page-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          opacity: 0; transform: translateY(16px);
          animation: fadeUp 0.55s 0.1s var(--ease) forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .page-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem; font-weight: 400;
          color: #fff; line-height: 1;
        }
        .page-subtitle { font-size: 0.82rem; color: var(--muted); margin-top: 0.3rem; }
        .date-badge {
          font-size: 0.78rem; color: var(--muted2);
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.25rem 1.4rem;
          display: flex; flex-direction: column; gap: 0.75rem;
          position: relative; overflow: hidden;
          cursor: default;
          opacity: 0; transform: translateY(20px);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .stat-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 30px var(--accent-dim), 0 8px 24px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        .stat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .stat-card:hover::before { opacity: 1; }

        .stat-card.visible { animation: statIn 0.5s var(--ease) forwards; }
        @keyframes statIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-top { display: flex; align-items: center; justify-content: space-between; }
        .stat-emoji { font-size: 1.4rem; filter: grayscale(0.2); }
        .stat-delta {
          font-size: 0.72rem; font-weight: 600;
          border-radius: 100px;
          padding: 0.2rem 0.55rem;
        }
        .stat-delta.up   { background: rgba(52,211,153,0.12); color: var(--green); }
        .stat-delta.down { background: rgba(248,113,113,0.12); color: var(--red); }
        .stat-delta.neutral { background: var(--surface2); color: var(--muted2); }

        .stat-value {
          font-family: 'Instrument Serif', serif;
          font-size: 2.2rem; color: #fff; line-height: 1;
        }
        .stat-label {
          font-size: 0.78rem; color: var(--muted);
          font-weight: 500;
        }

        /* ── Two-col grid ── */
        .two-col { display: grid; grid-template-columns: 1fr 360px; gap: 1.25rem; align-items: start; }
        @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

        /* ── Panel ── */
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          opacity: 0; transform: translateY(18px);
        }
        .panel.visible { animation: fadeUp 0.55s var(--ease) forwards; }

        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid var(--border);
        }
        .panel-title {
          font-weight: 600; font-size: 0.9rem; color: var(--text);
          display: flex; align-items: center; gap: 0.5rem;
        }
        .panel-title-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .panel-action {
          font-size: 0.75rem; color: var(--accent); cursor: pointer;
          border: none; background: none; padding: 0.25rem 0.5rem;
          border-radius: 6px; transition: background 0.2s;
        }
        .panel-action:hover { background: var(--accent-dim); }

        /* ── Chart placeholder (bar chart) ── */
        .chart-area {
          padding: 1.4rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        .bar-row {
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .bar-meta {
          display: flex; justify-content: space-between;
          font-size: 0.75rem; color: var(--muted2);
        }
        .bar-track {
          height: 8px; border-radius: 99px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
        }
        .bar-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #7c3aed));
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 1s var(--ease);
        }
        .bar-fill.animated { transform: scaleX(1); }

        /* ── Activity feed ── */
        .activity-list { padding: 0.5rem 0; }
        .activity-item {
          display: flex; align-items: flex-start; gap: 0.85rem;
          padding: 0.85rem 1.4rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-item:hover { background: rgba(255,255,255,0.02); }

        .activity-dot-wrap {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .activity-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }

        .activity-text {
          flex: 1; min-width: 0;
          font-size: 0.83rem; color: var(--text); line-height: 1.4;
        }
        .activity-time {
          font-size: 0.72rem; color: var(--muted);
          white-space: nowrap; margin-top: 2px;
        }

        /* ── Quick actions ── */
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding: 1.1rem; }
        .quick-btn {
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem;
          padding: 0.85rem 1rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px; cursor: pointer;
          text-align: left;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .quick-btn:hover {
          background: var(--accent-dim);
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .quick-btn-icon { font-size: 1.3rem; }
        .quick-btn-label { font-size: 0.78rem; font-weight: 600; color: var(--text); }
        .quick-btn-sub { font-size: 0.68rem; color: var(--muted); }

        /* ── Progress ring ── */
        .ring-wrap {
          padding: 1.4rem;
          display: flex; align-items: center; gap: 1.25rem;
        }
        .ring-svg { transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: rgba(255,255,255,0.05); }
        .ring-fill {
          fill: none;
          stroke: var(--accent);
          stroke-linecap: round;
          stroke-dasharray: 226;
          stroke-dashoffset: 226;
          transition: stroke-dashoffset 1.2s var(--ease);
          filter: drop-shadow(0 0 6px var(--accent));
        }
        .ring-fill.animated { stroke-dashoffset: 56; }
        .ring-info { flex: 1; }
        .ring-value {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem; color: #fff;
        }
        .ring-label { font-size: 0.78rem; color: var(--muted); }
        .ring-sub { font-size: 0.75rem; color: var(--green); margin-top: 0.25rem; }

        /* ── @keyframes drawLine ── */
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); }
          .search-bar { display: none; }
        }
      `}</style>

      <div className="dash-root">

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">{cfg.icon}</div>
            <span className="logo-text">EduPortal</span>
          </div>

          <span className="nav-section-label">Navigation</span>

          {cfg.navItems.map((item, i) => {
            const icons = ["⊞", "📚", "👥", "📋", "📊", "🗓️", "💬", "⚙️", "🔒"];
            return (
              <div
                key={item}
                className={`nav-item ${activeNav === i ? "active" : ""}`}
                onClick={() => setActiveNav(i)}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className="nav-item-icon">{icons[i] || "●"}</span>
                <span className="nav-item-label">{item}</span>
              </div>
            );
          })}

          <div className="sidebar-footer">
            <button className="collapse-btn" onClick={() => setSidebarOpen((p) => !p)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span className="nav-item-label" style={{ fontSize: "0.78rem" }}>Collapse</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main-area">

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-greeting">
              <div className="greeting-text">{greeting} 👋</div>
              <div className="greeting-name">{user?.fullName || user?.email || "User"}</div>
            </div>

            <div className="topbar-actions">
              <div className="search-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input placeholder="Search…" />
              </div>

              {/* Notifications */}
              <div style={{ position: "relative" }}>
                <button className="icon-btn" onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span className="badge-dot" />
                </button>
                {notifOpen && (
                  <div className="dropdown" style={{ minWidth: 240 }}>
                    <div style={{ padding: "0.5rem 0.75rem 0.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Notifications</div>
                    {cfg.activities.slice(0, 3).map((a, i) => (
                      <div key={i} className="dropdown-item">
                        <span style={{ fontSize: "1rem" }}>
                          { a.type === "submit" ? "📥" : a.type === "grade" ? "📊" : a.type === "enroll" ? "🎓" : a.type === "meeting" ? "📅" : "📢" }
                        </span>
                        <div>
                          <div style={{ color: "var(--text)", fontSize: "0.78rem", lineHeight: 1.3 }}>{a.text}</div>
                          <div style={{ color: "var(--muted)", fontSize: "0.68rem", marginTop: 2 }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}>
                  {initials}
                </button>
                {profileOpen && (
                  <div className="dropdown">
                    <div style={{ padding: "0.6rem 0.75rem 0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className="avatar-btn" style={{ width: 32, height: 32, fontSize: "0.65rem", pointerEvents: "none" }}>{initials}</div>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>{user?.fullName || "User"}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{user?.role}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item">⚙️ &nbsp;Settings</div>
                    <div className="dropdown-item">👤 &nbsp;Profile</div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item danger" onClick={logout}>🚪 &nbsp;Sign out</div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <div className="content" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}>

            {/* Page header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">{cfg.navItems[activeNav]}</h1>
                <p className="page-subtitle">{cfg.label} portal · Role-based access</p>
              </div>
              <div className="date-badge">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {cfg.stats.map((s, i) => (
                <StatCard key={i} stat={s} delay={0.15 + i * 0.08} accent={cfg.accent} />
              ))}
            </div>

            {/* Two-col */}
            <div className="two-col">
              {/* Activity + bars panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <AnimatedPanel delay={0.3}>
                  <div className="panel-header">
                    <span className="panel-title">
                      <span className="panel-title-dot" />
                      Weekly Performance
                    </span>
                    <button className="panel-action">View all</button>
                  </div>
                  <BarChart accent={cfg.accent} />
                </AnimatedPanel>

                <AnimatedPanel delay={0.4}>
                  <div className="panel-header">
                    <span className="panel-title">Recent Activity</span>
                    <button className="panel-action">See more</button>
                  </div>
                  <div className="activity-list">
                    {cfg.activities.map((a, i) => {
                      const s = TYPE_STYLES[a.type] || TYPE_STYLES.publish;
                      return (
                        <div className="activity-item" key={i}>
                          <div className="activity-dot-wrap" style={{ background: s.bg }}>
                            <div className="activity-dot" style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="activity-text">{a.text}</div>
                            <div className="activity-time">{a.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AnimatedPanel>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <AnimatedPanel delay={0.35}>
                  <div className="panel-header">
                    <span className="panel-title">Completion Rate</span>
                  </div>
                  <ProgressRing accent={cfg.accent} />
                </AnimatedPanel>

                <AnimatedPanel delay={0.45}>
                  <div className="panel-header">
                    <span className="panel-title">Quick Actions</span>
                  </div>
                  <QuickActions role={user?.role} />
                </AnimatedPanel>
              </div>
            </div>

          </div>{/* /content */}
        </div>{/* /main-area */}
      </div>
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function StatCard({ stat, delay, accent }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, []);

  const deltaClass = stat.up === true ? "up" : stat.up === false ? "down" : "neutral";

  return (
    <div ref={ref} className={`stat-card ${visible ? "visible" : ""}`} style={{ animationDelay: `${delay}s` }}>
      <div className="stat-top">
        <span className="stat-emoji">{stat.icon}</span>
        {stat.delta && (
          <span className={`stat-delta ${deltaClass}`}>{stat.delta}</span>
        )}
      </div>
      <div className="stat-value">
        {visible ? <AnimatedNumber value={stat.value} /> : "0"}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="stat-label">{stat.label}</span>
        <Sparkline color={accent} animated={visible} />
      </div>
    </div>
  );
}

function AnimatedPanel({ children, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, []);
  return <div className={`panel ${visible ? "visible" : ""}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

const BAR_DATA = [
  { label: "Mon", value: 68 },
  { label: "Tue", value: 85 },
  { label: "Wed", value: 72 },
  { label: "Thu", value: 91 },
  { label: "Fri", value: 78 },
  { label: "Sat", value: 44 },
];

function BarChart({ accent }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 600); return () => clearTimeout(t); }, []);
  return (
    <div className="chart-area">
      {BAR_DATA.map((b) => (
        <div className="bar-row" key={b.label}>
          <div className="bar-meta">
            <span>{b.label}</span>
            <span>{b.value}%</span>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${animated ? "animated" : ""}`}
              style={{ width: `${b.value}%`, transitionDelay: animated ? `${Math.random() * 0.3}s` : "0s" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ accent }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 700); return () => clearTimeout(t); }, []);
  const r = 36, circumference = 2 * Math.PI * r;
  const pct = 0.75;
  const offset = circumference * (1 - pct);
  return (
    <div className="ring-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90" className="ring-svg">
        <circle className="ring-bg" cx="45" cy="45" r={r} strokeWidth="8" />
        <circle
          className={`ring-fill ${animated ? "animated" : ""}`}
          cx="45" cy="45" r={r} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          stroke={accent}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="ring-info">
        <div className="ring-value">75%</div>
        <div className="ring-label">Tasks completed</div>
        <div className="ring-sub">↑ 8% from last week</div>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = {
  TEACHER: [
    { icon: "📝", label: "New Assignment", sub: "Create & publish" },
    { icon: "📊", label: "Grade Book", sub: "Enter marks" },
    { icon: "📅", label: "Schedule Class", sub: "Set timetable" },
    { icon: "💬", label: "Message Parent", sub: "Send note" },
  ],
  PARENT: [
    { icon: "📨", label: "Message Teacher", sub: "Send note" },
    { icon: "📅", label: "Book Meeting", sub: "Request slot" },
    { icon: "💳", label: "Pay Fees", sub: "Online payment" },
    { icon: "📄", label: "View Report", sub: "Latest card" },
  ],
};
const DEFAULT_QUICK = [
  { icon: "➕", label: "Add User", sub: "Invite & assign" },
  { icon: "📊", label: "Analytics", sub: "View reports" },
  { icon: "🔧", label: "Settings", sub: "System config" },
  { icon: "🔒", label: "Security", sub: "Audit logs" },
];

function QuickActions({ role }) {
  const items = QUICK_ACTIONS[role] || DEFAULT_QUICK;
  return (
    <div className="quick-grid">
      {items.map((a, i) => (
        <button className="quick-btn" key={i}>
          <span className="quick-btn-icon">{a.icon}</span>
          <span className="quick-btn-label">{a.label}</span>
          <span className="quick-btn-sub">{a.sub}</span>
        </button>
      ))}
    </div>
  );
}

export default RoleHomePage;