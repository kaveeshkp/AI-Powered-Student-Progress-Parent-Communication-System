import { useEffect, useMemo, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudents } from "../../services/studentService";
import { PATHS } from "../../routes/paths";
import RoleGate from "../../routes/RoleGate";

/* ─────────────────────────────────────────────────────────────────────────
   INLINE STYLES  (single <style> block — zero external deps beyond fonts)
───────────────────────────────────────────────────────────────────────── */
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
  --sidebar-w:   248px;
  --topbar-h:    64px;
}

/* ── Layout shell ── */
.td-root { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); display: flex; overflow: hidden; }

/* ── Sidebar ── */
.td-sidebar {
  width: var(--sidebar-w); min-height: 100vh; flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  position: relative; z-index: 40;
  transition: width 0.35s var(--ease);
  overflow: hidden;
}
.td-sidebar.collapsed { width: 68px; }

.sb-logo {
  height: var(--topbar-h); display: flex; align-items: center; gap: 0.75rem;
  padding: 0 1.1rem; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.sb-logo-icon {
  width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px;
  background: linear-gradient(135deg, var(--cyan), #0891b2);
  display: flex; align-items: center; justify-content: center; color: #fff;
  box-shadow: 0 0 18px var(--cyan-glow);
}
.sb-logo-icon svg { width: 18px; height: 18px; }
.sb-logo-text {
  font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 600; color: #fff;
  white-space: nowrap; transition: opacity 0.2s;
}
.td-sidebar.collapsed .sb-logo-text { opacity: 0; pointer-events: none; }

.sb-section-label {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); padding: 1.5rem 1.1rem 0.5rem; white-space: nowrap;
  transition: opacity 0.2s;
}
.td-sidebar.collapsed .sb-section-label { opacity: 0; }

.sb-nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.6rem 1.1rem; margin: 0.1rem 0.5rem;
  border-radius: 10px; cursor: pointer;
  font-size: 0.845rem; font-weight: 500; color: var(--muted2);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  white-space: nowrap; overflow: hidden; position: relative;
  text-decoration: none;
}
.sb-nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
.sb-nav-item.active {
  background: var(--cyan-dim); color: var(--cyan);
  box-shadow: inset 3px 0 0 var(--cyan);
}
.sb-nav-item.active::after {
  content: ''; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
}
.td-sidebar.collapsed .sb-nav-item.active::after { opacity: 0; }
.sb-nav-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.sb-nav-label { transition: opacity 0.2s; }
.td-sidebar.collapsed .sb-nav-label { opacity: 0; }

.sb-footer { margin-top: auto; padding: 1rem 0.5rem; border-top: 1px solid var(--border); }
.sb-collapse-btn {
  width: 100%; display: flex; align-items: center; gap: 0.75rem;
  padding: 0.6rem 0.6rem; border-radius: 8px; border: none;
  background: transparent; color: var(--muted); cursor: pointer; font-size: 0.78rem;
  font-family: 'DM Sans', sans-serif; transition: background 0.2s, color 0.2s;
}
.sb-collapse-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); }
.sb-collapse-btn svg { flex-shrink: 0; transition: transform 0.35s var(--ease); }
.td-sidebar.collapsed .sb-collapse-btn svg { transform: rotate(180deg); }

/* ── Main ── */
.td-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }

