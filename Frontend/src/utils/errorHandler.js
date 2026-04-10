/**
 * Error Handler Utility
 * Centralized error handling for the application
 */

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }

  static isAPIError(error) {
    return error instanceof APIError;
  }

  static from(error, status = null) {
    if (error instanceof APIError) {
      return error;
    }

    const status_ = status || error.response?.status;
    const message = error.response?.data?.message || error.message || 'An error occurred';

    return new APIError(message, status_, error.response?.data);
  }
}

/**
 * Error Messages by Status Code
 */
export const ERROR_MESSAGES = {
  400: 'Bad request. Please check your input.',
  401: 'Unauthorized. Please log in again.',
  403: 'You do not have permission to access this resource.',
  404: 'Resource not found.',
  409: 'This resource already exists.',
  422: 'Invalid data provided. Please check your input.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
  default: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (APIError.isAPIError(error)) {
    return error.message || ERROR_MESSAGES[error.status] || ERROR_MESSAGES.default;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return ERROR_MESSAGES.default;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error) {
  if (!APIError.isAPIError(error)) {
    return true; // Network errors are retryable
  }

  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.status);
}

/**
 * Handle API Errors
 */
export function handleAPIError(error) {
  const apiError = APIError.from(error);

  // Log error based on severity
  if (apiError.status >= 500) {
    console.error('Server Error:', apiError);
  } else if (apiError.status >= 400) {
    console.warn('Client Error:', apiError);
  } else {
    console.error('Unknown Error:', apiError);
  }

  return apiError;
}

/**
 * Retry Logic
 */
export async function retryWithBackoff(
  fn,
  maxRetries = 3,
  backoffMs = 1000
) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || i === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = backoffMs * Math.pow(2, i);
      console.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms:`, error.message);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Validate Response
 */
export function validateResponse(response) {
  if (!response) {
    throw new APIError('No response received', null, null);
  }

  if (response.status && response.status >= 400) {
    throw new APIError(
      response.data?.message || ERROR_MESSAGES[response.status],
      response.status,
      response.data
    );
  }

  return response;
}

/**
 * Safe Async Execution
 */
export async function safeAsync(fn, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in async operation:', error);
    if (fallback !== null) {
      return fallback;
    }
    throw error;
  }
}
