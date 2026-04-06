import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDefaultPathByRole, PATHS } from "../routes/paths";

/* ─── Animated counter ───────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    let start;
    const duration = 1600;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─── Floating mesh background ──────────────────────────────────────────── */
function MeshBg() {
  return (
    <div className="mesh-bg" aria-hidden>
      <div className="mesh-blob mesh-1" />
      <div className="mesh-blob mesh-2" />
      <div className="mesh-blob mesh-3" />
      <div className="mesh-noise" />
      <svg className="mesh-lines" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 52,14 52,34 28,46 4,34 4,14" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

/* ─── Typewriter headline ────────────────────────────────────────────────── */
const WORDS = ["Admins.", "Teachers.", "Parents.", "Schools."];
function Typewriter() {
  const [wordIdx, setWordIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIdx];
    const speed = deleting ? 60 : 90;
    const pause = deleting ? 0 : 1800;

    if (!deleting && chars === word.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && chars === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
      return;
    }
    const t = setTimeout(() => setChars((c) => c + (deleting ? -1 : 1)), speed);
    return () => clearTimeout(t);
  }, [chars, deleting, wordIdx]);

  return (
    <span className="typewriter-word">
      {WORDS[wordIdx].slice(0, chars)}
      <span className="cursor">|</span>
    </span>
  );
}

/* ─── Role card ──────────────────────────────────────────────────────────── */
function RoleCard({ icon, title, desc, features, color, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, []);
  return (
    <article className={`role-card ${visible ? "rc-visible" : ""}`} style={{ "--rc-color": color }}>
      <div className="rc-icon-wrap">
        <span className="rc-icon">{icon}</span>
        <div className="rc-icon-glow" />
      </div>
      <h3 className="rc-title">{title}</h3>
      <p className="rc-desc">{desc}</p>
      <ul className="rc-features">
        {features.map((f) => (
          <li key={f} className="rc-feature-item">
            <span className="rc-check">✓</span> {f}
          </li>
        ))}
      </ul>
      <div className="rc-bottom-line" />
    </article>
  );
}

