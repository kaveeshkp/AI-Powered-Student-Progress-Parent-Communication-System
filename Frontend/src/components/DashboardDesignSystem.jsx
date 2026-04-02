import { Link } from "react-router-dom";
import { Card, SkeletonLine } from "./UiPrimitives";

export function PageHero({ eyebrow, title, description, action, accent = "indigo" }) {
  const accentMap = {
    indigo: "to-indigo-950/40",
    cyan: "to-cyan-950/40",
    amber: "to-amber-950/40"
  };

  const eyebrowClassMap = {
    indigo: "text-indigo-300/80",
    cyan: "text-cyan-300/80",
    amber: "text-amber-300/80"
  };

  return (
    <section className={`rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 ${accentMap[accent] || accentMap.indigo} p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className={`text-xs uppercase tracking-[0.24em] ${eyebrowClassMap[accent] || eyebrowClassMap.indigo}`}>{eyebrow}</p> : null}
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h1>
          {description ? <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

export function SectionCard({ eyebrow, title, description, badge, children, className = "", accent = "indigo" }) {
  const accentMap = {
    indigo: {
      eyebrow: "text-indigo-300/80",
      badge: "border-indigo-500/30 bg-indigo-500/15 text-indigo-200"
    },
    cyan: {
      eyebrow: "text-cyan-300/80",
      badge: "border-cyan-500/30 bg-cyan-500/15 text-cyan-200"
    },
    amber: {
      eyebrow: "text-amber-300/80",
      badge: "border-amber-500/30 bg-amber-500/15 text-amber-200"
    }
  };

  const tone = accentMap[accent] || accentMap.indigo;

  return (
    <Card className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className={`text-xs uppercase tracking-[0.24em] ${tone.eyebrow}`}>{eyebrow}</p> : null}
          <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p> : null}
        </div>

        {badge ? (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}>
            {badge}
          </span>
        ) : null}
      </div>

      {children}
    </Card>
  );
}

export function MetricCard({ label, value, helper, tone = "indigo", loading = false }) {
  const toneMap = {
    indigo: "from-indigo-500/20 to-indigo-400/5 border-indigo-500/30",
    cyan: "from-cyan-500/20 to-cyan-400/5 border-cyan-500/30",
    emerald: "from-emerald-500/20 to-emerald-400/5 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-400/5 border-amber-500/30",
    red: "from-red-500/20 to-red-400/5 border-red-500/30"
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${toneMap[tone] || toneMap.indigo} p-5 shadow-lg`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">{label}</p>
      {loading ? (
        <div className="mt-3">
          <SkeletonLine />
        </div>
      ) : (
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      )}
      {helper ? <p className="mt-2 text-sm leading-6 text-slate-300">{helper}</p> : null}
    </div>
  );
}

export function ActionButton({ to, title, subtitle, tone = "secondary" }) {
  const toneMap = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-400 shadow-md",
    secondary: "border border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20",
    cyan: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20",
    "cyan-outline": "border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
  };

  const classes = toneMap[tone] || toneMap.secondary;

  return (
    <Link to={to} className={`rounded-2xl px-4 py-3 transition ${classes}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs opacity-90">{subtitle}</div>
    </Link>
  );
}

export function InfoNote({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-800/50 p-4 text-sm text-slate-300 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyStatePanel({ title, detail, action, accent = "indigo" }) {
  const toneMap = {
    indigo: "border-indigo-500/20 bg-indigo-950/20",
    cyan: "border-cyan-500/20 bg-cyan-950/20",
    amber: "border-amber-500/20 bg-amber-950/20"
  };

  return (
    <div className={`mt-4 rounded-2xl border p-6 text-center ${toneMap[accent] || toneMap.indigo}`}>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
