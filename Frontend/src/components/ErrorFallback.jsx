import { useNavigate } from 'react-router-dom';

/**
 * Error Fallback Component
 * Displays when an error is caught by ErrorBoundary
 */
function ErrorFallback({
  error,
  errorInfo,
  resetError,
  isDevelopment = false,
  errorCount = 0,
}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetError();
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 0v2M6.632 15.653l1.414-1.414M17.657 6.343l1.414 1.414M9.172 9.172L7.757 7.757m9.9 9.9l-1.414-1.414M15.828 9.172l1.415-1.415m-9.9 9.9l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="text-center text-gray-600 mb-6">
          We encountered an unexpected error. Our team has been notified and we're working to fix it.
        </p>

        {/* Error Count Info */}
        {errorCount > 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Multiple errors detected ({errorCount}). 
              Please try reloading the page.
            </p>
          </div>
        )}

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
            <details className="cursor-pointer">
              <summary className="font-semibold text-gray-700 hover:text-gray-900">
                Error Details (Development Only)
              </summary>
              <div className="mt-3 space-y-3">
                {/* Error Message */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">Message:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto text-red-600 max-h-24">
                    {error.toString()}
                  </pre>
                </div>

                {/* Stack Trace */}
                {error.stack && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Stack Trace:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto text-gray-700 max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {/* Component Stack */}
                {errorInfo?.componentStack && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Component Stack:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto text-gray-700 max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Home
          </button>
          <button
            onClick={handleReload}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            If the problem persists, please contact support at:
          </p>
          <p className="text-sm font-semibold text-blue-600">
            support@studentapp.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
