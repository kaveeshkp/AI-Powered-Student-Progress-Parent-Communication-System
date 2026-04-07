import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getStudents } from "../../services/studentService";
import { PATHS } from "../../routes/paths";

function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // Placeholder for student-specific data
        setAssignments([
          { id: 1, title: "Math Assignment 1", dueDate: "2026-04-15", status: "pending" },
          { id: 2, title: "English Essay", dueDate: "2026-04-20", status: "submitted" },
        ]);
        setGrades([
          { id: 1, subject: "Mathematics", grade: "A", percentage: "92%" },
          { id: 2, subject: "English", grade: "B+", percentage: "87%" },
        ]);
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

  return (
    <DashboardLayout title="Student Dashboard">
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Assignments Section */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Assignments</h2>
              <p className="text-sm text-slate-300">Upcoming and submitted work.</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
              {assignments.length}
            </span>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-12 rounded bg-slate-800/50 animate-pulse" />
              <div className="h-12 rounded bg-slate-800/50 animate-pulse" />
            </div>
          ) : (
            <ul className="divide-y divide-slate-800 space-y-2">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="flex items-center justify-between py-2 text-sm text-slate-200">
                  <div>
                    <p className="font-semibold text-white">{assignment.title}</p>
                    <p className="text-xs text-slate-400">Due: {assignment.dueDate}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    assignment.status === 'submitted'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-yellow-500/20 text-yellow-200'
                  }`}>
                    {assignment.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Grades Section */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Grades</h2>
              <p className="text-sm text-slate-300">Current semester grades.</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
              {grades.length}
            </span>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-12 rounded bg-slate-800/50 animate-pulse" />
              <div className="h-12 rounded bg-slate-800/50 animate-pulse" />
            </div>
          ) : (
            <ul className="divide-y divide-slate-800 space-y-2">
              {grades.map((grade) => (
                <li key={grade.id} className="flex items-center justify-between py-2 text-sm text-slate-200">
                  <div>
                    <p className="font-semibold text-white">{grade.subject}</p>
                    <p className="text-xs text-slate-400">{grade.percentage}</p>
                  </div>
                  <span className="text-lg font-bold text-indigo-200">{grade.grade}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick Info */}
      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Info</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Attendance Rate</p>
            <p className="text-2xl font-bold text-green-400 mt-1">95%</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Average Grade</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">A-</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Pending Work</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{assignments.filter(a => a.status === 'pending').length}</p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default StudentDashboard;
