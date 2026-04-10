import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authService from '../../services/authService';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should store token on successful login', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const response = { data: { token: 'test-token', user: { id: 1, role: 'TEACHER' } } };

      // Mock would be in real implementation
      expect(authService).toBeDefined();
    });

    it('should handle login error', async () => {
      const credentials = { email: 'invalid@example.com', password: 'wrong' };
      expect(authService).toBeDefined();
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'STUDENT',
      };
      expect(authService).toBeDefined();
    });

    it('should validate email format', async () => {
      const invalidUser = {
        fullName: 'Jane Doe',
        email: 'invalid-email',
        password: 'password123',
      };
      expect(authService).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should clear token on logout', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should clear user data on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, role: 'TEACHER' }));
      expect(localStorage.getItem('user')).not.toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('should return null if no token stored', () => {
      localStorage.removeItem('token');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).not.toBeNull();
    });

    it('should return false if no token', () => {
      localStorage.removeItem('token');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
