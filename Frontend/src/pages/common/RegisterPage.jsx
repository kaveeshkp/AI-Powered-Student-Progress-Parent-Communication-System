import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roles = ["TEACHER", "PARENT"];

/* ── Floating Orb ─────────────────────────────────────────────────────── */
function Orb({ style }) {
  return <div className="orb" style={style} />;
}

/* ── Grid lines ────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <svg className="grid-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-r" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-r)" />
    </svg>
  );
}

/* ── Particles ─────────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i / 20) * 100 + Math.random() * 5}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${7 + Math.random() * 8}s`,
    size: `${2 + Math.random() * 2.5}px`,
    opacity: 0.12 + Math.random() * 0.25,
  }));
  return (
    <div className="particles">
      {particles.map((p) => (
        <span key={p.id} className="particle" style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }} />
      ))}
    </div>
  );
}

/* ── Role selector card ────────────────────────────────────────────────── */
function RoleCard({ value, selected, onClick }) {
  const config = {
    TEACHER: { emoji: "🎓", label: "Teacher", sub: "Manage classes & students" },
    PARENT:  { emoji: "👨‍👩‍👧", label: "Parent",  sub: "Track your child's progress" },
  };
  const c = config[value];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`role-card ${selected ? "role-card-active" : ""}`}
    >
      <span className="role-card-emoji">{c.emoji}</span>
      <div>
        <div className="role-card-label">{c.label}</div>
        <div className="role-card-sub">{c.sub}</div>
      </div>
      <span className="role-card-check">{selected ? "✓" : ""}</span>
    </button>
  );
}

