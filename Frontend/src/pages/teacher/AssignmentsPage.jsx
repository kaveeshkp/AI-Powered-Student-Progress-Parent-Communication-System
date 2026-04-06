import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --border:      rgba(255,255,255,0.07);
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
.page-header-back { width: 36px; height: 36px; border-radius: 9px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted2); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; }
.page-header-back:hover { background: var(--cyan-dim); color: var(--cyan); }
.page-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 600; color: #fff; }

.page-content { flex: 1; overflow-y: auto; padding: 2rem 1.75rem; }
.page-content::-webkit-scrollbar { width: 4px; }
.page-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
.anim { opacity: 0; transform: translateY(20px); animation: fadeUp 0.55s var(--ease) forwards; }

.section-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; margin-bottom: 1.25rem; }
.sc-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.sc-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: #fff; }
.sc-desc { font-size: 0.78rem; color: var(--muted2); margin-top: 0.3rem; }
.sc-body { padding: 1.25rem 1.5rem; }

.assignment-row { padding: 1rem; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 0.75rem; }
.assignment-row:hover { background: rgba(34,211,238,0.02); border-color: rgba(34,211,238,0.2); }
.ar-header { display: flex; justify-content: space-between; align-items: start; }
.ar-title { font-size: 0.95rem; font-weight: 600; color: #fff; }
.ar-meta { font-size: 0.75rem; color: var(--muted); margin-top: 0.4rem; }
.ar-status { padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
.ar-status.pending { background: rgba(251,191,36,0.1); color: var(--amber); }
.ar-status.graded { background: rgba(52,211,153,0.1); color: var(--emerald); }
.ar-status.submitted { background: rgba(34,211,238,0.1); color: var(--cyan); }
.ar-progress { margin-top: 0.9rem; }
.ar-progress-label { font-size: 0.72rem; color: var(--muted); margin-bottom: 0.3rem; display: flex; justify-content: space-between; }
.ar-progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
.ar-progress-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--emerald)); transition: width 0.4s ease; }

.filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
.filter-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }
.filter-btn:hover { border-color: rgba(34,211,238,0.3); color: var(--text); }

.empty-state { padding: 3rem 1.5rem; text-align: center; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: var(--text); }
.empty-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }

.btn-primary { padding: 0.6rem 1.2rem; border-radius: 10px; background: var(--cyan); color: #040810; border: none; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #67e8f9; }
`;

function AssignmentRow({ assignment }) {
  const statusColor = assignment.status === "pending" ? "pending" : assignment.status === "graded" ? "graded" : "submitted";
  return (
    <div className="assignment-row anim">
      <div className="ar-header">
        <div>
          <div className="ar-title">{assignment.title}</div>
          <div className="ar-meta">Due: {assignment.dueDate} • {assignment.submitted}/{assignment.total} submitted</div>
        </div>
        <div className={`ar-status ar-status-${statusColor}`}>{assignment.status}</div>
      </div>
      <div className="ar-progress">
        <div className="ar-progress-label">
          <span>Submission Progress</span>
          <span style={{ fontWeight: 700, color: "var(--cyan)" }}>{Math.round((assignment.submitted / assignment.total) * 100)}%</span>
        </div>
        <div className="ar-progress-bar">
          <div className="ar-progress-fill" style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function AssignmentsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const assignments = [
    { id: 1, title: "Mathematics: Calculus Problem Set", dueDate: "2024-04-08", submitted: 24, total: 28, status: "pending" },
    { id: 2, title: "Physics: Solar System Project", dueDate: "2024-04-10", submitted: 27, total: 28, status: "submitted" },
    { id: 3, title: "Chemistry: Lab Report", dueDate: "2024-03-28", submitted: 28, total: 28, status: "graded" },
    { id: 4, title: "Biology: Research Essay", dueDate: "2024-04-15", submitted: 18, total: 28, status: "pending" },
    { id: 5, title: "English: Literature Analysis", dueDate: "2024-04-12", submitted: 22, total: 28, status: "submitted" },
  ];

  const filtered = filter === "all" ? assignments : assignments.filter(a => a.status === filter);

  return (
    <>
      <style>{CSS}</style>
      <div className="page-root">
        <header className="page-header">
          <Link to="/teacher" className="page-header-back">←</Link>
          <h1 className="page-title">Assignments Manager</h1>
        </header>

        <div className="page-content">
          <div className="section-card anim">
            <div className="sc-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="sc-title">All Assignments</div>
                  <div className="sc-desc">Create, manage, and track student submissions.</div>
                </div>
                <button className="btn-primary">+ New Assignment</button>
              </div>
            </div>
            <div className="sc-body">
              <div className="filter-bar">
                <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                  All ({assignments.length})
                </button>
                <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
                  Pending (2)
                </button>
                <button className={`filter-btn ${filter === "submitted" ? "active" : ""}`} onClick={() => setFilter("submitted")}>
                  Submitted (2)
                </button>
                <button className={`filter-btn ${filter === "graded" ? "active" : ""}`} onClick={() => setFilter("graded")}>
                  Graded (1)
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <div className="empty-title">No Assignments</div>
                  <div className="empty-sub">Create a new assignment to get started.</div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  {filtered.map((a) => <AssignmentRow key={a.id} assignment={a} />)}
                </div>
              )}
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.1s" }}>
            <div className="sc-header">
              <div className="sc-title">Assignment Statistics</div>
              <div className="sc-desc">Overview of assignment completion metrics.</div>
            </div>
            <div className="sc-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Total Assignments</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--cyan)", marginTop: "0.4rem" }}>5</div>
                </div>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Avg Submission</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--emerald)", marginTop: "0.4rem" }}>84%</div>
                </div>
                <div style={{ padding: "1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Pending Grade</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--amber)", marginTop: "0.4rem" }}>4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignmentsPage;
