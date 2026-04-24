import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
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

.attendance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.attendance-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; cursor: pointer; transition: border-color 0.2s, transform 0.2s; }
.attendance-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.ac-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem; }
.ac-student { font-size: 0.9rem; font-weight: 600; color: #fff; }
.ac-roll { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; }
.ac-toggle { display: flex; gap: 0.4rem; }
.toggle-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--muted2); cursor: pointer; font-size: 0.75rem; font-weight: 700; transition: all 0.2s; }
.toggle-btn.present { background: var(--emerald); color: #fff; border-color: var(--emerald); }
.toggle-btn.absent { background: var(--red); color: #fff; border-color: var(--red); }
.toggle-btn.late { background: var(--amber); color: #fff; border-color: var(--amber); }
.toggle-btn:hover { transform: scale(1.05); }

.filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-btn { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
.filter-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

.date-picker { padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); font-size: 0.85rem; cursor: pointer; }
.date-picker:focus { outline: none; border-color: var(--cyan); }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }
.stat-tile { padding: 1rem; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); }
.st-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
.st-value { font-size: 1.8rem; font-weight: 700; color: var(--cyan); margin-top: 0.4rem; }

.btn-group { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
.btn-primary { padding: 0.6rem 1.2rem; border-radius: 10px; background: var(--cyan); color: #040810; border: none; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #67e8f9; }
`;

function AttendanceCard({ student, status, onStatusChange }) {
  return (
    <div className="attendance-card">
      <div>
        <div className="ac-student">{student.name}</div>
        <div className="ac-roll">Roll: {student.roll}</div>
      </div>
      <div className="ac-toggle" style={{ marginTop: "0.75rem" }}>
        <button
          className={`toggle-btn ${status === "present" ? "present" : ""}`}
          onClick={() => onStatusChange("present")}
        >
          ✓ P
        </button>
        <button
          className={`toggle-btn ${status === "absent" ? "absent" : ""}`}
          onClick={() => onStatusChange("absent")}
        >
          ✕ A
        </button>
        <button
          className={`toggle-btn ${status === "late" ? "late" : ""}`}
          onClick={() => onStatusChange("late")}
        >
          ⏱ L
        </button>
      </div>
    </div>
  );
}

function AttendancePage() {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState({
    1: "present",
    2: "present",
    3: "absent",
    4: "present",
    5: "late",
  });

  const students = [
    { id: 1, name: "John Doe", roll: 101 },
    { id: 2, name: "Sarah Smith", roll: 102 },
    { id: 3, name: "Mike Johnson", roll: 103 },
    { id: 4, name: "Emma Wilson", roll: 104 },
    { id: 5, name: "David Brown", roll: 105 },
  ];

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const stats = {
    present: Object.values(attendanceData).filter(s => s === "present").length,
    absent: Object.values(attendanceData).filter(s => s === "absent").length,
    late: Object.values(attendanceData).filter(s => s === "late").length,
    attendance: Math.round(((students.length - Object.values(attendanceData).filter(s => s === "absent").length) / students.length) * 100),
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page-root">
        <header className="page-header">
          <Link to={PATHS.TEACHER} className="page-header-back">←</Link>
          <h1 className="page-title">Attendance Tracker</h1>
        </header>

        <div className="page-content">
          <div className="section-card anim">
            <div className="sc-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", width: "100%" }}>
                <div>
                  <div className="sc-title">Mark Attendance</div>
                  <div className="sc-desc">Record student attendance for today.</div>
                </div>
                <input type="date" className="date-picker" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="sc-body">
              <div className="attendance-grid">
                {students.map((s) => (
                  <AttendanceCard
                    key={s.id}
                    student={s}
                    status={attendanceData[s.id]}
                    onStatusChange={(status) => handleStatusChange(s.id, status)}
                  />
                ))}
              </div>
              <div className="btn-group">
                <button className="btn-primary">✓ Save Attendance</button>
              </div>
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.1s" }}>
            <div className="sc-header">
              <div className="sc-title">Today's Summary</div>
              <div className="sc-desc">Attendance statistics for this session.</div>
            </div>
            <div className="sc-body">
              <div className="stat-grid">
                <div className="stat-tile">
                  <div className="st-label">Present</div>
                  <div className="st-value" style={{ color: "var(--emerald)" }}>{stats.present}</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Absent</div>
                  <div className="st-value" style={{ color: "var(--red)" }}>{stats.absent}</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Late</div>
                  <div className="st-value" style={{ color: "var(--amber)" }}>{stats.late}</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Attendance Rate</div>
                  <div className="st-value" style={{ color: "var(--cyan)" }}>{stats.attendance}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendancePage;
