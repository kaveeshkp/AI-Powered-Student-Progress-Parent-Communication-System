import { useState } from 'react';
import { useAsync, useFormError } from '../hooks/useAsync';
import api from '../services/apiClient';

/**
 * Example Component Showing Error Handling Patterns
 * This demonstrates best practices for error handling in React
 */

// ============================================================================
// Example 1: Using useAsync Hook
// ============================================================================
function StudentListExample() {
  const { data, loading, error, retry } = useAsync(
    () => api.get('/students'),
    true
  );

  if (loading) {
    return <div className="p-4">Loading students...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-900">Failed to load students</h3>
        <p className="text-sm text-red-700">{error.message}</p>
        <button
          onClick={retry}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold mb-4">Students</h2>
      <ul>
        {data?.map((student) => (
          <li key={student.id} className="p-2 border-b">
            {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Example 2: Using useFormError Hook
// ============================================================================
function LoginFormExample() {
  const { error, fieldErrors, handleError, clearError, setFieldError } =
    useFormError();
  const [formData, setFormData] = useState({ email: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    try {
      // Validate
      if (!formData.email) {
        setFieldError('email', 'Email is required');
        return;
      }
      if (!formData.password) {
        setFieldError('password', 'Password is required');
        return;
      }

      // Submit
      await api.post('/login', formData);
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded ${
            fieldErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={`w-full px-3 py-2 border rounded ${
            fieldErrors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}

// ============================================================================
// Example 3: Try-Catch with Error Handling
// ============================================================================
function DataFetchExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/data');
      setData(response);
    } catch (err) {
      // Error is automatically converted to APIError with message
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={loadData}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load Data'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ============================================================================
// Example 4: Error Recovery Pattern
// ============================================================================
function ErrorRecoveryExample() {
  const [attempt, setAttempt] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  async function handleError(err) {
    setAttempt((prev) => prev + 1);

    if (attempt < 2) {
      setIsRecovering(true);
      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsRecovering(false);
      // Retry logic here
    } else {
      // Too many retries, show permanent error
    }
  }

  return (
    <div>
      Attempt: {attempt}
      {isRecovering && <p>Recovering...</p>}
    </div>
  );
}

// ============================================================================
// Export Examples
// ============================================================================
export {
  StudentListExample,
  LoginFormExample,
  DataFetchExample,
  ErrorRecoveryExample,
};
