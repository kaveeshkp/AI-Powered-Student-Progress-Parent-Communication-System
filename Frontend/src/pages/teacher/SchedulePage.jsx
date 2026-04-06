import { useState } from "react";
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

.week-nav { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; align-items: center; }
.week-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; }
.week-btn:hover { background: var(--cyan-dim); color: var(--cyan); }
.week-label { font-size: 0.85rem; font-weight: 600; color: var(--text); flex: 1; }

.schedule-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.schedule-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 1.1rem; transition: border-color 0.2s, transform 0.2s; }
.schedule-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.sc-day { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cyan); margin-bottom: 0.5rem; }
.sc-date { font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem; }
.sc-sessions { display: flex; flex-direction: column; gap: 0.65rem; }

.session { padding: 0.75rem 0.85rem; border-radius: 10px; background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.12); }
.session-time { font-size: 0.75rem; font-weight: 700; color: var(--cyan); }
.session-class { font-size: 0.8rem; font-weight: 600; color: #fff; margin-top: 0.2rem; }
.session-info { font-size: 0.7rem; color: var(--muted); margin-top: 0.3rem; }

.timetable { width: 100%; border-collapse: collapse; }
.timetable th { padding: 0.8rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.01); }
.timetable td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
.timetable tbody tr:hover { background: rgba(34,211,238,0.02); }
.tt-time { font-weight: 700; color: var(--cyan); width: 80px; }
.tt-class { font-weight: 600; color: #fff; }
.tt-room { font-size: 0.77rem; color: var(--muted); }
.tt-students { font-size: 0.77rem; color: var(--muted2); }

.btn-primary { padding: 0.6rem 1.2rem; border-radius: 10px; background: var(--cyan); color: #040810; border: none; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #67e8f9; }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
.stat-tile { padding: 1rem; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); }
.st-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
.st-value { font-size: 1.8rem; font-weight: 700; color: var(--cyan); margin-top: 0.4rem; }
`;

function SchedulePage() {
  const { user } = useAuth();
  const [view, setView] = useState("week");

  const scheduleData = [
    { day: "Monday", date: "Apr 8", sessions: [
      { time: "09:00 AM", class: "Mathematics - Grade 10A", room: "Room 201", students: 28 },
      { time: "10:45 AM", class: "Mathematics - Grade 10B", room: "Room 202", students: 32 },
    ]},
    { day: "Tuesday", date: "Apr 9", sessions: [
      { time: "09:00 AM", class: "Advanced Calculus - Grade 12", room: "Lab 101", students: 22 },
      { time: "11:00 AM", class: "Mathematics - Grade 10A", room: "Room 201", students: 28 },
    ]},
    { day: "Wednesday", date: "Apr 10", sessions: [
      { time: "10:00 AM", class: "Mathematics - Grade 10B", room: "Room 202", students: 32 },
      { time: "01:00 PM", class: "Advanced Calculus - Grade 12", room: "Lab 101", students: 22 },
    ]},
    { day: "Thursday", date: "Apr 11", sessions: [
      { time: "09:00 AM", class: "Mathematics - Grade 10A", room: "Room 201", students: 28 },
    ]},
    { day: "Friday", date: "Apr 12", sessions: [
      { time: "10:00 AM", class: "Mathematics - Grade 10B", room: "Room 202", students: 32 },
      { time: "02:00 PM", class: "Advanced Calculus - Grade 12", room: "Lab 101", students: 22 },
    ]},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="page-root">
        <header className="page-header">
          <Link to="/teacher" className="page-header-back">←</Link>
          <h1 className="page-title">Class Schedule</h1>
        </header>

        <div className="page-content">
          <div className="section-card anim">
            <div className="sc-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", width: "100%" }}>
                <div>
                  <div className="sc-title">This Week's Classes</div>
                  <div className="sc-desc">Your complete teaching schedule for the week.</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className={`week-btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")} style={view === "week" ? { background: "var(--cyan-dim)", color: "var(--cyan)", borderColor: "var(--cyan)" } : {}}>📅</button>
                  <button className={`week-btn ${view === "table" ? "active" : ""}`} onClick={() => setView("table")} style={view === "table" ? { background: "var(--cyan-dim)", color: "var(--cyan)", borderColor: "var(--cyan)" } : {}}>📋</button>
                </div>
              </div>
            </div>
            <div className="sc-body">
              {view === "week" ? (
                <div className="schedule-grid" style={{ marginTop: "0.75rem" }}>
                  {scheduleData.map((day, i) => (
                    <div key={i} className="schedule-card anim" style={{ animationDelay: `${0.05 * (i + 1)}s` }}>
                      <div className="sc-day">{day.day}</div>
                      <div className="sc-date">{day.date}</div>
                      <div className="sc-sessions">
                        {day.sessions.map((s, j) => (
                          <div key={j} className="session">
                            <div className="session-time">{s.time}</div>
                            <div className="session-class">{s.class}</div>
                            <div className="session-info">{s.room} • {s.students} students</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
                  <table className="timetable">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Class</th>
                        <th>Room</th>
                        <th>Duration</th>
                        <th>Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.flatMap(day => day.sessions.map((s, i) => (
                        <tr key={i}>
                          <td className="tt-time">{s.time}</td>
                          <td className="tt-class">{s.class}</td>
                          <td className="tt-room">{s.room}</td>
                          <td className="tt-room">45 min</td>
                          <td className="tt-students">{s.students}</td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.1s" }}>
            <div className="sc-header">
              <div className="sc-title">Free Time Slots</div>
              <div className="sc-desc">Your available time for prep, grading, and meetings.</div>
            </div>
            <div className="sc-body">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { day: "Monday", time: "01:00 PM - 02:00 PM", event: "Lunch Break" },
                  { day: "Tuesday", time: "01:00 PM - 02:45 PM", event: "Admin Time" },
                  { day: "Wednesday", time: "02:00 PM - 03:00 PM", event: "Prep Time" },
                  { day: "Thursday", time: "10:45 AM - 12:30 PM", event: "Grading Time" },
                  { day: "Friday", time: "01:00 PM - 02:00 PM", event: "Parent Meetings" },
                ].map((slot, i) => (
                  <div key={i} style={{ padding: "0.85rem 1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{slot.day}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem" }}>{slot.time}</div>
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--amber)", background: "rgba(251,191,36,0.1)", padding: "0.3rem 0.7rem", borderRadius: 8 }}>
                      {slot.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-card anim" style={{ animationDelay: "0.15s" }}>
            <div className="sc-header">
              <div className="sc-title">Week Summary</div>
              <div className="sc-desc">Overview of your teaching load this week.</div>
            </div>
            <div className="sc-body">
              <div className="stat-grid">
                <div className="stat-tile">
                  <div className="st-label">Total Classes</div>
                  <div className="st-value">10</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Total Students</div>
                  <div className="st-value">130</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Teaching Hours</div>
                  <div className="st-value">7.5</div>
                </div>
                <div className="stat-tile">
                  <div className="st-label">Free Time</div>
                  <div className="st-value">6h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SchedulePage;