/* ── Topbar ── */
.td-topbar {
  height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 1.75rem; gap: 1rem;
  flex-shrink: 0; position: sticky; top: 0; z-index: 30;
}
.tb-search {
  display: flex; align-items: center; gap: 0.5rem;
  background: var(--surface2); border: 1px solid var(--border); border-radius: 10px;
  padding: 0.4rem 0.75rem; transition: border-color 0.2s, box-shadow 0.2s;
}
.tb-search:focus-within { border-color: var(--cyan); box-shadow: 0 0 0 3px var(--cyan-dim); }
.tb-search input { background: none; border: none; outline: none; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.8rem; width: 150px; }
.tb-search input::placeholder { color: var(--muted); }
.tb-actions { margin-left: auto; display: flex; align-items: center; gap: 0.5rem; }
.tb-icon-btn {
  width: 36px; height: 36px; border-radius: 9px; border: 1px solid var(--border);
  background: var(--surface2); color: var(--muted2); cursor: pointer;
  display: flex; align-items: center; justify-content: center; position: relative;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.tb-icon-btn:hover { background: var(--cyan-dim); color: var(--cyan); border-color: var(--cyan); }
.tb-icon-btn .dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--red); border: 1.5px solid var(--surface); box-shadow: 0 0 6px var(--red); }
.tb-avatar {
  width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
  background: linear-gradient(135deg, var(--cyan), #0891b2);
  border: 2px solid var(--cyan-dim); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em;
  transition: box-shadow 0.2s;
}
.tb-avatar:hover { box-shadow: 0 0 0 3px var(--cyan-dim), 0 0 14px var(--cyan-glow); }

/* ── Content ── */
.td-content {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1.75rem;
}
.td-content::-webkit-scrollbar { width: 4px; }
.td-content::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

/* ── Fade-up animation ── */
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
.anim { opacity: 0; transform: translateY(20px); animation: fadeUp 0.55s var(--ease) forwards; }

/* ── Hero banner ── */
.hero-banner {
  border-radius: 20px; overflow: hidden; position: relative;
  background: linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(8,145,178,0.04) 50%, rgba(52,211,153,0.04) 100%);
  border: 1px solid var(--border2);
  padding: 2rem 2.25rem;
}
.hero-banner::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
}
.hero-banner::after {
  content: ''; position: absolute; top: -60px; right: -40px;
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%);
  pointer-events: none;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 0.45rem;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--cyan);
  background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.22);
  border-radius: 100px; padding: 0.22rem 0.75rem;
  margin-bottom: 0.9rem;
}
.hero-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 6px var(--cyan); animation: heroPulse 2s ease-in-out infinite; }
@keyframes heroPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
.hero-title {
  font-family: 'Fraunces', serif; font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  font-weight: 600; color: #fff; line-height: 1.1; letter-spacing: -0.025em;
  max-width: 560px;
}
.hero-title em { font-style: italic; color: var(--cyan); }
.hero-desc { margin-top: 0.6rem; font-size: 0.875rem; color: var(--muted2); max-width: 500px; line-height: 1.65; }
.hero-actions { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.65rem; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 0.45rem;
  background: var(--cyan); color: #040810;
  padding: 0.6rem 1.3rem; border-radius: 10px;
  font-weight: 700; font-size: 0.82rem; text-decoration: none;
  box-shadow: 0 6px 20px var(--cyan-glow);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.btn-primary::before { content: ''; position: absolute; top:0; left:-75%; width:50%; height:100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transform:skewX(-15deg); }
.btn-primary:hover::before { animation: shimmer 0.55s ease forwards; }
@keyframes shimmer { to { left:150%; } }
.btn-primary:hover { background: #67e8f9; transform: translateY(-1px); box-shadow: 0 10px 28px var(--cyan-glow); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.45rem;
  background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.3);
  color: var(--cyan); padding: 0.6rem 1.3rem; border-radius: 10px;
  font-weight: 600; font-size: 0.82rem; text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.btn-ghost:hover { background: rgba(34,211,238,0.18); border-color: var(--cyan); transform: translateY(-1px); }

/* ── Metric cards ── */
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.metric-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.25rem 1.35rem; position: relative; overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  cursor: default;
}
.metric-card:hover { border-color: var(--mc-color); box-shadow: 0 0 28px color-mix(in srgb, var(--mc-color) 18%, transparent), 0 8px 24px rgba(0,0,0,0.3); transform: translateY(-2px); }
.metric-card::before { content: ''; position: absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, var(--mc-color), transparent); opacity:0; transition: opacity 0.3s; }
.metric-card:hover::before { opacity: 1; }
.mc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; }
.mc-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.mc-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; background: color-mix(in srgb, var(--mc-color) 12%, transparent); border: 1px solid color-mix(in srgb, var(--mc-color) 22%, transparent); }
.mc-value { font-family: 'Fraunces', serif; font-size: 2.1rem; font-weight: 600; color: #fff; line-height: 1; }
.mc-helper { margin-top: 0.35rem; font-size: 0.72rem; color: var(--muted); }
.mc-shimmer { height: 2.1rem; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.08), rgba(255,255,255,0.05)); background-size: 200% 100%; border-radius: 8px; animation: skeleton 1.4s ease-in-out infinite; }
@keyframes skeleton { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

/* ── Two-col layout ── */
.two-col { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.25rem; align-items: start; }
@media (max-width: 960px) { .two-col { grid-template-columns: 1fr; } }

/* ── Section card ── */
.sc {
  background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
  overflow: hidden;
}
.sc-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.sc-eyebrow { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cyan); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem; }
.sc-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 6px var(--cyan); animation: heroPulse 2.5s ease-in-out infinite; }
.sc-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: #fff; }
.sc-desc { font-size: 0.78rem; color: var(--muted2); margin-top: 0.2rem; line-height: 1.5; }
.sc-badge { display: inline-block; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.18rem 0.55rem; border-radius: 100px; background: rgba(34,211,238,0.12); color: var(--cyan); border: 1px solid rgba(34,211,238,0.25); margin-top: 0.5rem; }
.sc-body { padding: 1.25rem 1.5rem; }

