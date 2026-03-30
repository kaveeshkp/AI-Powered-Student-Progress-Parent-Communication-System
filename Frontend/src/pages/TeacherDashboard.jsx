import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStudents } from "../services/studentService";
import RoleGate from "../routes/RoleGate";
import { Card, ErrorBanner, SkeletonBlock, SkeletonLine } from "../components/UiPrimitives";

function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ totalStudents: 0, averageGrade: "—", averageAttendance: "—" });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getStudents();
        if (!isMounted) return;
        const list = data?.students || data || [];
        setStudents(list);
        const s = data?.summary || {};
        setSummary({
          totalStudents: s.totalStudents ?? list.length ?? 0,
          averageGrade: s.averageGrade ?? "—",
          averageAttendance: s.averageAttendance ?? "—"
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load students.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const studentRows = useMemo(() => students.map((s, idx) => ({
    id: s.id ?? idx,
    name: s.fullName || s.name || "Unnamed",
    grade: s.grade || s.latestGrade || "—",
    attendance: s.attendance || s.attendanceRate || "—"
  })), [students]);

  return (
    <DashboardLayout title="Teacher Dashboard">
      <ErrorBanner message={error} />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total students" value={summary.totalStudents} tone="indigo" loading={loading} />
        <SummaryCard label="Average grade" value={summary.averageGrade} tone="emerald" loading={loading} />
        <SummaryCard label="Attendance" value={summary.averageAttendance} tone="amber" loading={loading} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">Roster</p>
              <h2 className="text-lg font-semibold text-white">Students</h2>
              <p className="text-sm text-slate-300">Browse and drill into student details.</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">Live</span>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">
              <SkeletonBlock className="h-12" />
              <SkeletonBlock className="h-12" />
              <SkeletonBlock className="h-12" />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/40">
              {studentRows.map((student) => (
                <li key={student.id} className="flex items-center justify-between px-4 py-3 text-sm text-slate-200">
                  <div>
                    <p className="font-semibold text-white">{student.name}</p>
                    <p className="text-xs text-slate-400">Grade {student.grade} · Attendance {student.attendance}</p>
                  </div>
                  <Link
                    to={`/teacher/students/${student.id}`}
                    className="rounded-lg border border-indigo-500/50 px-3 py-1 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/10"
                  >
                    View
                  </Link>
                </li>
              ))}
              {!studentRows.length ? <li className="px-4 py-3 text-sm text-slate-400">No students found.</li> : null}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <p className="text-sm text-slate-300">Jump into key workflows.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <RoleGate allowedRoles={["TEACHER"]}>
              <Link
                to="/messages"
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-400"
              >
                Open Messages
              </Link>
            </RoleGate>
            <RoleGate allowedRoles={["TEACHER"]}>
              <Link
                to="/ai-insights"
                className="rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/20"
              >
                View AI Insights
              </Link>
            </RoleGate>
          </div>
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-800/50 p-3 text-xs text-slate-300">
            Data shown comes from your students API.
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold text-white">Welcome, {user?.fullName || user?.email}</h2>
        <p className="mt-2 text-sm text-slate-300">Review classes, monitor attendance, and share updates with parents.</p>
      </Card>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value, tone = "indigo", loading }) {
  const toneMap = {
    indigo: "from-indigo-500/20 to-indigo-400/10 text-indigo-100 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-400/10 text-emerald-100 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-400/10 text-amber-100 border-amber-500/30"
  };

  const toneClass = toneMap[tone] || toneMap.indigo;

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneClass} p-4 shadow-lg`}> 
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">{label}</p>
      {loading ? <SkeletonLine /> : <p className="mt-2 text-2xl font-semibold text-white">{value}</p>}
    </div>
  );
}

export default TeacherDashboard;
