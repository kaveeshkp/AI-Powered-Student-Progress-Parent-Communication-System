import { useEffect, useState } from "react";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";
import { getStudents } from "../../services/studentService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --border:      rgba(255,255,255,0.07);
  --border2:     rgba(34,211,238,0.18);
  --text:        #dde4f0;
  --muted:       #5a6480;
  --muted2:      #8892aa;
  --cyan:        #22d3ee;
  --cyan-dim:    rgba(34,211,238,0.1);
  --cyan-glow:   rgba(34,211,238,0.22);
  --emerald:     #34d399;
  --amber:       #fbbf24;
  --red:         #f87171;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

body { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }

.page-root { display: flex; min-height: 100vh; flex-direction: column; }
.page-header {
  height: 64px; background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 1.75rem; gap: 1.5rem;
  position: sticky; top: 0; z-index: 30;
}
.page-header-back {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--muted2); cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.page-header-back:hover { background: var(--cyan-dim); color: var(--cyan); }
.page-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 600; color: #fff; }

.page-content { flex: 1; overflow-y: auto; padding: 2rem 1.75rem; }
.page-content::-webkit-scrollbar { width: 4px; }
.page-content::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
.anim { opacity: 0; transform: translateY(20px); animation: fadeUp 0.55s var(--ease) forwards; }

.section-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
  overflow: hidden; margin-bottom: 1.25rem;
}
.sc-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.sc-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: #fff; }
.sc-desc { font-size: 0.78rem; color: var(--muted2); margin-top: 0.3rem; }
.sc-body { padding: 1.25rem 1.5rem; }

.students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.student-card {
  background: var(--surface2); border: 1px solid var(--border); border-radius: 14px;
  padding: 1.25rem; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  cursor: pointer;
}
.student-card:hover { border-color: var(--cyan); box-shadow: 0 0 28px rgba(34,211,238,0.18); transform: translateY(-2px); }
.sc-avatar {
  width: 48px; height: 48px; border-radius: 12px;
  background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 0.75rem;
}
.sc-name { font-size: 0.95rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-meta { font-size: 0.75rem; color: var(--muted); margin-top: 0.4rem; line-height: 1.5; }
.sc-stats { display: flex; gap: 0.5rem; margin-top: 0.85rem; }
.sc-stat { flex: 1; padding: 0.5rem 0.6rem; border-radius: 8px; background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.12); }
.sc-stat-label { font-size: 0.65rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
.sc-stat-value { font-size: 0.95rem; font-weight: 700; color: var(--cyan); margin-top: 0.2rem; }
.sc-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn-sm { flex: 1; padding: 0.5rem 0.7rem; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--cyan); font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: background 0.2s; }
.btn-sm:hover { background: var(--cyan-dim); }

.filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
.filter-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }
.filter-btn:hover { border-color: rgba(34,211,238,0.3); color: var(--text); }

.empty-state { padding: 3rem 1.5rem; text-align: center; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: var(--text); }
.empty-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }
`;

const initials = (str = "") => str.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "S";

function StudentCard({ student }) {
  return (
    <div className="student-card anim">
      <div className="sc-avatar">{initials(student.fullName || student.name)}</div>
      <div className="sc-name">{student.fullName || student.name || "Unnamed"}</div>
      <div className="sc-meta">
        <div>Grade: {student.grade || "—"}</div>
        <div>Roll: {student.rollNumber || "—"}</div>
      </div>
      <div className="sc-stats">
        <div className="sc-stat">
          <div className="sc-stat-label">Avg Grade</div>
          <div className="sc-stat-value">{student.grade || "—"}</div>
        </div>
        <div className="sc-stat">
          <div className="sc-stat-label">Attendance</div>
          <div className="sc-stat-value">{student.attendance || "—"}</div>
        </div>
      </div>
      <div className="sc-actions">
        <Link to={PATHS.TEACHER_STUDENTS_DETAIL(student.id)} className="btn-sm">View Details</Link>
        <button className="btn-sm">📧 Contact</button>
      </div>
    </div>
  );
}

function StudentListPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    getStudents()
      .then((data) => {
        const list = Array.isArray(data?.students) ? data.students : Array.isArray(data) ? data : [];
        setStudents(list);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? students : students.filter(s => s.grade === filter);

  return (
    <>
      <style>{CSS}</style>
      <div className="page-root">
        <header className="page-header">
          <Link to={PATHS.TEACHER} className="page-header-back">←</Link>
          <h1 className="page-title">Students Directory</h1>
        </header>

        <div className="page-content">
          <div className="section-card anim">
            <div className="sc-header">
              <div className="sc-title">All Students</div>
              <div className="sc-desc">Manage and view detailed information for all enrolled students.</div>
            </div>
            <div className="sc-body">
              <div className="filter-bar">
                <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                  All ({students.length})
                </button>
                {["A", "B", "C", "D"].map(g => (
                  <button key={g} className={`filter-btn ${filter === g ? "active" : ""}`} onClick={() => setFilter(g)}>
                    Grade {g}
                  </button>
                ))}
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted)" }}>Loading students...</div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <div className="empty-title">No Students Found</div>
                  <div className="empty-sub">Try adjusting your filters or check back later.</div>
                </div>
              ) : (
                <div className="students-grid" style={{ marginTop: "1rem" }}>
                  {filtered.map((s) => <StudentCard key={s.id} student={s} />)}
                </div>
              )}
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.1s" }}>
            <div className="sc-header">
              <div className="sc-title">Class Statistics</div>
              <div className="sc-desc">Overview of your student cohort.</div>
            </div>
            <div className="sc-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Total Students</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--cyan)", marginTop: "0.4rem" }}>{students.length}</div>
                </div>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Avg Attendance</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--emerald)", marginTop: "0.4rem" }}>94%</div>
                </div>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Class Average</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--amber)", marginTop: "0.4rem" }}>78.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentListPage;
