import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-6">
          <p className="text-9xl font-bold text-indigo-500/30">404</p>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Oops!
            </p>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(PATHS.HOME)}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-100 hover:bg-slate-700 transition"
          >
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-3">Need help?</p>
          <button
            onClick={() => navigate(PATHS.MESSAGES)}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}
