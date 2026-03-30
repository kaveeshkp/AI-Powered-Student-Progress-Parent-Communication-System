import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getClassInsights } from "../services/aiService";

function AIInsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState({ strengths: [], weaknesses: [], suggestions: [] });

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getClassInsights();
      setInsights({
        strengths: data?.strengths || [],
        weaknesses: data?.weaknesses || [],
        suggestions: data?.suggestions || []
      });
    } catch (err) {
      setError(err?.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="AI Insights">
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-lg">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/80">{user?.role || "User"}</p>
          <h1 className="text-xl font-semibold text-white">Data-driven suggestions</h1>
          <p className="text-sm text-slate-300">Generate insights for your class performance.</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating..." : "Generate insights"}
        </button>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <InsightCard title="Strengths" items={insights.strengths} tone="emerald" loading={loading} />
        <InsightCard title="Weaknesses" items={insights.weaknesses} tone="amber" loading={loading} />
        <InsightCard title="Suggestions" items={insights.suggestions} tone="indigo" loading={loading} />
      </div>
    </DashboardLayout>
  );
}

function InsightCard({ title, items = [], tone = "indigo", loading }) {
  const toneMap = {
    indigo: "border-indigo-500/30",
    emerald: "border-emerald-500/30",
    amber: "border-amber-500/30"
  };
  const borderClass = toneMap[tone] || toneMap.indigo;

  return (
    <section className={`rounded-xl border ${borderClass} bg-slate-900/70 p-4 shadow-lg`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {loading ? (
          <span className="text-xs text-slate-400">Loading...</span>
        ) : (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">AI</span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
        </div>
      ) : (
        <ul className="space-y-2 text-sm text-slate-200">
          {items.map((item, idx) => (
            <li key={idx} className="rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SkeletonLine() {
  return <div className="h-3 w-full rounded-full bg-slate-800 animate-pulse" />;
}

export default AIInsightsPage;
