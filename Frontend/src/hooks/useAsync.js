import { useState, useCallback } from 'react';
import { getErrorMessage, isRetryableError } from '../utils/errorHandler';

/**
 * Custom Hook for API Calls with Error Handling
 */
export function useAsync(
  asyncFunction,
  immediate = true,
  dependencies = []
) {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
    retrying: false,
    retryCount: 0,
  });

  const execute = useCallback(
    async (onSuccess = null, onError = null) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        retrying: false,
      }));

      try {
        const response = await asyncFunction();
        setState({
          data: response,
          loading: false,
          error: null,
          retrying: false,
          retryCount: 0,
        });
        onSuccess?.(response);
        return response;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState({
          data: null,
          loading: false,
          error: {
            message: errorMessage,
            original: error,
            retryable: isRetryableError(error),
          },
          retrying: false,
          retryCount: 0,
        });
        onError?.(error);
        throw error;
      }
    },
    [asyncFunction]
  );

  const retry = useCallback(
    async (onSuccess = null, onError = null) => {
      setState((prev) => ({
        ...prev,
        retrying: true,
        retryCount: Math.min(prev.retryCount + 1, 3),
      }));

      try {
        const response = await asyncFunction();
        setState({
          data: response,
          loading: false,
          error: null,
          retrying: false,
        });
        onSuccess?.(response);
        return response;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState({
          data: null,
          loading: false,
          error: {
            message: errorMessage,
            original: error,
            retryable: isRetryableError(error),
          },
          retrying: false,
        });
        onError?.(error);
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retrying: false,
      retryCount: 0,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, execute, retry, reset };
}

import { useEffect } from 'react';

/**
 * Custom Hook for Form Error Handling
 */
export function useFormError(initialError = null) {
  const [error, setError] = useState(initialError);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleError = useCallback((err) => {
    if (typeof err === 'string') {
      setError(err);
    } else if (err?.fieldErrors) {
      setFieldErrors(err.fieldErrors);
      setError(err.message || 'Please correct the errors below');
    } else {
      setError(getErrorMessage(err));
    }
  }, []);

  const setFieldError = useCallback((field, error) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  return {
    error,
    fieldErrors,
    hasErrors: !!error || Object.keys(fieldErrors).length > 0,
    handleError,
    setError,
    setFieldError,
    clearFieldError,
    clearError,
  };
}

/**
 * Hook for Managing Multiple Async Requests
 */
export function useAsyncGroup(requests = {}) {
  const [state, setState] = useState(() => 
    Object.keys(requests).reduce((acc, key) => ({
      ...acc,
      [key]: {
        data: null,
        loading: true,
        error: null,
      },
    }), {})
  );

  useEffect(() => {
    const executeRequests = async () => {
      const results = {};

      for (const [key, asyncFn] of Object.entries(requests)) {
        try {
          const data = await asyncFn();
          results[key] = {
            data,
            loading: false,
            error: null,
          };
        } catch (error) {
          results[key] = {
            data: null,
            loading: false,
            error: {
              message: getErrorMessage(error),
              original: error,
            },
          };
        }
      }

      setState(results);
    };

    if (Object.keys(requests).length > 0) {
      executeRequests();
    }
  }, [requests]);

  const loading = Object.values(state).some((item) => item.loading);
  const errors = Object.entries(state)
    .filter(([, item]) => item.error)
    .map(([key, item]) => ({ key, ...item.error }));

  return {
    ...state,
    loading,
    hasErrors: errors.length > 0,
    errors,
  };
}
