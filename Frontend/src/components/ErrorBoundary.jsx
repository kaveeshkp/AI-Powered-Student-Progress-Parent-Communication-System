import { Component } from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * Global Error Boundary Component
 * Catches errors in the entire component tree and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error Info:', errorInfo);
    }

    // Update state with error details
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external error tracking service (e.g., Sentry)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would send to an error tracking service like Sentry, LogRocket, etc.
    try {
      const errorData = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example: Send to your error logging backend
      // fetch('/api/logs/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData),
      // }).catch(() => {
      //   // Silent fail - don't break the app if logging fails
      // });

      // For now, store in localStorage for debugging
      const errors = JSON.parse(localStorage.getItem('appErrors') || '[]');
      errors.push(errorData);
      localStorage.setItem('appErrors', JSON.stringify(errors.slice(-10))); // Keep last 10
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          isDevelopment={process.env.NODE_ENV === 'development'}
          errorInfo={this.state.errorInfo}
          errorCount={this.state.errorCount}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;