/* ── Student roster ── */
.roster-list { margin-top: 0.75rem; border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
.roster-item {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.roster-item:last-child { border-bottom: none; }
.roster-item:hover { background: rgba(34,211,238,0.03); }
.roster-avatar {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.15));
  border: 1px solid rgba(34,211,238,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; color: var(--cyan);
}
.roster-info { flex: 1; min-width: 0; }
.roster-name { font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.roster-meta { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.roster-pills { display: flex; gap: 0.4rem; flex-shrink: 0; }
.pill {
  font-size: 0.68rem; font-weight: 600; padding: 0.18rem 0.5rem;
  border-radius: 100px;
}
.pill-grade { background: rgba(52,211,153,0.1); color: var(--emerald); border: 1px solid rgba(52,211,153,0.2); }
.pill-att   { background: rgba(251,191,36,0.1); color: var(--amber); border: 1px solid rgba(251,191,36,0.2); }
.roster-view-btn {
  font-size: 0.72rem; font-weight: 600; color: var(--cyan);
  background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.22);
  border-radius: 8px; padding: 0.3rem 0.7rem; text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.roster-view-btn:hover { background: rgba(34,211,238,0.18); border-color: var(--cyan); }

/* ── Skeleton rows ── */
.skel-row { height: 58px; border-radius: 12px; background: var(--surface2); animation: skeleton 1.4s ease-in-out infinite; margin-bottom: 0.5rem; }

/* ── Error banner ── */
.error-banner {
  border-radius: 12px; border: 1px solid rgba(248,113,113,0.25);
  background: rgba(248,113,113,0.07);
  padding: 0.85rem 1.1rem; font-size: 0.82rem; color: var(--red);
  display: flex; align-items: center; gap: 0.6rem;
}
.retry-btn {
  margin-left: auto; flex-shrink: 0;
  font-size: 0.75rem; font-weight: 600; color: var(--cyan);
  background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.25);
  border-radius: 8px; padding: 0.3rem 0.75rem; cursor: pointer;
  transition: background 0.2s;
}
.retry-btn:hover { background: rgba(34,211,238,0.18); }

/* ── Empty state ── */
.empty-state { padding: 2.5rem 1.5rem; text-align: center; }
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5; }
.empty-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 600; color: var(--text); }
.empty-sub { font-size: 0.8rem; color: var(--muted); margin-top: 0.4rem; line-height: 1.55; }

