import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../routes/paths";

/* ─── Floating Orb ─────────────────────────────────────────────────────── */
function Orb({ style }) {
  return <div className="orb" style={style} />;
}

/* ─── Grid lines ────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <svg className="grid-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(99,102,241,0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Animated particles ────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: `${2 + Math.random() * 3}px`,
    opacity: 0.15 + Math.random() * 0.3,
  }));

  return (
    <div className="particles">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [success, setSuccess] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* 3-D tilt on card */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
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
      const response = await login(form);
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 900));
      const role = response.role;
      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "TEACHER") navigate("/teacher", { replace: true });
      else if (role === "PARENT") navigate("/parent", { replace: true });
      else navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed.");
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

  return (
    <>
      {/* ── Inline styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Tokens ── */
        :root {
          --indigo:   #6366f1;
          --indigo-lt:#818cf8;
          --violet:   #7c3aed;
          --bg:       #05050f;
          --card-bg:  rgba(10,10,28,0.75);
          --border:   rgba(99,102,241,0.18);
          --text:     #e2e4f0;
          --muted:    #7879a0;
          --red:      #f87171;
          --green:    #34d399;
          --ease-out-expo: cubic-bezier(0.16,1,0.3,1);
        }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow: hidden;
          position: relative;
        }

        /* ── Background layers ── */
        .grid-svg {
          position: fixed; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orbDrift 14s ease-in-out infinite alternate;
        }
        @keyframes orbDrift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(30px, -40px); }
        }

        .particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .particle {
          position: absolute;
          bottom: -10px;
          background: var(--indigo-lt);
          border-radius: 50%;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: inherit; }
          80%  { opacity: inherit; }
          100% { transform: translateY(-110vh) scale(0.4); opacity: 0; }
        }

        /* ── Card ── */
        .card-wrap {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
        }
        .card-wrap.visible { opacity: 1; transform: translateY(0); }

        .card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.5rem 2.25rem;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.06),
            0 30px 80px rgba(0,0,0,0.6),
            0 0 120px rgba(99,102,241,0.06) inset;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          will-change: transform;
        }
        .card:hover {
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.14),
            0 40px 100px rgba(0,0,0,0.7),
            0 0 160px rgba(99,102,241,0.1) inset;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: var(--muted);
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

        /* shimmer top line */
        .card::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 60%, rgba(124,58,237,0.06) 100%);
          pointer-events: none;
        }

        /* ── Header ── */
        .logo-ring {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          animation: logoIn 0.7s 0.2s var(--ease-out-expo) both;
        }
        @keyframes logoIn {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .logo-ring svg { width: 24px; height: 24px; color: #fff; }

        .badge {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--indigo-lt);
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px;
          padding: 0.25rem 0.85rem;
          margin-bottom: 0.75rem;
          animation: fadeSlideDown 0.6s 0.35s var(--ease-out-expo) both;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          animation: fadeSlideDown 0.6s 0.45s var(--ease-out-expo) both;
        }
        .card-sub {
          margin-top: 0.375rem;
          font-size: 0.875rem; color: var(--muted);
          animation: fadeSlideDown 0.6s 0.5s var(--ease-out-expo) both;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Form ── */
        .form { margin-top: 2rem; display: flex; flex-direction: column; gap: 1.1rem; }

        .field {
          display: flex; flex-direction: column; gap: 0.45rem;
          opacity: 0; transform: translateX(-16px);
          animation: slideInField 0.55s var(--ease-out-expo) forwards;
        }
        .field:nth-child(1) { animation-delay: 0.55s; }
        .field:nth-child(2) { animation-delay: 0.65s; }

        @keyframes slideInField {
          to { opacity: 1; transform: translateX(0); }
        }

        .field-label {
          font-size: 0.8rem; font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .field.focused .field-label { color: var(--indigo-lt); }

        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--muted);
          transition: color 0.2s;
          pointer-events: none;
        }
        .field.focused .input-icon { color: var(--indigo-lt); }

        .field-input {
          width: 100%; padding: 0.85rem 1rem 0.85rem 2.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .field-input::placeholder { color: rgba(120,121,160,0.6); }
        .field-input:focus {
          border-color: var(--indigo);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        /* ── Focus bar ── */
        .focus-bar {
          height: 2px;
          background: linear-gradient(90deg, var(--indigo), var(--violet));
          border-radius: 99px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s var(--ease-out-expo);
          margin-top: 3px;
        }
        .field.focused .focus-bar { transform: scaleX(1); }

        /* ── Error ── */
        .error-box {
          border-radius: 10px;
          border: 1px solid rgba(248,113,113,0.3);
          background: rgba(248,113,113,0.07);
          padding: 0.75rem 1rem;
          font-size: 0.83rem;
          color: var(--red);
          display: flex; align-items: center; gap: 0.5rem;
          animation: shakeIn 0.5s var(--ease-out-expo);
        }
        @keyframes shakeIn {
          0%   { transform: translateX(-8px); opacity: 0; }
          30%  { transform: translateX(6px); }
          60%  { transform: translateX(-4px); }
          80%  { transform: translateX(2px); }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* ── Submit button ── */
        .btn-wrap {
          opacity: 0; transform: translateY(12px);
          animation: fadeSlideUp 0.5s 0.75s var(--ease-out-expo) forwards;
        }
        @keyframes fadeSlideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .submit-btn {
          width: 100%; padding: 0.9rem 1rem;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.04em;
          color: #fff;
          background: linear-gradient(135deg, var(--indigo) 0%, var(--violet) 100%);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(99,102,241,0.45);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 6px 16px rgba(99,102,241,0.3);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ripple */
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .submit-btn:hover::after { opacity: 1; }

        /* shimmer sweep on hover */
        .submit-btn::before {
          content: '';
          position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-15deg);
          transition: none;
        }
        .submit-btn:hover::before {
          animation: shimmerSweep 0.6s ease forwards;
        }
        @keyframes shimmerSweep {
          to { left: 150%; }
        }

        /* loading spinner */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* success check */
        .check-circle {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px;
          background: rgba(52,211,153,0.2);
          border-radius: 50%;
          margin-right: 8px;
          animation: popIn 0.4s var(--ease-out-expo);
        }
        @keyframes popIn {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin-top: 1.5rem;
          opacity: 0;
          animation: fadeSlideUp 0.5s 0.85s var(--ease-out-expo) forwards;
        }
        .divider span { height: 1px; flex: 1; background: rgba(255,255,255,0.07); }
        .divider p { font-size: 0.75rem; color: var(--muted); white-space: nowrap; }

        /* ── Register link ── */
        .register-row {
          margin-top: 1.1rem; text-align: center;
          font-size: 0.85rem; color: var(--muted);
          opacity: 0;
          animation: fadeSlideUp 0.5s 0.95s var(--ease-out-expo) forwards;
        }
        .register-link {
          color: var(--indigo-lt); font-weight: 600;
          text-decoration: none;
          position: relative;
          transition: color 0.2s;
        }
        .register-link::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: var(--indigo-lt);
          transform: scaleX(0);
          transition: transform 0.25s var(--ease-out-expo);
          transform-origin: left;
        }
        .register-link:hover { color: #fff; }
        .register-link:hover::after { transform: scaleX(1); }

        /* ── Success overlay ── */
        .success-overlay {
          position: absolute; inset: 0; border-radius: 24px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.75rem;
          background: rgba(10,10,28,0.92);
          backdrop-filter: blur(6px);
          z-index: 20;
          animation: fadeIn 0.35s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .success-icon {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05));
          border: 1px solid rgba(52,211,153,0.35);
          display: flex; align-items: center; justify-content: center;
          animation: scaleIn 0.5s var(--ease-out-expo);
        }
        @keyframes scaleIn {
          from { transform: scale(0) rotate(-30deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .success-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 600; color: var(--green);
        }
        .success-sub { font-size: 0.8rem; color: var(--muted); }
      `}</style>

      <div className="login-root">
        {/* Background layers */}
        <GridLines />
        <Orb style={{ width: 420, height: 420, top: "-15%", right: "-10%", background: "rgba(99,102,241,0.12)", animationDuration: "16s" }} />
        <Orb style={{ width: 320, height: 320, bottom: "-10%", left: "-8%", background: "rgba(124,58,237,0.1)", animationDuration: "12s", animationDirection: "alternate-reverse" }} />
        <Orb style={{ width: 200, height: 200, top: "40%", left: "20%", background: "rgba(99,102,241,0.06)", animationDuration: "10s" }} />
        <Particles />

        {/* Card */}
        <div className={`card-wrap ${mounted ? "visible" : ""}`}>
          <div
            className="card"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ position: "relative" }}
          >
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
                <p className="success-text">Authenticated</p>
                <p className="success-sub">Redirecting your dashboard…</p>
              </div>
            )}

            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <div className="logo-ring">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="badge">Secure Access</div>
              <h1 className="card-title">Welcome back</h1>
              <p className="card-sub">Sign in to your dashboard</p>
            </div>

            {/* Form */}
            <form className="form" onSubmit={onSubmit}>
              {/* Email */}
              <div className={`field ${focusedField === "email" ? "focused" : ""}`}>
                <label htmlFor="email" className="field-label">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                  </span>
                  <input
                    id="email" name="email" type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={onChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="field-input"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="focus-bar" />
              </div>

              {/* Password */}
              <div className={`field ${focusedField === "password" ? "focused" : ""}`}>
                <label htmlFor="password" className="field-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password" name="password" type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="field-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="focus-bar" />
              </div>

              {/* Error */}
              {error && (
                <div className="error-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="btn-wrap">
                <button type="submit" disabled={loading || success} className="submit-btn">
                  {loading ? (
                    <><span className="spinner" />Signing in…</>
                  ) : success ? (
                    <><span className="check-circle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>Done</>
                  ) : (
                    "Sign in →"
                  )}
                </button>
              </div>
            </form>

            {/* Divider + register */}
            <div className="divider">
              <span /><p>New here?</p><span />
            </div>
            <p className="register-row">
              Don't have an account?{" "}
              <Link to={PATHS.REGISTER} className="register-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;