import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { getStudentAttendance, getStudentById, getStudentGrades } from "../services/studentService";

function StudentDetailsPage() {
  const { studentId } = useParams();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [p, g, a] = await Promise.all([
          getStudentById(studentId),
          getStudentGrades(studentId),
          getStudentAttendance(studentId)
        ]);
        if (!isMounted) return;
        setProfile(p || {});
        setGrades(g || []);
        setAttendance(a || []);
        setRemarks(p?.remarks || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load student details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const gradeTrend = useMemo(
    () =>
      (grades || []).map((g, idx) => ({
        term: g.term || g.subject || `#${idx + 1}`,
        score: Number(g.score ?? g.value ?? g.percent ?? 0)
      })).filter((g) => !Number.isNaN(g.score)),
    [grades]
  );

  const attendanceTrend = useMemo(() => {
    const buckets = {};
    (attendance || []).forEach((entry) => {
      const month = (entry.month || entry.date || "").toString().slice(0, 7) || "Unknown";
      const key = month;
      if (!buckets[key]) buckets[key] = { month: key, present: 0, absent: 0 };
      if ((entry.status || "").toLowerCase() === "present") buckets[key].present += 1;
      else buckets[key].absent += 1;
    });
    return Object.values(buckets);
  }, [attendance]);

  const info = {
    name: profile?.fullName || profile?.name || "Student",
    gradeLevel: profile?.gradeLevel || profile?.grade || "—",
    homeroom: profile?.homeroom || "—",
    guardian: profile?.guardianName || profile?.guardian || "—",
    contact: profile?.guardianEmail || profile?.contact || "—",
    status: profile?.status || "—"
  };

  return (
    <DashboardLayout title="Student Details">
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">Student #{studentId}</p>
          <h1 className="text-2xl font-semibold text-white">{info.name}</h1>
          <p className="text-sm text-slate-300">Grade {info.gradeLevel} · Homeroom {info.homeroom}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/teacher"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
          >
            Back to dashboard
          </Link>
          <button
            onClick={logout}
            className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <InfoCard label="Guardian" value={info.guardian} loading={loading} />
        <InfoCard label="Contact" value={info.contact} loading={loading} />
        <InfoCard label="Status" value={info.status} tone="emerald" loading={loading} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Grades</h2>
              <p className="text-sm text-slate-300">Recent subject performance.</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">Live</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Grade</th>
                  <th className="px-3 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-3">
                      <SkeletonRow />
                    </td>
                  </tr>
                ) : (
                  grades.map((row, idx) => (
                    <tr key={row.id || row.subject || idx} className="border-b border-slate-800/70">
                      <td className="px-3 py-2 font-semibold text-white">{row.subject || row.course || "—"}</td>
                      <td className="px-3 py-2">{row.grade ?? row.score ?? row.value ?? "—"}</td>
                      <td className="px-3 py-2 text-slate-300">{row.comment || row.remarks || ""}</td>
                    </tr>
                  ))
                )}
                {!grades.length && !loading ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-slate-400">No grades found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Teacher Remarks</h2>
          <p className="text-sm text-slate-300">Key observations and next steps.</p>
          {loading ? (
            <div className="mt-3 space-y-2">
              <SkeletonLine />
              <SkeletonLine />
            </div>
          ) : remarks.length ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {remarks.map((note, idx) => (
                <li key={idx} className="rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2">{note}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No remarks yet.</p>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Attendance</h2>
              <p className="text-sm text-slate-300">Recent attendance records.</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-3">
                      <SkeletonRow />
                    </td>
                  </tr>
                ) : (
                  attendance.map((row, idx) => (
                    <tr key={row.id || row.date || idx} className="border-b border-slate-800/70">
                      <td className="px-3 py-2 text-white">{row.date || row.day || "—"}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            (row.status || "").toLowerCase() === "present"
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-amber-500/15 text-amber-200"
                          }`}
                        >
                          {row.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {!attendance.length && !loading ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-3 text-slate-400">No attendance records.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Highlights</h2>
          <p className="text-sm text-slate-300">Snapshot of current performance.</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li>Average grade trending upward.</li>
            <li>Attendance improving month over month.</li>
            <li>Keep reinforcing reading habits.</li>
          </ul>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Grade Trend</h2>
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">Recharts</span>
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="term" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#a5b4fc" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Attendance Trend</h2>
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">Recharts</span>
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" stackId="a" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ label, value, tone = "indigo", loading }) {
  const toneMap = {
    indigo: "from-indigo-500/20 to-indigo-400/10 text-indigo-100 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-400/10 text-emerald-100 border-emerald-500/30"
  };
  const toneClass = toneMap[tone] || toneMap.indigo;
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneClass} p-4 shadow-lg`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">{label}</p>
      {loading ? <SkeletonLine /> : <p className="mt-2 text-lg font-semibold text-white">{value}</p>}
    </div>
  );
}

function SkeletonLine() {
  return <div className="h-3 w-24 rounded-full bg-slate-800 animate-pulse" />;
}

function SkeletonRow() {
  return <div className="h-10 rounded-lg bg-slate-800/60 animate-pulse" />;
}

export default StudentDetailsPage;