/* ── Quick actions ── */
.action-btn {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem; border-radius: 12px;
  background: var(--surface2); border: 1px solid var(--border);
  text-decoration: none; color: var(--text);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.action-btn:hover { background: var(--cyan-dim); border-color: rgba(34,211,238,0.3); transform: translateY(-1px); }
.action-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.2); font-size: 1.1rem; }
.action-title { font-size: 0.83rem; font-weight: 600; color: #fff; }
.action-sub { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }
.action-arrow { margin-left: auto; color: var(--muted); font-size: 0.9rem; transition: transform 0.2s; }
.action-btn:hover .action-arrow { transform: translateX(3px); color: var(--cyan); }

/* ── Focus tips ── */
.focus-tip {
  display: flex; gap: 0.75rem; padding: 0.9rem 1rem;
  border-radius: 12px; background: var(--surface2); border: 1px solid var(--border);
  transition: border-color 0.2s;
}
.focus-tip:hover { border-color: rgba(34,211,238,0.2); }
.focus-tip-num { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; background: var(--cyan-dim); border: 1px solid rgba(34,211,238,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--cyan); margin-top: 1px; }
.focus-tip-title { font-size: 0.8rem; font-weight: 600; color: #fff; }
.focus-tip-text { font-size: 0.72rem; color: var(--muted); margin-top: 2px; line-height: 1.45; }

/* ── Bottom stat row ── */
.stat-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 1rem; }
.stat-tile { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 1.1rem 1.25rem; transition: border-color 0.2s; }
.stat-tile:hover { border-color: rgba(34,211,238,0.2); }
.stat-tile-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.stat-tile-value { font-family: 'Fraunces', serif; font-size: 1.9rem; font-weight: 600; color: #fff; margin-top: 0.3rem; }

/* ── Pattern cards ── */
.pattern-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; }
.pattern-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 1.1rem 1.25rem; transition: border-color 0.2s, transform 0.2s; }
.pattern-card:hover { border-color: rgba(34,211,238,0.2); transform: translateY(-2px); }
.pc-eyebrow { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cyan); margin-bottom: 0.4rem; }
.pc-title { font-size: 0.85rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; }
.pc-items { display: flex; flex-direction: column; gap: 0.35rem; }
.pc-item { font-size: 0.74rem; color: var(--muted2); display: flex; gap: 0.4rem; }
.pc-item::before { content: '—'; color: var(--muted); flex-shrink: 0; }

/* ── Info note ── */
.info-note { font-size: 0.72rem; color: var(--muted); padding: 0.6rem 0.85rem; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); margin-top: 0.75rem; }

