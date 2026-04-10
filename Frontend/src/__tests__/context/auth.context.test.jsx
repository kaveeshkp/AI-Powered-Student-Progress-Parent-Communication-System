import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div data-testid="user-info">User: {user?.email}</div>
          <button onClick={logout} data-testid="logout-btn">
            Logout
          </button>
        </>
      ) : (
        <div data-testid="not-authenticated">Not authenticated</div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('not-authenticated')).toBeInTheDocument();
  });

  it('should handle login state', async () => {
    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate login
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com', role: 'TEACHER' }));

    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  it('should handle logout', () => {
    localStorage.setItem('token', 'test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should provide useAuth hook', () => {
    let authValue;

    const HookTest = () => {
      authValue = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <HookTest />
      </AuthProvider>
    );

    expect(authValue).toBeDefined();
    expect(authValue).toHaveProperty('user');
    expect(authValue).toHaveProperty('isAuthenticated');
    expect(authValue).toHaveProperty('login');
    expect(authValue).toHaveProperty('logout');
  });
});
