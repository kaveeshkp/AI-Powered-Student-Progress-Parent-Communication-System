import { useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { PATHS } from "../../routes/paths";

export function StudentAssignmentsPage() {
  // Mock data - replace with API call
  const assignments = [
    {
      id: 1,
      title: "Math Homework Chapter 5",
      subject: "Mathematics",
      dueDate: "2026-04-15",
      status: "pending",
      progress: 0,
    },
    {
      id: 2,
      title: "Essay on Climate Change",
      subject: "English",
      dueDate: "2026-04-12",
      status: "submitted",
      progress: 100,
    },
    {
      id: 3,
      title: "Science Project Report",
      subject: "Science",
      dueDate: "2026-04-20",
      status: "in-progress",
      progress: 60,
    },
  ];

  const studentLinks = [
    { to: PATHS.STUDENT, label: "Overview", icon: "⊞", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_ASSIGNMENTS, label: "Assignments", icon: "📋", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_GRADES, label: "Grades", icon: "📊", roles: ["STUDENT"] },
    { to: PATHS.STUDENT_SCHEDULE, label: "Schedule", icon: "🗓️", roles: ["STUDENT"] },
    { to: PATHS.MESSAGES, label: "Messages", icon: "💬", roles: ["STUDENT"] },
  ];

  const stats = useMemo(() => ({
    total: assignments.length,
    pending: assignments.filter(a => a.status === "pending").length,
    inProgress: assignments.filter(a => a.status === "in-progress").length,
    submitted: assignments.filter(a => a.status === "submitted").length,
  }), []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-500/10 text-red-300 border-red-500/30";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
      case "submitted":
        return "bg-green-500/10 text-green-300 border-green-500/30";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <DashboardLayout links={studentLinks} title="My Assignments">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-red-300">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-yellow-300">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Submitted</p>
            <p className="text-2xl font-bold text-green-300">{stats.submitted}</p>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{assignment.title}</h3>
                  <p className="text-sm text-slate-400">{assignment.subject}</p>
                </div>
                <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progress</span>
                  <span>{assignment.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <button className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
