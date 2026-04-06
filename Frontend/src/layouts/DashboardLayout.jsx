import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "../routes/paths";

const baseLinks = [
  // Admin
  { to: PATHS.ADMIN, label: "Dashboard", icon: "⊞", roles: ["ADMIN"] },
  
  // Teacher
  { to: PATHS.TEACHER, label: "Overview", icon: "⊞", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_STUDENTS, label: "Students", icon: "👥", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_ASSIGNMENTS, label: "Assignments", icon: "📋", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_GRADES, label: "Grades", icon: "📊", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_ATTENDANCE, label: "Attendance", icon: "✅", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_SCHEDULE, label: "Schedule", icon: "🗓️", roles: ["TEACHER"] },
  { to: PATHS.TEACHER_MESSAGES, label: "Messages", icon: "💬", roles: ["TEACHER"] },
  { to: PATHS.AI_INSIGHTS, label: "AI Insights", icon: "🤖", roles: ["TEACHER"] },
  
  // Parent
  { to: PATHS.PARENT, label: "Dashboard", icon: "⊞", roles: ["PARENT"] },
  
  // Shared
  { to: PATHS.MESSAGES, label: "Messages", icon: "💬", roles: ["PARENT", "ADMIN"] }
];

function DashboardLayout({ children, links = baseLinks, title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = user?.role || "";

  const filteredLinks = links.filter((link) => !link.roles || link.roles.includes(role));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-lg border border-slate-800 bg-slate-800/50 p-2 hover:border-indigo-500 hover:text-indigo-300"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">{role || "User"}</p>
              <h1 className="text-lg font-semibold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-slate-300">{user?.fullName || user?.email}</div>
            <button
              onClick={logout}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`lg:static lg:flex lg:w-64 lg:flex-col ${
            isSidebarOpen ? "" : "hidden"
          } flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur lg:block`}
        >
          <nav className="space-y-1">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:text-indigo-200 ${
                    isActive ? "bg-indigo-500/15 text-indigo-200 border border-indigo-500/40" : "text-slate-200"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.icon && <span className="text-base">{link.icon}</span>}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-100">Need help?</p>
            <p className="mt-1">Reach out to support or your administrator.</p>
            <Link to={PATHS.MESSAGES} className="mt-2 inline-block text-indigo-300 hover:text-indigo-200">
              Go to messages →
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
