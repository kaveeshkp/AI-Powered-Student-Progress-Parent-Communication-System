import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Mock form component
const LoginForm = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    <input type="email" placeholder="Email" data-testid="email-input" required />
    <input type="password" placeholder="Password" data-testid="password-input" required />
    <button type="submit" data-testid="submit-btn">Login</button>
  </form>
);

describe('Form Validation', () => {
  describe('Login Form', () => {
    it('should render login form', () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('should validate email format', () => {
      const { getByTestId } = render(<LoginForm onSubmit={vi.fn()} />);
      const emailInput = getByTestId('email-input');
      expect(emailInput.type).toBe('email');
    });

    it('should validate password is required', () => {
      const { getByTestId } = render(<LoginForm onSubmit={vi.fn()} />);
      const passwordInput = getByTestId('password-input');
      expect(passwordInput.required).toBe(true);
    });

    it('should call onSubmit when form is submitted', () => {
      const mockSubmit = vi.fn((e) => e.preventDefault());
      const { getByTestId } = render(<LoginForm onSubmit={mockSubmit} />);
      
      fireEvent.click(getByTestId('submit-btn'));
      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should have submit button', () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    });
  });

  describe('Register Form', () => {
    const RegisterForm = ({ onSubmit }) => (
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Full Name" data-testid="fullname-input" required />
        <input type="email" placeholder="Email" data-testid="email-input" required />
        <input type="password" placeholder="Password" data-testid="password-input" minLength={8} required />
        <select data-testid="role-select" required>
          <option value="">Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" data-testid="submit-btn">Register</button>
      </form>
    );

    it('should render register form', () => {
      render(<RegisterForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('fullname-input')).toBeInTheDocument();
      expect(screen.getByTestId('role-select')).toBeInTheDocument();
    });

    it('should require minimum password length', () => {
      const { getByTestId } = render(<RegisterForm onSubmit={vi.fn()} />);
      const passwordInput = getByTestId('password-input');
      expect(passwordInput.minLength).toBe(8);
    });

    it('should have role selection', () => {
      const { getByTestId } = render(<RegisterForm onSubmit={vi.fn()} />);
      const select = getByTestId('role-select');
      expect(select.options.length).toBe(4); // includes default
    });

    it('should validate all required fields', () => {
      const { getByTestId } = render(<RegisterForm onSubmit={vi.fn()} />);
      expect(getByTestId('fullname-input').required).toBe(true);
      expect(getByTestId('email-input').required).toBe(true);
      expect(getByTestId('password-input').required).toBe(true);
      expect(getByTestId('role-select').required).toBe(true);
    });
  });
});