/* ── Dropdown ── */
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: var(--surface2); border: 1px solid var(--border2); border-radius: 14px; padding: 0.5rem; min-width: 170px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); z-index: 100; animation: dropIn 0.25s var(--ease); }
@keyframes dropIn { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.dd-item { display: flex; align-items: center; gap: 0.55rem; padding: 0.5rem 0.7rem; border-radius: 9px; cursor: pointer; font-size: 0.8rem; color: var(--muted2); transition: background 0.15s, color 0.15s; text-decoration: none; }
.dd-item:hover { background: var(--cyan-dim); color: var(--cyan); }
.dd-item.danger:hover { background: rgba(248,113,113,0.1); color: var(--red); }
.dd-divider { height: 1px; background: var(--border); margin: 0.3rem 0; }
`;

/* ─── NAV ITEMS ───────────────────────────────────────────────────────── */
const NAV = [
  { label: "Overview",    icon: "⊞", to: PATHS.TEACHER },
  { label: "Students",    icon: "👥", to: PATHS.TEACHER_STUDENTS },
  { label: "Assignments", icon: "📋", to: PATHS.TEACHER_ASSIGNMENTS },
  { label: "Grades",      icon: "📊", to: PATHS.TEACHER_GRADES },
  { label: "Attendance",  icon: "✅", to: PATHS.TEACHER_ATTENDANCE },
  { label: "Messages",    icon: "💬", to: PATHS.MESSAGES },
  { label: "AI Insights", icon: "🤖", to: PATHS.TEACHER_AI_INSIGHTS },
  { label: "Schedule",    icon: "🗓️", to: PATHS.TEACHER_SCHEDULE },
];

/* ─── UTILS ───────────────────────────────────────────────────────────── */
const initials = (str = "") =>
  str.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "T";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

/* ─── SUB-COMPONENTS ──────────────────────────────────────────────────── */

function MetricCard({ label, value, helper, icon, color, loading, delay }) {
  return (
    <div className="metric-card anim" style={{ "--mc-color": color, animationDelay: delay }}>
      <div className="mc-top">
        <div className="mc-label">{label}</div>
        <div className="mc-icon">{icon}</div>
      </div>
      {loading ? (
        <div className="mc-shimmer" style={{ width: "60%" }} />
      ) : (
        <div className="mc-value">{value}</div>
      )}
      <div className="mc-helper">{helper}</div>
    </div>
  );
}

function SectionCard({ eyebrow, title, desc, badge, children, delay = "0s" }) {
  return (
    <div className="sc anim" style={{ animationDelay: delay }}>
      <div className="sc-header">
        <div className="sc-eyebrow"><span className="sc-eyebrow-dot" />{eyebrow}</div>
        <div className="sc-title">{title}</div>
        {desc && <div className="sc-desc">{desc}</div>}
        {badge && <div className="sc-badge">{badge}</div>}
      </div>
      <div className="sc-body">{children}</div>
    </div>
  );
}

function FocusTip({ num, title, text }) {
  return (
    <div className="focus-tip">
      <div className="focus-tip-num">{num}</div>
      <div>
        <div className="focus-tip-title">{title}</div>
        <div className="focus-tip-text">{text}</div>
      </div>
    </div>
  );
}

function PatternCard({ eyebrow, title, items }) {
  return (
    <div className="pattern-card">
      <div className="pc-eyebrow">{eyebrow}</div>
      <div className="pc-title">{title}</div>
      <div className="pc-items">
        {items.map((t) => <div className="pc-item" key={t}>{t}</div>)}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */
function TeacherDashboard() {
  const { user, logout } = useAuth();

  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [summary, setSummary]     = useState({ totalStudents: 0, averageGrade: "—", averageAttendance: "—" });
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const loadStudents = async (mountRef) => {
    setLoading(true); setError("");
    try {
      const data = await getStudents();
      if (mountRef && !mountRef.current) return;
      const list = Array.isArray(data?.students) ? data.students : Array.isArray(data) ? data : [];
      const s = data?.summary || {};
      setStudents(list);
      setSummary({ totalStudents: s.totalStudents ?? list.length, averageGrade: s.averageGrade ?? "—", averageAttendance: s.averageAttendance ?? "—" });
    } catch (err) {
      if (mountRef && !mountRef.current) return;
      setStudents([]);
      setSummary({ totalStudents: 0, averageGrade: "—", averageAttendance: "—" });
      setError(err?.message || "Failed to load students.");
    } finally {
      if (!mountRef || mountRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const ref = { current: true };
    loadStudents(ref);
    return () => { ref.current = false; };
  }, []);

  const studentRows = useMemo(() =>
    students.map((s, i) => ({
      id: s.id ?? i,
      name: s.fullName || s.name || "Unnamed",
      grade: s.grade || s.latestGrade || "—",
      attendance: s.attendance || s.attendanceRate || "—",
    })), [students]);

  const topStudents = useMemo(() => studentRows.slice(0, 6), [studentRows]);
  const isEmpty = !loading && studentRows.length === 0;
  const hi = initials(user?.fullName || user?.email);

  return (
    <>
      <style>{CSS}</style>
      <div className="td-root" onClick={() => setProfileOpen(false)}>

        {/* ── SIDEBAR ── */}
        <aside className={`td-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="sb-logo-text">EduPortal</span>
          </div>

          <span className="sb-section-label">Navigation</span>

          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `sb-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sb-nav-icon">{item.icon}</span>
              <span className="sb-nav-label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sb-footer">
            <button className="sb-collapse-btn" onClick={() => setCollapsed((p) => !p)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span className="sb-nav-label" style={{ fontSize: "0.78rem" }}>Collapse</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="td-main">

          {/* Topbar */}
          <header className="td-topbar">
            <div className="tb-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input placeholder="Search students…" />
            </div>

            <div className="tb-actions">
              {/* Notifications */}
              <button className="tb-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="dot" />
              </button>

              {/* Profile */}
              <div style={{ position: "relative" }}>
                <button
                  className="tb-avatar"
                  onClick={(e) => { e.stopPropagation(); setProfileOpen((p) => !p); }}
                >
                  {hi}
                </button>
                {profileOpen && (
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: "0.6rem 0.75rem 0.45rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className="tb-avatar" style={{ pointerEvents: "none", width: 30, height: 30, fontSize: "0.62rem" }}>{hi}</div>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>{user?.fullName || "Teacher"}</div>
                        <div style={{ fontSize: "0.69rem", color: "var(--muted)" }}>TEACHER</div>
                      </div>
                    </div>
                    <div className="dd-divider" />
                    <a href="#" className="dd-item">⚙️ &nbsp;Settings</a>
                    <a href="#" className="dd-item">👤 &nbsp;Profile</a>
                    <div className="dd-divider" />
                    <div className="dd-item danger" onClick={logout}>🚪 &nbsp;Sign out</div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <div className="td-content">

            {/* ── Hero ── */}
            <div className="hero-banner anim" style={{ animationDelay: "0.05s" }}>
              <div className="hero-eyebrow"><span className="hero-dot" />Teacher Portal</div>
              <h1 className="hero-title">
                {greeting()},&nbsp;
                <em>{user?.fullName?.split(" ")[0] || user?.email || "Teacher"}</em>
              </h1>
              <p className="hero-desc">
                Monitor class performance, attendance trends, and parent communication from your focused teaching workspace.
              </p>
              <div className="hero-actions">
                <RoleGate allowedRoles={["TEACHER"]}>
                  <Link to={PATHS.TEACHER_AI_INSIGHTS} className="btn-primary">
                    View AI Insights
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </RoleGate>
                <RoleGate allowedRoles={["TEACHER"]}>
                  <Link to={PATHS.MESSAGES} className="btn-ghost">Open Messages</Link>
                </RoleGate>
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="error-banner anim" style={{ animationDelay: "0.1s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
                <button className="retry-btn" onClick={() => loadStudents()}>Retry</button>
              </div>
            )}

            {/* ── Metrics ── */}
            <div className="metrics-grid">
              <MetricCard label="Total Students" value={summary.totalStudents} helper="Current class roster" icon="👥" color="var(--cyan)"    loading={loading} delay="0.15s" />
              <MetricCard label="Average Grade"  value={summary.averageGrade}  helper="Latest academic snapshot" icon="📊" color="var(--emerald)" loading={loading} delay="0.22s" />
              <MetricCard label="Attendance"     value={summary.averageAttendance} helper="Overall class presence" icon="✅" color="var(--amber)"   loading={loading} delay="0.29s" />
            </div>

            {/* ── Two-col ── */}
            <div className="two-col">
              {/* Students roster */}
              <SectionCard
                eyebrow="Roster"
                title="Students Snapshot"
                desc="Review your latest roster and jump into student detail pages."
                badge={error ? "Data Issue" : "Live"}
                delay="0.35s"
              >
                {loading ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    {[1,2,3].map((i) => <div key={i} className="skel-row" />)}
                  </div>
                ) : isEmpty ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎒</div>
                    <div className="empty-title">{error ? "Unable to load roster" : "No students yet"}</div>
                    <div className="empty-sub">{error ? "The students service is temporarily unavailable." : "No student records were returned for your account."}</div>
                    {error && (
                      <button onClick={() => loadStudents()} style={{ marginTop: "1rem", padding: "0.45rem 1rem", borderRadius: 9, background: "var(--cyan-dim)", border: "1px solid rgba(34,211,238,0.25)", color: "var(--cyan)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                        Retry Load
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="roster-list">
                      {topStudents.map((s) => (
                        <div className="roster-item" key={s.id}>
                          <div className="roster-avatar">{initials(s.name)}</div>
                          <div className="roster-info">
                            <div className="roster-name">{s.name}</div>
                            <div className="roster-meta">Grade {s.grade} · Attendance {s.attendance}</div>
                          </div>
                          <div className="roster-pills">
                            <span className="pill pill-grade">{s.grade}</span>
                            <span className="pill pill-att">{s.attendance}</span>
                          </div>
                          <Link to={PATHS.TEACHER_STUDENTS_DETAIL(s.id)} className="roster-view-btn">View →</Link>
                        </div>
                      ))}
                    </div>
                    {studentRows.length > topStudents.length && (
                      <div className="info-note">
                        Showing {topStudents.length} of {studentRows.length} students.
                      </div>
                    )}
                  </>
                )}
              </SectionCard>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Quick actions */}
                <SectionCard eyebrow="Actions" title="Quick Actions" desc="Jump into your most-used workflows." delay="0.4s">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {[
                      { to: PATHS.MESSAGES, icon: "💬", title: "Open Messages",    sub: "Reply to parents and students" },
                      { to: PATHS.TEACHER_AI_INSIGHTS, icon: "🤖", title: "AI Insights",      sub: "Review performance suggestions" },
                      { to: PATHS.TEACHER_GRADES,      icon: "📊", title: "Grade Book",      sub: "Enter and manage marks" },
                      { to: PATHS.TEACHER_ATTENDANCE,  icon: "✅", title: "Attendance",      sub: "Mark and review presence" },
                    ].map((a) => (
                      <Link key={a.to} to={a.to} className="action-btn">
                        <div className="action-icon">{a.icon}</div>
                        <div>
                          <div className="action-title">{a.title}</div>
                          <div className="action-sub">{a.sub}</div>
                        </div>
                        <span className="action-arrow">→</span>
                      </Link>
                    ))}
                  </div>
                </SectionCard>

                {/* Focus tips */}
                <SectionCard eyebrow="Focus" title="Today's Priorities" desc="Keep daily tasks visible and actionable." delay="0.45s">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    <FocusTip num="1" title="Attendance Follow-up" text="Review late and absent students first." />
                    <FocusTip num="2" title="Parent Communication" text="Send updates for at-risk students." />
                    <FocusTip num="3" title="Assessment Review" text="Track trends before the next class." />
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* ── Pattern cards ── */}
            <SectionCard eyebrow="Workspace" title="Dashboard Modules" desc="Reusable content patterns for each teaching area." delay="0.5s">
              <div className="pattern-grid" style={{ marginTop: "0.75rem" }}>
                <PatternCard
                  eyebrow="Attendance"
                  title="Attendance Pattern"
                  items={["Present, absent, and late counts", "Attendance rate by class", "Filterable by date range"]}
                />
                <PatternCard
                  eyebrow="Grades"
                  title="Grades Pattern"
                  items={["Average grade, top performers", "Pending grading queue", "Subject drill-down view"]}
                />
                <PatternCard
                  eyebrow="Messages"
                  title="Messages Pattern"
                  items={["Unread & flagged threads", "Quick-reply shortcuts", "Parent contact directory"]}
                />
              </div>
            </SectionCard>

            {/* ── Class Schedule ── */}
            <SectionCard
              eyebrow="Schedule"
              title="Today's Classes"
              desc="Review your scheduled sessions and upcoming lessons."
              delay="0.52s"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "0.75rem" }}>
                {[
                  { time: "09:00 AM", class: "Mathematics - Grade 10A", room: "Room 201", students: 28 },
                  { time: "10:45 AM", class: "Mathematics - Grade 10B", room: "Room 202", students: 32 },
                  { time: "01:00 PM", class: "Advanced Calculus - Grade 12", room: "Lab 101", students: 22 },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "0.85rem 1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--cyan)" }}>{s.time}</div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff", marginTop: "0.3rem" }}>{s.class}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.2rem" }}>{s.room} • {s.students} students</div>
                    </div>
                    <button style={{ padding: "0.4rem 0.8rem", borderRadius: 8, background: "var(--cyan-dim)", border: "1px solid rgba(34,211,238,0.2)", color: "var(--cyan)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                      Mark Attendance
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Pending Assignments ── */}
            <SectionCard
              eyebrow="Grading"
              title="Pending Assignments"
              desc="Track assignments awaiting your review and marks."
              delay="0.57s"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "0.75rem" }}>
                {[
                  { title: "Physics Project: Solar System", submitted: 24, pending: 4, dueDate: "2024-04-08" },
                  { title: "Chemistry Lab Report", submitted: 28, pending: 2, dueDate: "2024-04-010" },
                  { title: "Biology Research Essay", submitted: 18, pending: 10, dueDate: "2024-04-15" },
                ].map((a, i) => (
                  <div key={i} style={{ padding: "0.85rem 1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff" }}>{a.title}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.4rem" }}>
                          {a.submitted} submitted • <span style={{ color: a.pending > 0 ? "var(--amber)" : "var(--emerald)" }}>{a.pending} pending</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)" }}>Due: {a.dueDate}</div>
                        <div style={{ fontSize: "0.75rem", color: a.pending > 0 ? "var(--amber)" : "var(--emerald)", marginTop: "0.3rem", fontWeight: 600 }}>
                          {a.pending > 0 ? `${a.pending} awaiting` : "All done"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Recent Activity ── */}
            <div className="two-col">
              <SectionCard
                eyebrow="Activity"
                title="Recent Activity"
                desc="Track latest updates and interactions from your students."
                delay="0.62s"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
                  {[
                    { icon: "📝", action: "Student submitted assignment", student: "John Doe", time: "2 hours ago" },
                    { icon: "💬", action: "Parent message received", student: "Sarah's Parent", time: "5 hours ago" },
                    { icon: "⚠️", action: "Low attendance alert", student: "Mike Johnson", time: "1 day ago" },
                    { icon: "⭐", action: "Quiz result recorded", student: "Emma Smith", time: "1 day ago" },
                  ].map((a, i) => (
                    <div key={i} style={{ padding: "0.7rem 0.9rem", borderRadius: 10, background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.08)", display: "flex", gap: "0.7rem", alignItems: "center" }}>
                      <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#fff" }}>{a.action}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "2px" }}>{a.student} • {a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Class Performance Summary */}
              <SectionCard
                eyebrow="Analytics"
                title="Class Performance"
                desc="Quick overview of class metrics this term."
                delay="0.67s"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginTop: "0.75rem" }}>
                  {[
                    { label: "Class Average", value: "78.5%", color: "var(--emerald)", width: "78%" },
                    { label: "Attendance Rate", value: "94.2%", color: "var(--cyan)", width: "94%" },
                    { label: "Assignment Completion", value: "87.3%", color: "var(--amber)", width: "87%" },
                  ].map((p, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <div style={{ fontSize: "0.77rem", fontWeight: 600, color: "var(--muted)" }}>{p.label}</div>
                        <div style={{ fontSize: "0.77rem", fontWeight: 700, color: p.color }}>{p.value}</div>
                      </div>
                      <div style={{ height: "6px", background: "var(--surface2)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", background: p.color, width: p.width, transition: "width 0.4s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* ── Communication Hub ── */}
            <SectionCard
              eyebrow="Communication"
              title="Parent Engagement"
              desc="Manage outreach and stay connected with guardians."
              delay="0.72s"
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "0.75rem" }}>
                {[
                  { label: "Unread Messages", count: 3, icon: "💬", color: "var(--cyan)" },
                  { label: "Requires Response", count: 2, icon: "⏳", color: "var(--amber)" },
                  { label: "Pending Meetings", count: 1, icon: "📅", color: "var(--emerald)" },
                ].map((c, i) => (
                  <div key={i} style={{ padding: "1rem", borderRadius: 14, background: "var(--surface2)", border: "1px solid var(--border)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{c.icon}</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.count}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem" }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Resource Library ── */}
            <SectionCard
              eyebrow="Resources"
              title="Teaching Resources"
              desc="Quick access to lesson plans, templates, and tools."
              delay="0.77s"
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.9rem", marginTop: "0.75rem" }}>
                {[
                  { name: "Lesson Plans", icon: "📚", count: 12 },
                  { name: "Quiz Bank", icon: "❓", count: 45 },
                  { name: "Rubrics", icon: "✓", count: 8 },
                  { name: "Handouts", icon: "📄", count: 23 },
                  { name: "Videos", icon: "🎬", count: 34 },
                  { name: "Templates", icon: "📋", count: 16 },
                ].map((r, i) => (
                  <div key={i} style={{ padding: "0.9rem 1rem", borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{r.icon}</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>{r.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.3rem" }}>{r.count} items</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Stat row ── */}
            <SectionCard
              eyebrow="Workspace"
              title="Teacher Workspace"
              desc={`Welcome, ${user?.fullName || user?.email}. Review classes, monitor attendance, and share updates with parents.`}
              delay="0.82s"
            >
              <div className="stat-row" style={{ marginTop: "0.75rem" }}>
                <div className="stat-tile">
                  <div className="stat-tile-label">Students Loaded</div>
                  <div className="stat-tile-value">{studentRows.length}</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile-label">Average Grade</div>
                  <div className="stat-tile-value">{summary.averageGrade}</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile-label">Avg Attendance</div>
                  <div className="stat-tile-value">{summary.averageAttendance}</div>
                </div>
              </div>
            </SectionCard>

          </div>{/* /content */}
        </div>{/* /main */}
      </div>
    </>
  );
}

export default TeacherDashboard;