import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

.table-wrapper { width: 100%; overflow-x: auto; }
.grade-table { width: 100%; border-collapse: collapse; }
.grade-table th { padding: 0.8rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.01); }
.grade-table td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
.grade-table tbody tr { transition: background 0.15s; }
.grade-table tbody tr:hover { background: rgba(34,211,238,0.02); }
.grade-table tbody tr:last-child td { border-bottom: none; }
.gt-student { font-weight: 600; color: #fff; }
.gt-grade { font-weight: 700; color: var(--cyan); }
.gt-input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 0.35rem 0.5rem; border-radius: 6px; font-size: 0.8rem; width: 70px; }
.gt-input:focus { outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px var(--cyan-dim); }

.filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
.filter-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }
.filter-btn:hover { border-color: rgba(34,211,238,0.3); color: var(--text); }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
.stat-tile { padding: 1rem; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); }
.st-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
.st-value { font-size: 1.8rem; font-weight: 700; color: var(--cyan); margin-top: 0.4rem; }

.btn-group { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
.btn-primary { padding: 0.6rem 1.2rem; border-radius: 10px; background: var(--cyan); color: #040810; border: none; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #67e8f9; }
.btn-secondary { padding: 0.6rem 1.2rem; border-radius: 10px; background: var(--surface2); color: var(--cyan); border: 1px solid var(--border); font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
.btn-secondary:hover { background: var(--cyan-dim); border-color: var(--cyan); }
`;

function GradesPage() {
  const { user } = useAuth();

  const students = [
    { id: 1, name: "John Doe", math: "92", science: "88", english: "85", history: "90" },
    { id: 2, name: "Sarah Smith", math: "88", science: "92", english: "94", history: "87" },
    { id: 3, name: "Mike Johnson", math: "76", science: "79", english: "80", history: "75" },
    { id: 4, name: "Emma Wilson", math: "95", science: "93", english: "96", history: "94" },
    { id: 5, name: "David Brown", math: "81", science: "85", english: "79", history: "82" },
  ];

  const calculateAverage = () => {
    const allGrades = students.flatMap(s => [s.math, s.science, s.english, s.history].map(Number));
    return (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page-root">
        <header className="page-header">
          <Link to="/teacher" className="page-header-back">←</Link>
          <h1 className="page-title">Grade Book</h1>
        </header>

        <div className="page-content">
          <div className="section-card anim">
            <div className="sc-header">
              <div className="sc-title">Student Grades</div>
              <div className="sc-desc">View and manage student grades across all subjects.</div>
            </div>
            <div className="sc-body">
              <div className="table-wrapper">
                <table className="grade-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Mathematics</th>
                      <th>Science</th>
                      <th>English</th>
                      <th>History</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const avg = ((Number(s.math) + Number(s.science) + Number(s.english) + Number(s.history)) / 4).toFixed(1);
                      const gradeColor = avg >= 90 ? "var(--emerald)" : avg >= 80 ? "var(--cyan)" : avg >= 70 ? "var(--amber)" : "var(--red)";
                      return (
                        <tr key={s.id}>
                          <td className="gt-student">{s.name}</td>
                          <td><input type="number" className="gt-input" defaultValue={s.math} min="0" max="100" /></td>
                          <td><input type="number" className="gt-input" defaultValue={s.science} min="0" max="100" /></td>
                          <td><input type="number" className="gt-input" defaultValue={s.english} min="0" max="100" /></td>
                          <td><input type="number" className="gt-input" defaultValue={s.history} min="0" max="100" /></td>
                          <td className="gt-grade" style={{ color: gradeColor }}>{avg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="btn-group">
                <button className="btn-primary">💾 Save Changes</button>
                <button className="btn-secondary">📊 Export Report</button>
              </div>
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.1s" }}>
            <div className="sc-header">
              <div className="sc-title">Grade Statistics</div>
              <div className="sc-desc">Overview of class grading metrics.</div>
            </div>
            <div className="sc-body">
              <div className="stat-grid">
                <div className="stat-tile">
                  <div className="st-label">Class Average</div>
                  <div className="st-value">{calculateAverage()}%</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Top Score</div>
                  <div className="st-value">96%</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Lowest Score</div>
                  <div className="st-value">75%</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">A+ Students</div>
                  <div className="st-value">2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GradesPage;
