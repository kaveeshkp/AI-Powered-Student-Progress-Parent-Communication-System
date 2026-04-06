import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getClassInsights } from "../../services/aiService";
import RoleGate from "../../routes/RoleGate";

/* ─────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #040810;
  --surface:   #080e1a;
  --surface2:  #0d1526;
  --surface3:  #111d30;
  --border:    rgba(255,255,255,0.07);
  --border-c:  rgba(34,211,238,0.18);
  --text:      #dde4f0;
  --muted:     #5a6480;
  --muted2:    #8892aa;
  --cyan:      #22d3ee;
  --cyan-dim:  rgba(34,211,238,0.1);
  --cyan-glow: rgba(34,211,238,0.22);
  --emerald:   #34d399;
  --emerald-dim:rgba(52,211,153,0.1);
  --amber:     #fbbf24;
  --amber-dim: rgba(251,191,36,0.1);
  --red:       #f87171;
  --ease:      cubic-bezier(0.16,1,0.3,1);
  --sidebar-w: 248px;
  --topbar-h:  64px;
}

/* ── Root layout ── */
.ai-root { font-family:'DM Sans',sans-serif; background:var(--bg); min-height:100vh; color:var(--text); display:flex; overflow:hidden; }

/* ── Sidebar ── */
.ai-sidebar { width:var(--sidebar-w); min-height:100vh; flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; position:relative; z-index:40; transition:width 0.35s var(--ease); overflow:hidden; }
.ai-sidebar.collapsed { width:68px; }
.sb-logo { height:var(--topbar-h); display:flex; align-items:center; gap:0.75rem; padding:0 1.1rem; border-bottom:1px solid var(--border); flex-shrink:0; }
.sb-logo-icon { width:36px; height:36px; flex-shrink:0; border-radius:10px; background:linear-gradient(135deg,var(--cyan),#0891b2); display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 0 18px var(--cyan-glow); }
.sb-logo-icon svg { width:18px; height:18px; }
.sb-logo-text { font-family:'Fraunces',serif; font-size:1.15rem; font-weight:600; color:#fff; white-space:nowrap; transition:opacity 0.2s; }
.ai-sidebar.collapsed .sb-logo-text { opacity:0; pointer-events:none; }
.sb-section-label { font-size:0.62rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted); padding:1.5rem 1.1rem 0.5rem; white-space:nowrap; transition:opacity 0.2s; }
.ai-sidebar.collapsed .sb-section-label { opacity:0; }
.sb-nav-item { display:flex; align-items:center; gap:0.75rem; padding:0.6rem 1.1rem; margin:0.1rem 0.5rem; border-radius:10px; cursor:pointer; font-size:0.845rem; font-weight:500; color:var(--muted2); transition:background 0.2s,color 0.2s,box-shadow 0.2s; white-space:nowrap; overflow:hidden; position:relative; text-decoration:none; }
.sb-nav-item:hover { background:rgba(255,255,255,0.04); color:var(--text); }
.sb-nav-item.active { background:var(--cyan-dim); color:var(--cyan); box-shadow:inset 3px 0 0 var(--cyan); }
.sb-nav-item.active::after { content:''; position:absolute; right:10px; top:50%; transform:translateY(-50%); width:6px; height:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 8px var(--cyan); }
.ai-sidebar.collapsed .sb-nav-item.active::after { opacity:0; }
.sb-nav-icon { width:18px; height:18px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.sb-nav-label { transition:opacity 0.2s; }
.ai-sidebar.collapsed .sb-nav-label { opacity:0; }
.sb-footer { margin-top:auto; padding:1rem 0.5rem; border-top:1px solid var(--border); }
.sb-collapse-btn { width:100%; display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.6rem; border-radius:8px; border:none; background:transparent; color:var(--muted); cursor:pointer; font-size:0.78rem; font-family:'DM Sans',sans-serif; transition:background 0.2s,color 0.2s; }
.sb-collapse-btn:hover { background:rgba(255,255,255,0.04); color:var(--text); }
.sb-collapse-btn svg { flex-shrink:0; transition:transform 0.35s var(--ease); }
.ai-sidebar.collapsed .sb-collapse-btn svg { transform:rotate(180deg); }

/* ── Main ── */
.ai-main { flex:1; min-width:0; display:flex; flex-direction:column; overflow:hidden; }

/* ── Topbar ── */
.ai-topbar { height:var(--topbar-h); background:var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 1.75rem; gap:1rem; flex-shrink:0; position:sticky; top:0; z-index:30; }
.tb-search { display:flex; align-items:center; gap:0.5rem; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:0.4rem 0.75rem; transition:border-color 0.2s,box-shadow 0.2s; }
.tb-search:focus-within { border-color:var(--cyan); box-shadow:0 0 0 3px var(--cyan-dim); }
.tb-search input { background:none; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-size:0.8rem; width:150px; }
.tb-search input::placeholder { color:var(--muted); }
.tb-actions { margin-left:auto; display:flex; align-items:center; gap:0.5rem; }
.tb-icon-btn { width:36px; height:36px; border-radius:9px; border:1px solid var(--border); background:var(--surface2); color:var(--muted2); cursor:pointer; display:flex; align-items:center; justify-content:center; position:relative; transition:background 0.2s,color 0.2s,border-color 0.2s; }
.tb-icon-btn:hover { background:var(--cyan-dim); color:var(--cyan); border-color:var(--cyan); }
.tb-icon-btn .notif-dot { position:absolute; top:6px; right:6px; width:7px; height:7px; border-radius:50%; background:var(--red); border:1.5px solid var(--surface); box-shadow:0 0 6px var(--red); }
.tb-avatar { width:36px; height:36px; border-radius:50%; cursor:pointer; background:linear-gradient(135deg,var(--cyan),#0891b2); border:2px solid var(--cyan-dim); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; transition:box-shadow 0.2s; }
.tb-avatar:hover { box-shadow:0 0 0 3px var(--cyan-dim),0 0 14px var(--cyan-glow); }
.dropdown { position:absolute; top:calc(100% + 10px); right:0; background:var(--surface2); border:1px solid var(--border-c); border-radius:14px; padding:0.5rem; min-width:170px; box-shadow:0 20px 60px rgba(0,0,0,0.5); z-index:100; animation:dropIn 0.25s var(--ease); }
@keyframes dropIn { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.dd-item { display:flex; align-items:center; gap:0.55rem; padding:0.5rem 0.7rem; border-radius:9px; cursor:pointer; font-size:0.8rem; color:var(--muted2); transition:background 0.15s,color 0.15s; text-decoration:none; }
.dd-item:hover { background:var(--cyan-dim); color:var(--cyan); }
.dd-item.danger:hover { background:rgba(248,113,113,0.1); color:var(--red); }
.dd-divider { height:1px; background:var(--border); margin:0.3rem 0; }

/* ── Content ── */
.ai-content { flex:1; overflow-y:auto; overflow-x:hidden; padding:2rem 1.75rem; display:flex; flex-direction:column; gap:1.75rem; }
.ai-content::-webkit-scrollbar { width:4px; }
.ai-content::-webkit-scrollbar-thumb { background:var(--border-c); border-radius:99px; }

/* ── Fade-up ── */
@keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
.anim { opacity:0; transform:translateY(20px); animation:fadeUp 0.55s var(--ease) forwards; }

/* ── Hero banner ── */
.hero-banner { border-radius:20px; overflow:hidden; position:relative; background:linear-gradient(135deg,rgba(34,211,238,0.07),rgba(8,145,178,0.04) 50%,rgba(99,102,241,0.04)); border:1px solid var(--border-c); padding:2rem 2.25rem; }
.hero-banner::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--cyan),transparent); }
.hero-glow { position:absolute; top:-50px; right:-30px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.1),transparent 70%); pointer-events:none; }
.hero-glow-2 { position:absolute; bottom:-40px; left:10%; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%); pointer-events:none; }
.hero-eyebrow { display:inline-flex; align-items:center; gap:0.45rem; font-size:0.65rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:var(--cyan); background:var(--cyan-dim); border:1px solid rgba(34,211,238,0.22); border-radius:100px; padding:0.22rem 0.75rem; margin-bottom:0.9rem; }
.hero-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); box-shadow:0 0 6px var(--cyan); animation:heroPulse 2s ease-in-out infinite; }
@keyframes heroPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
.hero-title { font-family:'Fraunces',serif; font-size:clamp(1.5rem,2.8vw,2.1rem); font-weight:600; color:#fff; line-height:1.1; letter-spacing:-0.025em; }
.hero-title em { font-style:italic; color:var(--cyan); }
.hero-desc { margin-top:0.55rem; font-size:0.875rem; color:var(--muted2); max-width:520px; line-height:1.65; }

/* hero stats strip */
.hero-stats { display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:1.5rem; }
.hero-stat { display:flex; flex-direction:column; gap:0.15rem; }
.hero-stat-val { font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600; color:#fff; line-height:1; }
.hero-stat-label { font-size:0.68rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.1em; font-weight:600; }

/* hero actions */
.hero-actions { display:flex; flex-wrap:wrap; gap:0.65rem; margin-top:1.5rem; align-items:center; }
.btn-primary { display:inline-flex; align-items:center; gap:0.45rem; background:var(--cyan); color:#040810; padding:0.65rem 1.4rem; border-radius:10px; font-weight:700; font-size:0.82rem; border:none; cursor:pointer; box-shadow:0 6px 20px var(--cyan-glow); transition:background 0.2s,transform 0.2s,box-shadow 0.2s; position:relative; overflow:hidden; font-family:'DM Sans',sans-serif; }
.btn-primary::before { content:''; position:absolute; top:0; left:-75%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transform:skewX(-15deg); }
.btn-primary:hover::before { animation:shimmer 0.55s ease forwards; }
@keyframes shimmer { to { left:150%; } }
.btn-primary:hover { background:#67e8f9; transform:translateY(-1px); box-shadow:0 10px 28px var(--cyan-glow); }
.btn-primary:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
.btn-ghost { display:inline-flex; align-items:center; gap:0.45rem; background:var(--cyan-dim); border:1px solid rgba(34,211,238,0.3); color:var(--cyan); padding:0.65rem 1.4rem; border-radius:10px; font-weight:600; font-size:0.82rem; text-decoration:none; transition:background 0.2s,border-color 0.2s,transform 0.2s; }
.btn-ghost:hover { background:rgba(34,211,238,0.18); border-color:var(--cyan); transform:translateY(-1px); }

/* ── Error banner ── */
.error-banner { border-radius:12px; border:1px solid rgba(248,113,113,0.25); background:rgba(248,113,113,0.07); padding:0.85rem 1.1rem; font-size:0.82rem; color:var(--red); display:flex; align-items:center; gap:0.6rem; }
.retry-btn { margin-left:auto; flex-shrink:0; font-size:0.75rem; font-weight:600; color:var(--cyan); background:var(--cyan-dim); border:1px solid rgba(34,211,238,0.25); border-radius:8px; padding:0.3rem 0.75rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.2s; }
.retry-btn:hover { background:rgba(34,211,238,0.18); }

/* ── Generate state banner ── */
.gen-banner { border-radius:16px; border:1px solid rgba(34,211,238,0.2); background:rgba(34,211,238,0.04); padding:1.25rem 1.5rem; display:flex; align-items:center; gap:1rem; }
.gen-spinner { width:36px; height:36px; border-radius:50%; border:2px solid rgba(34,211,238,0.2); border-top-color:var(--cyan); animation:spin 0.8s linear infinite; flex-shrink:0; box-shadow:0 0 14px var(--cyan-glow); }
@keyframes spin { to { transform:rotate(360deg); } }
.gen-title { font-family:'Fraunces',serif; font-size:0.95rem; font-weight:600; color:#fff; }
.gen-sub { font-size:0.76rem; color:var(--muted2); margin-top:0.2rem; }

/* ── Empty state ── */
.empty-root { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:4rem 1.5rem; text-align:center; }
.empty-orb { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,rgba(34,211,238,0.1),rgba(99,102,241,0.08)); border:1px solid rgba(34,211,238,0.18); display:flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:1.5rem; box-shadow:0 0 40px rgba(34,211,238,0.08); animation:floatOrb 4s ease-in-out infinite; }
@keyframes floatOrb { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
.empty-title { font-family:'Fraunces',serif; font-size:1.3rem; font-weight:600; color:#fff; }
.empty-sub { font-size:0.82rem; color:var(--muted2); margin-top:0.5rem; max-width:320px; line-height:1.6; }
.empty-hint { margin-top:1.5rem; display:flex; align-items:center; gap:0.5rem; font-size:0.72rem; color:var(--muted); background:var(--surface2); border:1px solid var(--border); border-radius:100px; padding:0.35rem 0.9rem; }
.empty-hint-dot { width:5px; height:5px; border-radius:50%; background:var(--cyan); box-shadow:0 0 6px var(--cyan); animation:heroPulse 2s ease-in-out infinite; }

/* ── Insight cards ── */
.cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }

.insight-card { border-radius:18px; border:1px solid var(--border); background:var(--surface); overflow:hidden; display:flex; flex-direction:column; transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s; }
.insight-card:hover { border-color:var(--ic-color); box-shadow:0 0 32px color-mix(in srgb,var(--ic-color) 15%,transparent),0 8px 28px rgba(0,0,0,0.3); transform:translateY(-3px); }

/* top stripe */
.ic-stripe { height:3px; background:linear-gradient(90deg,var(--ic-color),color-mix(in srgb,var(--ic-color) 50%,transparent)); }

.ic-header { padding:1.25rem 1.4rem 1rem; display:flex; align-items:flex-start; gap:0.85rem; border-bottom:1px solid var(--border); }
.ic-icon-wrap { width:42px; height:42px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.3rem; background:color-mix(in srgb,var(--ic-color) 12%,transparent); border:1px solid color-mix(in srgb,var(--ic-color) 22%,transparent); }
.ic-title-wrap { flex:1; min-width:0; }
.ic-title { font-family:'Fraunces',serif; font-size:1rem; font-weight:600; color:#fff; }
.ic-badge { display:inline-block; font-size:0.58rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; padding:0.18rem 0.5rem; border-radius:100px; background:color-mix(in srgb,var(--ic-color) 12%,transparent); color:var(--ic-color); border:1px solid color-mix(in srgb,var(--ic-color) 25%,transparent); margin-top:0.3rem; }
.ic-count { margin-left:auto; font-family:'Fraunces',serif; font-size:1.6rem; font-weight:600; color:var(--ic-color); line-height:1; opacity:0.7; flex-shrink:0; }

.ic-body { padding:1rem 1.4rem 1.25rem; flex:1; display:flex; flex-direction:column; gap:0.6rem; }

/* Skeleton shimmer */
.ic-skel { border-radius:10px; background:var(--surface2); animation:skeleton 1.4s ease-in-out infinite; }
@keyframes skeleton { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
.ic-skel-line { background:linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.07),rgba(255,255,255,0.04)); background-size:200% 100%; height:52px; border-radius:10px; animation:skeleton 1.4s ease-in-out infinite; }

/* Insight item */
.insight-item { display:flex; gap:0.65rem; align-items:flex-start; padding:0.75rem 0.9rem; border-radius:11px; background:var(--surface2); border:1px solid var(--border); transition:background 0.2s,border-color 0.2s; cursor:default; }
.insight-item:hover { background:color-mix(in srgb,var(--ic-color) 5%,transparent); border-color:color-mix(in srgb,var(--ic-color) 20%,transparent); }
.insight-bullet { width:20px; height:20px; border-radius:6px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--ic-color) 14%,transparent); border:1px solid color-mix(in srgb,var(--ic-color) 24%,transparent); margin-top:1px; }
.insight-bullet-dot { width:6px; height:6px; border-radius:50%; background:var(--ic-color); box-shadow:0 0 5px var(--ic-color); }
.insight-text { font-size:0.82rem; color:var(--text); line-height:1.55; flex:1; }

/* empty card state */
.ic-empty { padding:1.5rem; text-align:center; color:var(--muted); font-size:0.8rem; line-height:1.55; }
.ic-empty-icon { font-size:1.5rem; margin-bottom:0.5rem; opacity:0.4; }

/* ── Summary bar ── */
.summary-bar { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1rem; }
.sum-tile { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:1.1rem 1.25rem; transition:border-color 0.2s,transform 0.2s; }
.sum-tile:hover { border-color:rgba(34,211,238,0.2); transform:translateY(-1px); }
.sum-tile-label { font-size:0.64rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); margin-bottom:0.4rem; }
.sum-tile-value { font-family:'Fraunces',serif; font-size:1.8rem; font-weight:600; color:#fff; line-height:1; }
.sum-tile-sub { font-size:0.7rem; color:var(--muted2); margin-top:0.25rem; }

/* ── Tip panel ── */
.tip-panel { border-radius:18px; border:1px solid var(--border); background:var(--surface); overflow:hidden; }
.tip-header { padding:1.25rem 1.5rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.tip-eyebrow { font-size:0.62rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--cyan); display:flex; align-items:center; gap:0.4rem; }
.tip-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:var(--cyan); box-shadow:0 0 6px var(--cyan); animation:heroPulse 2.5s ease-in-out infinite; }
.tip-title { font-family:'Fraunces',serif; font-size:1.05rem; font-weight:600; color:#fff; margin-top:0.25rem; }
.tip-body { padding:1.1rem 1.5rem; display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0.75rem; }
.tip-item { display:flex; gap:0.65rem; padding:0.85rem 1rem; border-radius:12px; background:var(--surface2); border:1px solid var(--border); transition:border-color 0.2s; }
.tip-item:hover { border-color:rgba(34,211,238,0.2); }
.tip-num { width:22px; height:22px; border-radius:7px; flex-shrink:0; background:var(--cyan-dim); border:1px solid rgba(34,211,238,0.22); display:flex; align-items:center; justify-content:center; font-size:0.64rem; font-weight:700; color:var(--cyan); margin-top:1px; }
.tip-text-title { font-size:0.8rem; font-weight:600; color:#fff; }
.tip-text-sub { font-size:0.72rem; color:var(--muted); margin-top:2px; line-height:1.45; }

/* ── Info note ── */
.info-note { font-size:0.72rem; color:var(--muted); padding:0.6rem 0.85rem; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid var(--border); }
`;

/* ─── NAV ─────────────────────────────────────────────────────────────── */
const NAV = [
  { label:"Overview",    icon:"⊞", to:"/teacher" },
  { label:"Students",    icon:"👥", to:"/teacher/students" },
  { label:"Assignments", icon:"📋", to:"/teacher/assignments" },
  { label:"Grades",      icon:"📊", to:"/teacher/grades" },
  { label:"Attendance",  icon:"✅", to:"/teacher/attendance" },
  { label:"Messages",    icon:"💬", to:"/messages" },
  { label:"AI Insights", icon:"🤖", to:"/ai-insights" },
  { label:"Schedule",    icon:"🗓️", to:"/teacher/schedule" },
];

const initials = (s = "") => s.split(" ").map((w) => w[0]).join("").slice(0,2).toUpperCase() || "T";

/* ── Insight card config ─────────────────────────────────────────────── */
const CARD_CONFIG = {
  strengths:  { icon:"🏆", label:"Strengths",   color:"var(--emerald)", badge:"Positive signals" },
  weaknesses: { icon:"⚠️", label:"Areas to Watch", color:"var(--amber)",   badge:"Needs attention" },
  suggestions:{ icon:"💡", label:"Suggestions", color:"var(--cyan)",    badge:"AI recommended" },
};

/* ─── SUB-COMPONENTS ──────────────────────────────────────────────────── */

function InsightCard({ type, items, loading, delay }) {
  const cfg = CARD_CONFIG[type];
  const hasItems = items.length > 0;

  return (
    <div className="insight-card anim" style={{ "--ic-color": cfg.color, animationDelay: delay }}>
      <div className="ic-stripe" />
      <div className="ic-header">
        <div className="ic-icon-wrap">{cfg.icon}</div>
        <div className="ic-title-wrap">
          <div className="ic-title">{cfg.label}</div>
          <div className="ic-badge">{cfg.badge}</div>
        </div>
        {!loading && <div className="ic-count">{items.length}</div>}
      </div>
      <div className="ic-body">
        {loading ? (
          <>
            <div className="ic-skel-line" />
            <div className="ic-skel-line" style={{ opacity: 0.7 }} />
            <div className="ic-skel-line" style={{ opacity: 0.45 }} />
          </>
        ) : hasItems ? (
          items.map((item, i) => (
            <div className="insight-item" key={i} style={{ animationDelay: `${0.05 * i}s` }}>
              <div className="insight-bullet">
                <div className="insight-bullet-dot" />
              </div>
              <div className="insight-text">{item}</div>
            </div>
          ))
        ) : (
          <div className="ic-empty">
            <div className="ic-empty-icon">{cfg.icon}</div>
            No {cfg.label.toLowerCase()} generated yet.<br />
            Run the analysis to see results.
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────── */
function AIInsightsPage() {
  const { user, logout } = useAuth();
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [insights,    setInsights]    = useState({ strengths: [], weaknesses: [], suggestions: [] });
  const [hasGenerated, setHasGenerated] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [activeNav,   setActiveNav]   = useState(6); // AI Insights index
  const [profileOpen, setProfileOpen] = useState(false);

  const totalItems = insights.strengths.length + insights.weaknesses.length + insights.suggestions.length;
  const hi = initials(user?.fullName || user?.email);

  const generate = async () => {
    setLoading(true); setError("");
    try {
      const data = await getClassInsights();
      setInsights({
        strengths:   data?.strengths   || [],
        weaknesses:  data?.weaknesses  || [],
        suggestions: data?.suggestions || [],
      });
      setHasGenerated(true);
    } catch (err) {
      setError(err?.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ai-root" onClick={() => setProfileOpen(false)}>

        {/* ── SIDEBAR ── */}
        <aside className={`ai-sidebar ${collapsed ? "collapsed" : ""}`}>
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
          {NAV.map((item, i) => (
            <Link key={item.label} to={item.to} className={`sb-nav-item ${activeNav === i ? "active" : ""}`} onClick={() => setActiveNav(i)}>
              <span className="sb-nav-icon">{item.icon}</span>
              <span className="sb-nav-label">{item.label}</span>
            </Link>
          ))}

          <div className="sb-footer">
            <button className="sb-collapse-btn" onClick={() => setCollapsed((p) => !p)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span className="sb-nav-label" style={{ fontSize:"0.78rem" }}>Collapse</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="ai-main">

          {/* Topbar */}
          <header className="ai-topbar">
            <div className="tb-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:"var(--muted)", flexShrink:0 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input placeholder="Search insights…" />
            </div>
            <div className="tb-actions">
              <button className="tb-icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="notif-dot" />
              </button>
              <div style={{ position:"relative" }}>
                <button className="tb-avatar" onClick={(e) => { e.stopPropagation(); setProfileOpen((p) => !p); }}>{hi}</button>
                {profileOpen && (
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding:"0.6rem 0.75rem 0.45rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                      <div className="tb-avatar" style={{ pointerEvents:"none", width:30, height:30, fontSize:"0.62rem" }}>{hi}</div>
                      <div>
                        <div style={{ fontSize:"0.8rem", fontWeight:600, color:"#fff" }}>{user?.fullName || "Teacher"}</div>
                        <div style={{ fontSize:"0.69rem", color:"var(--muted)" }}>TEACHER</div>
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

          {/* Content */}
          <div className="ai-content">

            {/* ── Hero ── */}
            <div className="hero-banner anim" style={{ animationDelay:"0.05s" }}>
              <div className="hero-glow" />
              <div className="hero-glow-2" />
              <div className="hero-eyebrow"><span className="hero-dot" />{user?.role || "TEACHER"}</div>
              <h1 className="hero-title">
                Data-driven <em>AI Insights</em>
              </h1>
              <p className="hero-desc">
                Generate intelligent analysis of your class performance — including strengths, areas to watch, and actionable teaching suggestions.
              </p>

              {hasGenerated && !loading && (
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-val" style={{ color:"var(--emerald)" }}>{insights.strengths.length}</div>
                    <div className="hero-stat-label">Strengths</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-val" style={{ color:"var(--amber)" }}>{insights.weaknesses.length}</div>
                    <div className="hero-stat-label">Watch areas</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-val" style={{ color:"var(--cyan)" }}>{insights.suggestions.length}</div>
                    <div className="hero-stat-label">Suggestions</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-val">{totalItems}</div>
                    <div className="hero-stat-label">Total insights</div>
                  </div>
                </div>
              )}

              <div className="hero-actions">
                <button className="btn-primary" onClick={generate} disabled={loading}>
                  {loading ? (
                    <>
                      <span style={{ width:14, height:14, border:"2px solid rgba(0,0,0,0.3)", borderTopColor:"#040810", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block", flexShrink:0 }} />
                      Generating…
                    </>
                  ) : (
                    <>
                      🤖 {hasGenerated ? "Regenerate Insights" : "Generate Insights"}
                    </>
                  )}
                </button>
                {hasGenerated && (
                  <Link to={PATHS.TEACHER} className="btn-ghost">← Back to Dashboard</Link>
                )}
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="error-banner anim" style={{ animationDelay:"0.1s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
                <button className="retry-btn" onClick={generate}>Retry</button>
              </div>
            )}

            {/* ── Loading banner ── */}
            {loading && (
              <div className="gen-banner anim" style={{ animationDelay:"0.12s" }}>
                <div className="gen-spinner" />
                <div>
                  <div className="gen-title">Analysing your class data…</div>
                  <div className="gen-sub">AI is reviewing performance patterns. This may take a moment.</div>
                </div>
              </div>
            )}

            {/* ── Empty (pre-generate) ── */}
            {!loading && !hasGenerated && !error && (
              <div className="anim" style={{ animationDelay:"0.15s" }}>
                <div className="empty-root">
                  <div className="empty-orb">🤖</div>
                  <div className="empty-title">No insights generated yet</div>
                  <div className="empty-sub">Click <strong style={{ color:"var(--cyan)" }}>Generate Insights</strong> above to run an AI analysis of your class performance data — including strengths, areas of concern, and actionable suggestions.</div>
                  <div className="empty-hint">
                    <span className="empty-hint-dot" />
                    Powered by class performance and attendance data
                  </div>
                </div>
              </div>
            )}

            {/* ── Insight cards ── */}
            {(hasGenerated || loading) && (
              <div className="cards-grid anim" style={{ animationDelay:"0.2s" }}>
                <InsightCard type="strengths"   items={insights.strengths}   loading={loading} delay="0.22s" />
                <InsightCard type="weaknesses"  items={insights.weaknesses}  loading={loading} delay="0.3s"  />
                <InsightCard type="suggestions" items={insights.suggestions} loading={loading} delay="0.38s" />
              </div>
            )}

            {/* ── Summary tiles ── */}
            {hasGenerated && !loading && (
              <div className="anim" style={{ animationDelay:"0.45s" }}>
                <div style={{ marginBottom:"0.75rem" }}>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:"1.05rem", fontWeight:600, color:"#fff" }}>Insight Summary</div>
                  <div style={{ fontSize:"0.78rem", color:"var(--muted2)", marginTop:"0.2rem" }}>Aggregate view of your latest AI analysis run.</div>
                </div>
                <div className="summary-bar">
                  <div className="sum-tile">
                    <div className="sum-tile-label">Strengths</div>
                    <div className="sum-tile-value" style={{ color:"var(--emerald)" }}>{insights.strengths.length}</div>
                    <div className="sum-tile-sub">Positive class signals</div>
                  </div>
                  <div className="sum-tile">
                    <div className="sum-tile-label">Watch Areas</div>
                    <div className="sum-tile-value" style={{ color:"var(--amber)" }}>{insights.weaknesses.length}</div>
                    <div className="sum-tile-sub">Needs follow-up</div>
                  </div>
                  <div className="sum-tile">
                    <div className="sum-tile-label">Suggestions</div>
                    <div className="sum-tile-value" style={{ color:"var(--cyan)" }}>{insights.suggestions.length}</div>
                    <div className="sum-tile-sub">AI recommendations</div>
                  </div>
                  <div className="sum-tile">
                    <div className="sum-tile-label">Total</div>
                    <div className="sum-tile-value">{totalItems}</div>
                    <div className="sum-tile-sub">Insights generated</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tips panel ── */}
            <div className="tip-panel anim" style={{ animationDelay:"0.5s" }}>
              <div className="tip-header">
                <div>
                  <div className="tip-eyebrow"><span className="tip-eyebrow-dot" />Best practices</div>
                  <div className="tip-title">How to use AI Insights effectively</div>
                </div>
              </div>
              <div className="tip-body">
                {[
                  { num:"1", title:"Review strengths first", sub:"Acknowledge what's working before addressing gaps — it shapes a balanced response." },
                  { num:"2", title:"Act on top 1–2 suggestions", sub:"Focus on a few high-impact changes rather than trying to address everything at once." },
                  { num:"3", title:"Share with parents", sub:"Use the Messages module to communicate relevant findings with parents of at-risk students." },
                  { num:"4", title:"Regenerate regularly", sub:"Run analysis weekly to track trends and measure the impact of interventions over time." },
                ].map((t) => (
                  <div className="tip-item" key={t.num}>
                    <div className="tip-num">{t.num}</div>
                    <div>
                      <div className="tip-text-title">{t.title}</div>
                      <div className="tip-text-sub">{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-note anim" style={{ animationDelay:"0.55s" }}>
              AI insights are generated from your students' grade and attendance data via the class insights API. Results are advisory — always apply your professional judgement.
            </div>

          </div>{/* /content */}
        </div>{/* /main */}
      </div>
    </>
  );
}

export default AIInsightsPage;