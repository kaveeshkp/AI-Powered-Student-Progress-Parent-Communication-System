import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStudents } from "../services/studentService";
import { getThreads } from "../services/messageService";
import RoleGate from "../routes/RoleGate";

function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const kids = await getStudents();
        if (!isMounted) return;
        setChildren(kids?.students || kids || []);

        const threads = await getThreads();
        if (!isMounted) return;
        const mappedAlerts = (threads || []).slice(0, 3).map((t, idx) => ({
          id: t.id ?? idx,
          title: t.title || t.subject || t.name || "Update",
          detail: t.preview || t.lastMessage || "New message",
          severity: idx === 0 ? "warn" : "info"
        }));
        setAlerts(mappedAlerts);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const childRows = useMemo(() => children.map((c, idx) => ({
    id: c.id ?? idx,
    name: c.fullName || c.name || "Student",
    grade: c.grade || c.latestGrade || "—",
    attendance: c.attendance || c.attendanceRate || "—"
  })), [children]);

  const perfSummary = useMemo(() => {
    const avgGrade = children[0]?.averageGrade || children[0]?.grade || "—";
    const attendance = children[0]?.attendance || children[0]?.attendanceRate || "—";
    const announcements = alerts.length ? `${alerts.length} recent` : "None";
    return { avgGrade, attendance, announcements };
  }, [children, alerts]);

  return (
    <DashboardLayout title="Parent Dashboard">
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <section className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Children</h2>
              <p className="text-sm text-slate-300">Overview with quick links.</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">Live</span>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/40">
              {childRows.map((child) => (
                <li key={child.id} className="flex items-center justify-between px-4 py-3 text-sm text-slate-200">
                  <div>
                    <p className="font-semibold text-white">{child.name}</p>
                    <p className="text-xs text-slate-400">Grade {child.grade} · Attendance {child.attendance}</p>
                  </div>
                  <Link
                    to={`/parent/student/${child.id}`}
                    className="rounded-lg border border-indigo-500/50 px-3 py-1 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/10"
                  >
                    View
                  </Link>
                </li>
              ))}
              {!childRows.length && !loading ? <li className="px-4 py-3 text-sm text-slate-400">No children found.</li> : null}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Performance</h2>
          <p className="text-sm text-slate-300">Basic summary at a glance.</p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <SummaryRow label="Average grade" value={perfSummary.avgGrade} loading={loading} />
            <SummaryRow label="Attendance" value={perfSummary.attendance} loading={loading} />
            <SummaryRow label="Announcements" value={perfSummary.announcements} loading={loading} />
          </div>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-xs text-slate-300">
            Data updates as your student info changes.
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg md:col-span-2">
          <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          <div className="mt-3 space-y-3">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : alerts.length ? (
              alerts.map((alert) => (
                <AlertCard key={alert.id} title={alert.title} detail={alert.detail} severity={alert.severity} />
              ))
            ) : (
              <p className="text-sm text-slate-400">No alerts right now.</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Stay Connected</h2>
          <p className="text-sm text-slate-300">Message teachers or review updates.</p>
          <div className="mt-4 flex flex-col gap-2">
            <RoleGate allowedRoles={["PARENT"]}>
              <Link
                to="/messages"
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-400"
              >
                Open Messages
              </Link>
            </RoleGate>
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
            >
              Switch account
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-white">Welcome, {user?.fullName || user?.email}</h2>
        <p className="mt-2 text-sm text-slate-300">
          Stay on top of your child's progress and communicate with teachers.
        </p>
      </section>
    </DashboardLayout>
  );
}

function SummaryRow({ label, value, loading }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2">
      <span className="text-slate-300">{label}</span>
      {loading ? <SkeletonLine /> : <span className="font-semibold text-white">{value}</span>}
    </div>
  );
}

function AlertCard({ title, detail, severity = "info" }) {
  const tone = severity === "warn" ? "border-amber-400/60 text-amber-100 bg-amber-500/10" : "border-indigo-400/60 text-indigo-100 bg-indigo-500/10";
  return (
    <div className={`rounded-lg border ${tone} px-3 py-3 text-sm`}>
      <p className="font-semibold">{title}</p>
      <p className="text-slate-200/90">{detail}</p>
    </div>
  );
}

function SkeletonLine() {
  return <div className="h-3 w-16 rounded-full bg-slate-800 animate-pulse" />;
}

function SkeletonRow() {
  return <div className="h-12 rounded-lg bg-slate-800/60 animate-pulse" />;
}

export default ParentDashboard;
