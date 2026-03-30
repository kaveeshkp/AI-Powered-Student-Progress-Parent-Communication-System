// ======================================================================
// CARD & CONTAINER COMPONENTS
// ======================================================================

export function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur ${className}`}>
      {children}
    </section>
  );
}

export function CardHeader({ title, subtitle, badge, action }) {
  return (
    <div className="mb-4 flex items-start justify-between border-b border-slate-800 pb-4">
      <div>
        {subtitle && <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">{subtitle}</p>}
        <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
            {badge}
          </span>
        )}
        {action && action}
      </div>
    </div>
  );
}

// ======================================================================
// STATUS & MESSAGE COMPONENTS
// ======================================================================

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-lg">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-lg">
      {message}
    </div>
  );
}

export function InfoBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100 shadow-lg">
      {message}
    </div>
  );
}

// ======================================================================
// LOADING SKELETONS
// ======================================================================

export function SkeletonLine({ className = "" }) {
  return <div className={`h-3 rounded-full bg-slate-800 animate-pulse ${className}`} />;
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`rounded-xl bg-slate-800/60 animate-pulse ${className}`} />;
}

export function SkeletonRow() {
  return <div className="h-12 rounded-lg bg-slate-800/60 animate-pulse" />;
}

export function SkeletonTable({ rows = 3, cols = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock key={j} className="h-10" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ======================================================================
// BADGE & LABEL COMPONENTS
// ======================================================================

export function Badge({ children, variant = "primary", size = "md" }) {
  const variants = {
    primary: "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30",
    success: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
    error: "bg-red-500/20 text-red-200 border border-red-500/30",
    neutral: "bg-slate-700 text-slate-100 border border-slate-600"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm"
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const statusMap = {
    present: { badge: "Present", variant: "success" },
    absent: { badge: "Absent", variant: "error" },
    late: { badge: "Late", variant: "warning" },
    active: { badge: "Active", variant: "success" },
    inactive: { badge: "Inactive", variant: "neutral" },
    pending: { badge: "Pending", variant: "warning" }
  };

  const config = statusMap[status?.toLowerCase()] || { badge: status, variant: "neutral" };
  return <Badge variant={config.variant}>{config.badge}</Badge>;
}

// ======================================================================
// BUTTON COMPONENTS
// ======================================================================

export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600",
    outline: "border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-500/10",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
    md: "px-4 py-2 text-sm font-semibold rounded-lg",
    lg: "px-6 py-3 text-base font-semibold rounded-xl"
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition ${variants[variant]} ${sizes[size]} disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ======================================================================
// TABLE COMPONENTS
// ======================================================================

export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 ${className}`}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="border-b-2 border-slate-800 bg-slate-900/60">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeader({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, isHoverable = true }) {
  return (
    <tr className={`border-b border-slate-800/70 ${isHoverable ? "hover:bg-slate-800/30 transition" : ""}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, isHeader = false }) {
  return (
    <td className={isHeader ? "px-4 py-3 font-semibold text-white" : "px-4 py-3 text-sm text-slate-200"}>
      {children}
    </td>
  );
}

// ======================================================================
// STAT & METRIC COMPONENTS
// ======================================================================

export function StatCard({ label, value, tone = "indigo", loading = false, subtitle = "" }) {
  const toneMap = {
    indigo: "from-indigo-500/20 to-indigo-400/10 text-indigo-100 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-400/10 text-emerald-100 border-emerald-500/30",
    amber: "from-amber-500/20 to-amber-400/10 text-amber-100 border-amber-500/30",
    red: "from-red-500/20 to-red-400/10 text-red-100 border-red-500/30"
  };

  const toneClass = toneMap[tone] || toneMap.indigo;

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneClass} p-4 shadow-lg`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">{label}</p>
      {loading ? (
        <SkeletonLine className="mt-2 w-full" />
      ) : (
        <>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-300">{subtitle}</p>}
        </>
      )}
    </div>
  );
}

// ======================================================================
// ALERT & NOTIFICATION COMPONENTS
// ======================================================================

export function AlertCard({ title, detail, severity = "info" }) {
  const toneMap = {
    info: "border-indigo-400/60 text-indigo-100 bg-indigo-500/10",
    warning: "border-amber-400/60 text-amber-100 bg-amber-500/10",
    success: "border-emerald-400/60 text-emerald-100 bg-emerald-500/10",
    error: "border-red-400/60 text-red-100 bg-red-500/10"
  };

  const tone = toneMap[severity] || toneMap.info;
  return (
    <div className={`rounded-lg border ${tone} px-3 py-3 text-sm`}>
      <p className="font-semibold">{title}</p>
      <p className="text-slate-200/90">{detail}</p>
    </div>
  );
}
