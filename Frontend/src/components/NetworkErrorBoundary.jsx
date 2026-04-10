import { useEffect, useState } from 'react';

/**
 * Network Error Boundary
 * Detects network connectivity issues
 */
function NetworkErrorBoundary({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.warn('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.332a9 9 0 11-4.08-15.5m12.318 12.318A9.001 9.001 0 0012 2.002M12 2v10m0 0l3-3m-3 3l-3-3"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            No Internet Connection
          </h2>
          <p className="text-center text-gray-600 mb-6">
            You appear to be offline. Please check your internet connection and try again.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Connection
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            The app will automatically resume once your connection is restored.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default NetworkErrorBoundary;
