import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getStudents } from "../services/studentService";
import RoleGate from "../routes/RoleGate";
import { ErrorBanner, SkeletonBlock } from "../components/UiPrimitives";
import {
  ActionButton,
  EmptyStatePanel,
  InfoNote,
  MetricCard,
  PageHero,
  SectionCard
} from "../components/DashboardDesignSystem";

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

  const loadStudents = async (isMountedRef) => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents();
      if (isMountedRef && !isMountedRef.current) return;

      const list = Array.isArray(data?.students)
        ? data.students
        : Array.isArray(data)
          ? data
          : [];
      const s = data?.summary || {};

      setStudents(list);
      setSummary({
        totalStudents: s.totalStudents ?? list.length,
        averageGrade: s.averageGrade ?? "—",
        averageAttendance: s.averageAttendance ?? "—",
      });
    } catch (err) {
      if (isMountedRef && !isMountedRef.current) return;
      setStudents([]);
      setSummary({ totalStudents: 0, averageGrade: "—", averageAttendance: "—" });
      setError(err?.message || "Failed to load students.");
    } finally {
      if (!isMountedRef || isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const ref = { current: true };
    loadStudents(ref);

    return () => {
      ref.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const topStudents = useMemo(() => studentRows.slice(0, 6), [studentRows]);
  const isEmpty = !loading && studentRows.length === 0;

  const retryButton = (
    <button
      type="button"
      onClick={() => loadStudents()}
      className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
    >
      Retry Load
    </button>
  );

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        <PageHero
          eyebrow="Teacher Portal"
          title={`${greeting}, ${user?.fullName || user?.email || "Teacher"}`}
          description="Monitor class performance, attendance trends, and parent communication from a focused, premium teaching workspace."
          accent="cyan"
          action={
            <div className="flex flex-wrap gap-2">
              <RoleGate allowedRoles={["TEACHER"]}>
                <Link
                  to="/messages"
                  className="inline-flex items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  Open Messages
                </Link>
              </RoleGate>

              <RoleGate allowedRoles={["TEACHER"]}>
                <Link
                  to="/ai-insights"
                  className="inline-flex items-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
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
            tone="cyan"
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
            title="Students Snapshot"
            description="Review your latest roster and jump into student detail pages."
            badge={error ? "Data Issue" : "Live"}
            accent="cyan"
          >
            {loading ? (
              <div className="mt-4 space-y-3">
                <SkeletonBlock className="h-14 rounded-xl" />
                <SkeletonBlock className="h-14 rounded-xl" />
                <SkeletonBlock className="h-14 rounded-xl" />
              </div>
            ) : isEmpty ? (
              <EmptyStatePanel
                title={error ? "Unable to load roster" : "No students available"}
                detail={
                  error
                    ? "The students service is temporarily unavailable. Retry when backend/API is reachable."
                    : "No student records were returned for your account yet."
                }
                action={retryButton}
                accent="cyan"
              />
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
                <ul className="divide-y divide-slate-800">
                  {topStudents.map((student) => (
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
                        className="shrink-0 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        View Details
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && studentRows.length > topStudents.length ? (
              <InfoNote className="mt-4">
                Showing {topStudents.length} of {studentRows.length} students. Open a student record for full details.
              </InfoNote>
            ) : null}
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              eyebrow="Actions"
              title="Quick Actions"
              description="Move into the workflows you use most often."
              accent="cyan"
            >
              <div className="mt-4 grid gap-3">
                <ActionButton
                  to="/messages"
                  title="Open Messages"
                  subtitle="Reply to parents and students"
                  tone="cyan"
                />
                <ActionButton
                  to="/ai-insights"
                  title="AI Insights"
                  subtitle="Review performance suggestions"
                  tone="cyan-outline"
                />
              </div>

              <InfoNote className="mt-5">
                Data shown here comes from your students API and summary service.
              </InfoNote>
            </SectionCard>

            <SectionCard
              eyebrow="Focus"
              title="Teaching Focus"
              description="Keep daily priorities visible and actionable."
              accent="cyan"
            >
              <div className="mt-4 space-y-2">
                <MiniInfoCard title="Attendance Follow-up" text="Review late and absent students first." />
                <MiniInfoCard title="Parent Communication" text="Send updates for at-risk students." />
                <MiniInfoCard title="Assessment Review" text="Track trends before the next class." />
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <SectionCard
            eyebrow="Attendance"
            title="Attendance Pattern"
            description="Reusable structure for attendance pages."
            accent="cyan"
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
            title="Grades Pattern"
            description="Same shell, grade-focused content modules."
            accent="cyan"
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
            title="Messages Pattern"
            description="Communication-ready layout with clear hierarchy."
            accent="cyan"
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
          accent="cyan"
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

export default TeacherDashboard;