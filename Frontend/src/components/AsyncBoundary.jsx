import { useEffect, useState } from 'react';

/**
 * Async Boundary Component
 * Catches errors in async operations and API calls
 */
function AsyncBoundary({ children, onError, fallback }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason);
      onError?.(event.reason);
      // Prevent the error from crashing the app
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, [onError]);

  if (error) {
    return (
      fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900">Async Error</h3>
          <p className="text-sm text-red-700 mt-1">{error.message || 'An error occurred'}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      )
    );
  }

  return children;
}

export default AsyncBoundary;
