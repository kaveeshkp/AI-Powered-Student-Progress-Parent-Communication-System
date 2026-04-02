import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStudents } from "../services/studentService";
import RoleGate from "../routes/RoleGate";
import {
  Card,
  ErrorBanner,
  SkeletonBlock,
  SkeletonLine,
} from "../components/UiPrimitives";

function TeacherDashboard() {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalStudents: 0,
    averageGrade: "—",
    averageAttendance: "—",
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getStudents();
        if (!isMounted) return;

        const list = data?.students || data || [];
        const s = data?.summary || {};

        setStudents(list);
        setSummary({
          totalStudents: s.totalStudents ?? list.length ?? 0,
          averageGrade: s.averageGrade ?? "—",
          averageAttendance: s.averageAttendance ?? "—",
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

  const studentRows = useMemo(
    () =>
      students.map((s, idx) => ({
        id: s.id ?? idx,
        name: s.fullName || s.name || "Unnamed",
        grade: s.grade || s.latestGrade || "—",
        attendance: s.attendance || s.attendanceRate || "—",
      })),
    [students]
  );

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        <PageHero
          eyebrow="Teacher Portal"
          title={`Welcome, ${user?.fullName || user?.email || "Teacher"}`}
          description="Track student performance, monitor attendance, and move quickly through your most important classroom workflows."
          action={
            <div className="flex flex-wrap gap-2">
              <RoleGate allowedRoles={["TEACHER"]}>
                <Link
                  to="/messages"
                  className="inline-flex items-center rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                >
                  Open Messages
                </Link>
              </RoleGate>

              <RoleGate allowedRoles={["TEACHER"]}>
                <Link
                  to="/ai-insights"
                  className="inline-flex items-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-400"
                >
                  View AI Insights
                </Link>
              </RoleGate>
            </div>
          }
        />

        <ErrorBanner message={error} />

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Total Students"
            value={summary.totalStudents}
            helper="Current class roster"
            tone="indigo"
            loading={loading}
          />
          <MetricCard
            label="Average Grade"
            value={summary.averageGrade}
            helper="Latest academic snapshot"
            tone="emerald"
            loading={loading}
          />
          <MetricCard
            label="Attendance"
            value={summary.averageAttendance}
            helper="Overall class presence"
            tone="amber"
            loading={loading}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
          <SectionCard
            eyebrow="Roster"
            title="Students"
            description="Browse your students and drill into their academic details."
            badge="Live"
          >
            {loading ? (
              <div className="mt-4 space-y-3">
                <SkeletonBlock className="h-14 rounded-xl" />
                <SkeletonBlock className="h-14 rounded-xl" />
                <SkeletonBlock className="h-14 rounded-xl" />
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
                <ul className="divide-y divide-slate-800">
                  {studentRows.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between gap-4 px-4 py-4 text-sm text-slate-200 transition hover:bg-slate-800/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {student.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Grade {student.grade} · Attendance {student.attendance}
                        </p>
                      </div>

                      <Link
                        to={`/teacher/students/${student.id}`}
                        className="shrink-0 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                      >
                        View Details
                      </Link>
                    </li>
                  ))}

                  {!studentRows.length ? (
                    <li className="px-4 py-4 text-sm text-slate-400">
                      No students found.
                    </li>
                  ) : null}
                </ul>
              </div>
            )}
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              eyebrow="Actions"
              title="Quick Actions"
              description="Move into the workflows you use most often."
            >
              <div className="mt-4 grid gap-3">
                <ActionButton
                  to="/messages"
                  title="Open Messages"
                  subtitle="Reply to parents and students"
                  tone="primary"
                />
                <ActionButton
                  to="/ai-insights"
                  title="AI Insights"
                  subtitle="Review performance suggestions"
                />
              </div>

              <InfoNote className="mt-5">
                Data shown here comes from your students API and summary service.
              </InfoNote>
            </SectionCard>

            <SectionCard
              eyebrow="Focus"
              title="Today’s Priority"
              description="Keep the page useful even when there is no chart yet."
            >
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm font-semibold text-white">
                  Review attendance and identify students who need follow-up.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  This panel can later show reminders, alerts, upcoming classes,
                  or AI-generated recommendations.
                </p>
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <SectionCard
            eyebrow="Attendance"
            title="Attendance Page Pattern"
            description="Use the same design system for attendance-related screens."
          >
            <div className="mt-4 space-y-3">
              <MiniInfoCard
                title="Top Summary"
                text="Present, absent, late, and attendance rate."
              />
              <MiniInfoCard
                title="Main Content"
                text="Attendance table with filters, dates, and student status."
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Grades"
            title="Grades Page Pattern"
            description="Keep the same shell and change only the content."
          >
            <div className="mt-4 space-y-3">
              <MiniInfoCard
                title="Top Summary"
                text="Average grade, top performers, and pending grading."
              />
              <MiniInfoCard
                title="Main Content"
                text="Assessment list, grade table, and subject drill-down."
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Messages"
            title="Messages Page Pattern"
            description="This same layout can support communication pages too."
          >
            <div className="mt-4 space-y-3">
              <MiniInfoCard
                title="Top Summary"
                text="Unread messages, flagged threads, and sent count."
              />
              <MiniInfoCard
                title="Main Content"
                text="Conversation list, quick replies, and contact shortcuts."
              />
            </div>
          </SectionCard>
        </section>

        <SectionCard
          eyebrow="Workspace"
          title="Teacher Workspace"
          description={`Welcome, ${user?.fullName || user?.email}. Review classes, monitor attendance, and share updates with parents.`}
        >
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <HighlightStat label="Students Loaded" value={studentRows.length} />
            <HighlightStat label="Average Grade" value={summary.averageGrade} />
            <HighlightStat
              label="Average Attendance"
              value={summary.averageAttendance}
            />
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

function PageHero({ eyebrow, title, description, action }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

function SectionCard({ eyebrow, title, description, badge, children }) {
  return (
    <Card className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-300">
              {description}
            </p>
          ) : null}
        </div>

        {badge ? (
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
            {badge}
          </span>
        ) : null}
      </div>

      {children}
    </Card>
  );
}

function MetricCard({ label, value, helper, tone = "indigo", loading }) {
  const toneMap = {
    indigo: "from-indigo-500/20 to-indigo-400/5 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-400/5 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-400/5 border-amber-500/30",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${
        toneMap[tone] || toneMap.indigo
      } p-5 shadow-lg`}
    >
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">
        {label}
      </p>

      {loading ? (
        <div className="mt-3">
          <SkeletonLine />
        </div>
      ) : (
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      )}

      {helper ? (
        <p className="mt-2 text-sm leading-6 text-slate-300">{helper}</p>
      ) : null}
    </div>
  );
}

function ActionButton({ to, title, subtitle, tone = "secondary" }) {
  const classes =
    tone === "primary"
      ? "bg-indigo-500 text-white hover:bg-indigo-400 shadow-md"
      : "border border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20";

  return (
    <Link
      to={to}
      className={`rounded-2xl px-4 py-3 transition ${classes}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs opacity-90">{subtitle}</div>
    </Link>
  );
}

function MiniInfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function HighlightStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoNote({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-800/50 p-4 text-sm text-slate-300 ${className}`}
    >
      {children}
    </div>
  );
}

export default TeacherDashboard;