/* ─── Stat item ──────────────────────────────────────────────────────────── */
function StatItem({ value, suffix, label, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, []);
  return (
    <div className={`stat-item ${show ? "stat-visible" : ""}`}>
      <div className="stat-value">
        {show ? <Counter to={value} suffix={suffix} /> : "0"}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = getDefaultPathByRole(user?.role);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #050810;
          --surface:  rgba(255,255,255,0.03);
          --border:   rgba(255,255,255,0.07);
          --border2:  rgba(255,255,255,0.12);
          --text:     #dde1f0;
          --muted:    #6b7394;
          --muted2:   #9aa0bc;
          --teal:     #2dd4bf;
          --teal-dim: rgba(45,212,191,0.12);
          --teal-glow:rgba(45,212,191,0.22);
          --amber:    #fbbf24;
          --rose:     #fb7185;
          --ease:     cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Root ── */
        .hp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Mesh background ── */
        .mesh-bg {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          overflow: hidden;
        }
        .mesh-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); opacity: 0.55;
        }
        .mesh-1 {
          width: 600px; height: 600px;
          top: -15%; right: -10%;
          background: radial-gradient(circle, rgba(45,212,191,0.18), transparent 70%);
          animation: blobDrift 18s ease-in-out infinite alternate;
        }
        .mesh-2 {
          width: 500px; height: 500px;
          bottom: -10%; left: -8%;
          background: radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%);
          animation: blobDrift 22s ease-in-out infinite alternate-reverse;
        }
        .mesh-3 {
          width: 300px; height: 300px;
          top: 40%; left: 40%;
          background: radial-gradient(circle, rgba(251,191,36,0.08), transparent 70%);
          animation: blobDrift 14s ease-in-out infinite alternate;
        }
        @keyframes blobDrift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -50px) scale(1.1); }
        }
        .mesh-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .mesh-lines {
          position: absolute; inset: 0; width: 100%; height: 100%;
        }

        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 50;
          height: 70px;
          display: flex; align-items: center;
          padding: 0 1.25rem;
          background: rgba(5,8,16,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          opacity: 0; transform: translateY(-12px);
          transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
        }
        .navbar.nav-visible { opacity: 1; transform: translateY(0); }
        .navbar-inner {
          width: min(1200px, 100%);
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .nav-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.25rem; font-weight: 600;
          color: #fff;
          display: flex; align-items: center; gap: 0.6rem;
          text-decoration: none;
        }
        .nav-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 10px var(--teal);
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .nav-links { display: flex; align-items: center; gap: 0.25rem; margin-left: auto; }
        .nav-link {
          font-size: 0.82rem; font-weight: 500;
          color: var(--muted2);
          text-decoration: none;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-cta {
          font-size: 0.82rem; font-weight: 600;
          background: var(--teal);
          color: #050810;
          text-decoration: none;
          padding: 0.5rem 1.1rem;
          border-radius: 9px;
          margin-left: 0.5rem;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px var(--teal-glow);
        }
        .nav-cta:hover {
          background: #5eead4;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px var(--teal-glow);
        }

        /* ── Hero ── */
        .hero {
          position: relative; z-index: 10;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 8.5rem 1.5rem 5.5rem;
        }
        .hero-inner { width: min(1080px, 100%); }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(45,212,191,0.08);
          border: 1px solid rgba(45,212,191,0.2);
          border-radius: 100px;
          padding: 0.35rem 0.9rem;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 1.75rem;
          opacity: 0; transform: translateY(12px);
          animation: fadeUp 0.6s 0.3s var(--ease) forwards;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 6px var(--teal);
          animation: dotPulse 2s infinite;
        }

        .hero-headline {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.6rem, 6vw, 5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.08;
          letter-spacing: -0.03em;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.7s 0.45s var(--ease) forwards;
        }
        .hero-headline em { font-style: italic; color: var(--teal); }

        .typewriter-word { display: inline-block; min-width: 140px; }
        .cursor {
          display: inline-block;
          color: var(--teal);
          animation: blink 0.9s step-end infinite;
          margin-left: 1px;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        .hero-sub {
          margin-top: 1.5rem;
          font-size: 1.05rem; font-weight: 300;
          color: var(--muted2);
          max-width: 540px;
          line-height: 1.7;
          margin-left: auto;
          margin-right: auto;
          opacity: 0; transform: translateY(16px);
          animation: fadeUp 0.7s 0.6s var(--ease) forwards;
        }

        .hero-trust {
          margin-top: 1.3rem;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUp 0.6s 0.68s var(--ease) forwards;
        }
        .hero-pill {
          border-radius: 999px;
          padding: 0.33rem 0.72rem;
          font-size: 0.72rem;
          color: var(--muted2);
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
        }

        .hero-actions {
          margin-top: 2.5rem;
          display: flex; flex-wrap: wrap; gap: 0.75rem;
          justify-content: center;
          opacity: 0; transform: translateY(14px);
          animation: fadeUp 0.6s 0.75s var(--ease) forwards;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--teal);
          color: #050810;
          text-decoration: none;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 700; font-size: 0.9rem;
          box-shadow: 0 8px 28px var(--teal-glow);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-15deg);
          transition: none;
        }
        .btn-primary:hover::before { animation: shimmer 0.55s ease forwards; }
        @keyframes shimmer { to { left: 150%; } }
        .btn-primary:hover {
          background: #5eead4;
          transform: translateY(-2px);
          box-shadow: 0 14px 36px var(--teal-glow);
        }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border2);
          color: var(--text);
          text-decoration: none;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 500; font-size: 0.9rem;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        /* arrow icon */
        .btn-arrow { font-size: 1rem; transition: transform 0.2s; }
        .btn-primary:hover .btn-arrow,
        .btn-secondary:hover .btn-arrow { transform: translateX(3px); }

        /* ── Stats bar ── */
        .stats-bar {
          position: relative; z-index: 10;
          display: block;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(8px);
          padding: 0.85rem 1.5rem;
        }
        .stats-inner {
          width: min(1100px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .stat-item {
          min-width: 120px;
          text-align: center;
          padding: 1.2rem 1rem;
          border-right: 1px solid var(--border);
          opacity: 0; transform: translateY(10px);
          transition: background 0.2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(255,255,255,0.02); }
        .stat-visible { animation: fadeUp 0.55s var(--ease) forwards; }
        .stat-value {
          font-family: 'Fraunces', serif;
          font-size: 2.2rem; font-weight: 600;
          color: #fff; line-height: 1;
        }
        .stat-label {
          margin-top: 0.35rem;
          font-size: 0.75rem; color: var(--muted);
          font-weight: 500; letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── Section ── */
        .section {
          position: relative; z-index: 10;
          padding: 6.5rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .section-label::before {
          content: '';
          width: 24px; height: 1px;
          background: var(--teal);
        }
        .section-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 600; color: #fff;
          line-height: 1.15; letter-spacing: -0.025em;
          max-width: 560px;
        }
        .section-sub {
          margin-top: 0.75rem;
          font-size: 0.92rem; color: var(--muted2);
          max-width: 480px; line-height: 1.7;
        }

        /* ── Role cards ── */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-top: 3rem;
        }
        .role-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(24px);
          cursor: default;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .role-card:hover {
          border-color: var(--rc-color);
          box-shadow: 0 0 40px color-mix(in srgb, var(--rc-color) 20%, transparent),
                      0 16px 40px rgba(0,0,0,0.4);
          transform: translateY(-4px);
        }
        .role-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--rc-color), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .role-card:hover::before { opacity: 1; }
        .rc-visible { animation: fadeUp 0.6s var(--ease) forwards; }

        .rc-icon-wrap {
          position: relative; width: 52px; height: 52px;
          margin-bottom: 1.25rem;
        }
        .rc-icon {
          font-size: 1.6rem;
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: color-mix(in srgb, var(--rc-color) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--rc-color) 25%, transparent);
        }
        .rc-icon-glow {
          position: absolute; inset: 0;
          border-radius: 14px;
          background: var(--rc-color);
          opacity: 0;
          filter: blur(12px);
          transition: opacity 0.3s;
        }
        .role-card:hover .rc-icon-glow { opacity: 0.15; }

        .rc-title {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem; font-weight: 600;
          color: #fff; margin-bottom: 0.5rem;
        }
        .rc-desc {
          font-size: 0.85rem; color: var(--muted2);
          line-height: 1.6; margin-bottom: 1.25rem;
        }
        .rc-features { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; }
        .rc-feature-item {
          font-size: 0.8rem; color: var(--muted2);
          display: flex; align-items: center; gap: 0.5rem;
        }
        .rc-check {
          font-size: 0.7rem; font-weight: 700;
          color: var(--rc-color);
          width: 16px; height: 16px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--rc-color) 15%, transparent);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rc-bottom-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--rc-color), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .role-card:hover .rc-bottom-line { opacity: 0.6; }

        /* ── Features strip ── */
        .features-strip {
          position: relative; z-index: 10;
          background: rgba(255,255,255,0.015);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 4.5rem 1.5rem;
        }
        .features-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2rem;
        }
        .feature-item {
          display: flex; flex-direction: column; gap: 0.6rem;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          padding: 1rem;
          transition: transform 0.2s, border-color 0.2s, background 0.2s;
        }
        .feature-item:hover {
          transform: translateY(-2px);
          border-color: rgba(45,212,191,0.25);
          background: rgba(45,212,191,0.05);
        }
        .feature-icon {
          font-size: 1.5rem; width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(45,212,191,0.08);
          border: 1px solid rgba(45,212,191,0.15);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.25rem;
        }
        .feature-title {
          font-weight: 600; font-size: 0.88rem; color: #fff;
        }
        .feature-desc {
          font-size: 0.8rem; color: var(--muted); line-height: 1.55;
        }

        /* ── CTA section ── */
        .cta-section {
          position: relative; z-index: 10;
          padding: 7rem 1.5rem;
          text-align: center;
        }
        .cta-card {
          max-width: 680px; margin: 0 auto;
          background: linear-gradient(135deg, rgba(45,212,191,0.07) 0%, rgba(99,102,241,0.05) 100%);
          border: 1px solid rgba(45,212,191,0.18);
          border-radius: 28px;
          padding: 3.5rem 2.5rem;
          position: relative; overflow: hidden;
          box-shadow: 0 18px 50px rgba(0,0,0,0.35);
        }
        .cta-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--teal), transparent);
        }
        .cta-glow {
          position: absolute; top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 300px; height: 200px;
          background: radial-gradient(ellipse, rgba(45,212,191,0.15), transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 600; color: #fff;
          line-height: 1.15; letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }
        .cta-sub {
          font-size: 0.9rem; color: var(--muted2);
          line-height: 1.65; margin-bottom: 2rem;
        }

        /* ── Footer ── */
        .footer {
          position: relative; z-index: 10;
          border-top: 1px solid var(--border);
          padding: 2rem 1.5rem;
        }
        .footer-inner {
          width: min(1100px, 100%);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-copy {
          font-size: 0.78rem; color: var(--muted);
        }
        .footer-links { display: flex; gap: 1.25rem; }
        .footer-link {
          font-size: 0.78rem; color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--text); }

        /* ── Scroll reveal util ── */
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-headline { max-width: 680px; }
          .stats-inner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
        }

        @media (max-width: 640px) {
          .hero-headline { font-size: 2.2rem; }
          .hero-sub { font-size: 0.95rem; line-height: 1.65; }
          .nav-links .nav-link { display: none; }
          .navbar { height: 64px; }
          .navbar-inner { gap: 0.5rem; }
          .nav-cta { padding: 0.46rem 0.9rem; font-size: 0.78rem; }
          .stats-bar { padding: 0.7rem 1rem; }
          .stats-inner { grid-template-columns: 1fr; }
          .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
          .stat-item:last-child { border-bottom: none; }
          .section { padding: 5rem 1rem; }
          .features-strip { padding: 3.6rem 1rem; }
          .cta-section { padding: 5rem 1rem; }
          .cta-card { padding: 2.4rem 1.25rem; border-radius: 22px; }
        }
      `}</style>

      <div className="hp-root">
        <MeshBg />

        {/* ── Navbar ── */}
        <nav className={`navbar ${mounted ? "nav-visible" : ""}`}>
          <div className="navbar-inner">
            <Link to={PATHS.HOME} className="nav-logo">
              <span className="nav-logo-dot" />
              EduPortal
            </Link>
            <div className="nav-links">
              <a href="#roles" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              {isAuthenticated ? (
                <Link to={dashboardPath} className="nav-cta">Dashboard →</Link>
              ) : (
                <>
                  <Link to={PATHS.LOGIN} className="nav-link">Sign in</Link>
                  <Link to={PATHS.REGISTER} className="nav-cta">Get started →</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Trusted by 500+ institutions
            </div>

            <h1 className="hero-headline">
              One portal built for{" "}
              <em><Typewriter /></em>
            </h1>

            <p className="hero-sub">
              A role-based education platform connecting admins, teachers, and parents with AI-powered insights, real-time messaging, and seamless access.
            </p>

            <div className="hero-trust">
              <span className="hero-pill">Enterprise-grade security</span>
              <span className="hero-pill">Real-time collaboration</span>
              <span className="hero-pill">Mobile-ready UX</span>
            </div>

            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} className="btn-primary">
                    Open Dashboard <span className="btn-arrow">→</span>
                  </Link>
                  <Link to={PATHS.MESSAGES} className="btn-secondary">
                    Go to Messages <span className="btn-arrow">→</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={PATHS.REGISTER} className="btn-primary">
                    Get started free <span className="btn-arrow">→</span>
                  </Link>
                  <Link to={PATHS.LOGIN} className="btn-secondary">
                    Sign in <span className="btn-arrow">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-bar">
          <div className="stats-inner">
            <StatItem value={500}  suffix="+"  label="Institutions"  delay={200} />
            <StatItem value={12400} suffix="+" label="Active Users"  delay={350} />
            <StatItem value={98}   suffix="%"  label="Uptime SLA"    delay={500} />
            <StatItem value={4}    suffix="x"  label="Faster Comms"  delay={650} />
          </div>
        </div>

        {/* ── Roles section ── */}
        <section className="section" id="roles">
          <SectionHeader
            label="Who it's for"
            title="Every role has its own command center"
            subtitle="Tailored dashboards and permissions for every member of your institution, with no one-size-fits-all friction."
          />
          <div className="roles-grid">
            <RoleCard
              icon="🛡️"
              title="Admin"
              desc="Full visibility over your institution. Manage users, monitor system health, and control access policies."
              features={["User & role management", "System audit logs", "Analytics & reporting", "Security controls"]}
              color="#f59e0b"
              delay={300}
            />
            <RoleCard
              icon="📖"
              title="Teacher"
              desc="Everything you need to run a modern classroom — from rosters to AI-powered grade insights."
              features={["Class & student management", "Assignment tracking", "AI-powered insights", "Parent messaging"]}
              color="#2dd4bf"
              delay={420}
            />
            <RoleCard
              icon="👨‍👩‍👧"
              title="Parent"
              desc="Stay connected with your child's progress, attendance, and teachers — all in one place."
              features={["Real-time grade updates", "Attendance overview", "Direct teacher messaging", "Fee & payment hub"]}
              color="#a78bfa"
              delay={540}
            />
          </div>
        </section>

        {/* ── Features strip ── */}
        <div className="features-strip" id="about">
          <div className="features-inner">
            {[
              { icon: "🔒", title: "Role-based access", desc: "Strict permission boundaries so every user sees only what they need." },
              { icon: "⚡", title: "Real-time messaging", desc: "Instant notifications and threaded conversations between roles." },
              { icon: "🤖", title: "AI Insights", desc: "Smart summaries, grade predictions, and behaviour trend analysis." },
              { icon: "📊", title: "Live analytics", desc: "Dashboards that update in real time — no refreshing required." },
              { icon: "📱", title: "Mobile-ready", desc: "Fully responsive design that works beautifully on any device." },
              { icon: "🌍", title: "Multi-language", desc: "Support for multiple locales and regional academic calendars." },
            ].map((f) => (
              <FeatureTile key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="cta-title">Ready to transform your school portal?</h2>
            <p className="cta-sub">
              Join hundreds of institutions using EduPortal to connect every stakeholder — from admin to parent — in one secure, elegant platform.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {isAuthenticated ? (
                <Link to={dashboardPath} className="btn-primary">
                  Go to Dashboard <span className="btn-arrow">→</span>
                </Link>
              ) : (
                <>
                  <Link to={PATHS.REGISTER} className="btn-primary">
                    Create free account <span className="btn-arrow">→</span>
                  </Link>
                  <Link to={PATHS.LOGIN} className="btn-secondary">
                    Sign in <span className="btn-arrow">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-copy">© {new Date().getFullYear()} EduPortal. All rights reserved.</div>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <>
      <div className="section-label">{label}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{subtitle}</p>
    </>
  );
}

function FeatureTile({ icon, title, desc }) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
    </div>
  );
}