/* ── Password strength ─────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const score = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["", "#f87171", "#fbbf24", "#a3e635", "#34d399", "#22d3ee"];

  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="pw-bar" style={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.08)", boxShadow: i <= score ? `0 0 6px ${colors[score]}` : "none", transition: "background 0.3s, box-shadow 0.3s" }} />
        ))}
      </div>
      <span className="pw-label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "TEACHER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  /* 3-D tilt */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) scale(1.008)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  /* Step progress (visual only) */
  const filledFields = [form.fullName, form.email, form.password].filter(Boolean).length;
  const progress = Math.round((filledFields / 3) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --indigo:    #6366f1;
          --indigo-lt: #818cf8;
          --violet:    #7c3aed;
          --bg:        #05050f;
          --card-bg:   rgba(10,10,28,0.78);
          --border:    rgba(99,102,241,0.18);
          --text:      #e2e4f0;
          --muted:     #7879a0;
          --red:       #f87171;
          --green:     #34d399;
          --ease:      cubic-bezier(0.16,1,0.3,1);
        }

        .reg-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          overflow: hidden;
          position: relative;
        }

        /* ── Background ── */
        .grid-svg { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; animation: orbDrift 14s ease-in-out infinite alternate; }
        @keyframes orbDrift { 0% { transform: translate(0,0); } 100% { transform: translate(30px,-40px); } }
        .particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .particle { position: absolute; bottom: -10px; background: var(--indigo-lt); border-radius: 50%; animation: floatUp linear infinite; }
        @keyframes floatUp { 0% { transform: translateY(0) scale(1); } 80% { opacity: inherit; } 100% { transform: translateY(-110vh) scale(0.4); opacity: 0; } }

        /* ── Card wrap ── */
        .card-wrap {
          position: relative; z-index: 10;
          width: 100%; max-width: 480px;
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
        }
        .card-wrap.visible { opacity: 1; transform: translateY(0); }

        .card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.25rem 2.25rem 2rem;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.06), 0 30px 80px rgba(0,0,0,0.6), 0 0 120px rgba(99,102,241,0.05) inset;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          will-change: transform;
          position: relative; overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 24px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 55%, rgba(124,58,237,0.05) 100%);
          pointer-events: none;
        }
        .card:hover { box-shadow: 0 0 0 1px rgba(99,102,241,0.14), 0 40px 100px rgba(0,0,0,0.7), 0 0 140px rgba(99,102,241,0.08) inset; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: var(--muted2, #a7acc7);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 0.42rem 0.72rem;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
          margin-bottom: 1rem;
        }
        .back-btn:hover {
          color: #fff;
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.45);
          transform: translateY(-1px);
        }
        .back-btn:active { transform: translateY(0); }

        /* ── Progress bar ── */
        .prog-wrap { margin-bottom: 1.75rem; }
        .prog-label { display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--muted); margin-bottom: 0.45rem; letter-spacing: 0.04em; }
        .prog-label span:last-child { color: var(--indigo-lt); font-weight: 600; }
        .prog-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .prog-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--indigo), var(--violet)); transition: width 0.5s var(--ease); box-shadow: 0 0 8px var(--indigo); }

        /* ── Header ── */
        .logo-ring {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          animation: logoIn 0.7s 0.2s var(--ease) both;
        }
        @keyframes logoIn { from { opacity:0; transform: scale(0.5) rotate(-15deg); } to { opacity:1; transform: scale(1) rotate(0deg); } }
        .logo-ring svg { width: 22px; height: 22px; color: #fff; }

        .badge {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-size: 0.63rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--indigo-lt);
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px; padding: 0.25rem 0.85rem; margin-bottom: 0.7rem;
          animation: fadeSlideDown 0.6s 0.35s var(--ease) both;
        }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.85rem; font-weight: 700; color: #fff; letter-spacing: -0.03em; line-height: 1.1;
          animation: fadeSlideDown 0.6s 0.45s var(--ease) both;
        }
        .card-sub {
          margin-top: 0.35rem; font-size: 0.85rem; color: var(--muted);
          animation: fadeSlideDown 0.6s 0.5s var(--ease) both;
        }
        @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

        /* ── Form ── */
        .form { margin-top: 1.75rem; display: flex; flex-direction: column; gap: 1rem; }

        .field {
          display: flex; flex-direction: column; gap: 0.4rem;
          opacity: 0; transform: translateX(-16px);
          animation: slideInField 0.55s var(--ease) forwards;
        }
        .field:nth-child(1) { animation-delay: 0.55s; }
        .field:nth-child(2) { animation-delay: 0.63s; }
        .field:nth-child(3) { animation-delay: 0.71s; }
        .field:nth-child(4) { animation-delay: 0.79s; }
        @keyframes slideInField { to { opacity:1; transform:translateX(0); } }

        .field-label {
          font-size: 0.78rem; font-weight: 500; color: var(--muted);
          letter-spacing: 0.04em; transition: color 0.2s;
        }
        .field.focused .field-label { color: var(--indigo-lt); }

        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; transition: color 0.2s; }
        .field.focused .input-icon { color: var(--indigo-lt); }
        .input-action { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px; border-radius: 4px; transition: color 0.2s; }
        .input-action:hover { color: var(--text); }

        .field-input {
          width: 100%; padding: 0.82rem 1rem 0.82rem 2.65rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; color: var(--text);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .field-input::placeholder { color: rgba(120,121,160,0.55); }
        .field-input:focus { border-color: var(--indigo); background: rgba(99,102,241,0.05); box-shadow: 0 0 0 3px rgba(99,102,241,0.14); }
        .field-input.has-action { padding-right: 2.75rem; }

        .focus-bar { height: 2px; background: linear-gradient(90deg, var(--indigo), var(--violet)); border-radius: 99px; transform: scaleX(0); transform-origin: left; transition: transform 0.35s var(--ease); margin-top: 2px; }
        .field.focused .focus-bar { transform: scaleX(1); }

        .field-hint { font-size: 0.69rem; color: var(--muted); margin-top: 1px; }

        /* ── Role selector ── */
        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
        .role-card {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.75rem 0.9rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; cursor: pointer;
          text-align: left;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.2s;
          position: relative;
        }
        .role-card:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.3); transform: translateY(-1px); }
        .role-card-active {
          background: rgba(99,102,241,0.1);
          border-color: var(--indigo);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.14), 0 0 18px rgba(99,102,241,0.1);
        }
        .role-card-emoji { font-size: 1.3rem; flex-shrink: 0; }
        .role-card-label { font-size: 0.82rem; font-weight: 600; color: var(--text); }
        .role-card-sub { font-size: 0.68rem; color: var(--muted); margin-top: 1px; }
        .role-card-check {
          margin-left: auto; width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          background: var(--indigo); color: #fff;
          font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0);
          transition: opacity 0.2s, transform 0.2s var(--ease);
        }
        .role-card-active .role-card-check { opacity: 1; transform: scale(1); }

        /* ── Password strength ── */
        .pw-strength { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.45rem; }
        .pw-bars { display: flex; gap: 3px; flex: 1; }
        .pw-bar { height: 3px; flex: 1; border-radius: 99px; background: rgba(255,255,255,0.08); }
        .pw-label { font-size: 0.68rem; font-weight: 600; min-width: 56px; text-align: right; }

        /* ── Error ── */
        .error-box {
          border-radius: 10px; border: 1px solid rgba(248,113,113,0.3);
          background: rgba(248,113,113,0.07);
          padding: 0.7rem 1rem; font-size: 0.8rem; color: var(--red);
          display: flex; align-items: center; gap: 0.5rem;
          animation: shakeIn 0.5s var(--ease);
        }
        @keyframes shakeIn {
          0% { transform: translateX(-8px); opacity: 0; }
          30% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* ── Submit ── */
        .btn-wrap { opacity: 0; transform: translateY(12px); animation: fadeSlideUp 0.5s 0.85s var(--ease) forwards; }
        @keyframes fadeSlideUp { to { opacity:1; transform:translateY(0); } }

        .submit-btn {
          width: 100%; padding: 0.88rem 1rem; border: none; border-radius: 12px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.04em;
          color: #fff;
          background: linear-gradient(135deg, var(--indigo) 0%, var(--violet) 100%);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(99,102,241,0.45); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent); opacity: 0; transition: opacity 0.3s; }
        .submit-btn:hover::after { opacity: 1; }
        .submit-btn::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent); transform: skewX(-15deg); }
        .submit-btn:hover::before { animation: shimmerSweep 0.6s ease forwards; }
        @keyframes shimmerSweep { to { left: 150%; } }

        .spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 7px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .check-circle { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: rgba(52,211,153,0.25); border-radius: 50%; margin-right: 7px; animation: popIn 0.4s var(--ease); }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

        /* ── Divider ── */
        .divider { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.4rem; opacity: 0; animation: fadeSlideUp 0.5s 0.92s var(--ease) forwards; }
        .divider span { height: 1px; flex: 1; background: rgba(255,255,255,0.07); }
        .divider p { font-size: 0.72rem; color: var(--muted); white-space: nowrap; }

        /* ── Login link ── */
        .login-row { margin-top: 1rem; text-align: center; font-size: 0.82rem; color: var(--muted); opacity: 0; animation: fadeSlideUp 0.5s 1s var(--ease) forwards; }
        .login-link { color: var(--indigo-lt); font-weight: 600; text-decoration: none; position: relative; transition: color 0.2s; }
        .login-link::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px; background: var(--indigo-lt); transform: scaleX(0); transition: transform 0.25s var(--ease); transform-origin: left; }
        .login-link:hover { color: #fff; }
        .login-link:hover::after { transform: scaleX(1); }

        /* ── Success overlay ── */
        .success-overlay {
          position: absolute; inset: 0; border-radius: 24px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;
          background: rgba(10,10,28,0.94); backdrop-filter: blur(6px);
          z-index: 20; animation: fadeIn 0.35s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .success-icon { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05)); border: 1px solid rgba(52,211,153,0.35); display: flex; align-items: center; justify-content: center; animation: scaleIn 0.5s var(--ease); }
        @keyframes scaleIn { from { transform: scale(0) rotate(-30deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
        .success-text { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--green); }
        .success-sub { font-size: 0.78rem; color: var(--muted); }

        /* ── Terms note ── */
        .terms-note { font-size: 0.68rem; color: var(--muted); text-align: center; margin-top: 0.75rem; opacity: 0; animation: fadeSlideUp 0.5s 1.05s var(--ease) forwards; }
        .terms-note a { color: var(--indigo-lt); text-decoration: none; }
        .terms-note a:hover { text-decoration: underline; }
      `}</style>

      <div className="reg-root">
        <GridLines />
        <Orb style={{ width: 450, height: 450, top: "-18%", right: "-12%", background: "rgba(99,102,241,0.11)", animationDuration: "17s" }} />
        <Orb style={{ width: 350, height: 350, bottom: "-12%", left: "-10%", background: "rgba(124,58,237,0.09)", animationDuration: "13s", animationDirection: "alternate-reverse" }} />
        <Orb style={{ width: 220, height: 220, top: "50%", right: "15%", background: "rgba(99,102,241,0.05)", animationDuration: "11s" }} />
        <Particles />

        <div className={`card-wrap ${mounted ? "visible" : ""}`}>
          <div className="card" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

            <button type="button" onClick={onBack} className="back-btn" aria-label="Go back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>

            {/* Success overlay */}
            {success && (
              <div className="success-overlay">
                <div className="success-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="success-text">Account created!</p>
                <p className="success-sub">Redirecting to sign in…</p>
              </div>
            )}

            {/* Progress bar */}
            <div className="prog-wrap">
              <div className="prog-label"><span>Profile completion</span><span>{progress}%</span></div>
              <div className="prog-track"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
            </div>

            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <div className="logo-ring">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="badge">Join EduPortal</div>
              <h1 className="card-title">Create your account</h1>
              <p className="card-sub">Choose your role and get started in seconds</p>
            </div>

            {/* Form */}
            <form className="form" onSubmit={onSubmit}>

              {/* Full name */}
              <div className={`field ${focusedField === "fullName" ? "focused" : ""}`}>
                <label htmlFor="fullName" className="field-label">Full name</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={onChange} onFocus={() => setFocusedField("fullName")} onBlur={() => setFocusedField(null)} required className="field-input" placeholder="John Doe" />
                </div>
                <div className="focus-bar" />
              </div>

              {/* Email */}
              <div className={`field ${focusedField === "email" ? "focused" : ""}`}>
                <label htmlFor="email" className="field-label">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                    </svg>
                  </span>
                  <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required className="field-input" placeholder="john@example.com" />
                </div>
                <div className="focus-bar" />
              </div>

              {/* Password */}
              <div className={`field ${focusedField === "password" ? "focused" : ""}`}>
                <label htmlFor="password" className="field-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input id="password" name="password" type={showPw ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={onChange} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required minLength={6} className="field-input has-action" placeholder="Min. 6 characters" />
                  <button type="button" className="input-action" onClick={() => setShowPw((p) => !p)} tabIndex={-1}>
                    {showPw ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
                <div className="focus-bar" />
              </div>

              {/* Role */}
              <div className="field" style={{ animationDelay: "0.79s" }}>
                <label className="field-label">I am a</label>
                <div className="role-grid">
                  {roles.map((r) => (
                    <RoleCard key={r} value={r} selected={form.role === r} onClick={() => setForm((p) => ({ ...p, role: r }))} />
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="btn-wrap">
                <button type="submit" disabled={loading || success} className="submit-btn">
                  {loading ? (
                    <><span className="spinner" />Creating account…</>
                  ) : success ? (
                    <><span className="check-circle"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Account created!</>
                  ) : (
                    "Create account →"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="divider"><span /><p>Already have an account?</p><span /></div>

            <p className="login-row">
              <Link to="/login" className="login-link">Sign in instead</Link>
            </p>

            <p className="terms-note">
              By creating an account you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;