export function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur ${className}`}>
      {children}
    </section>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-lg">
      {message}
    </div>
  );
}

export function SkeletonLine({ className = "" }) {
  return <div className={`h-3 rounded-full bg-slate-800 animate-pulse ${className}`} />;
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`rounded-xl bg-slate-800/60 animate-pulse ${className}`} />;
}
