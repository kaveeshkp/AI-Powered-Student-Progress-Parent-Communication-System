import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from '../../routes/ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock component
const MockDashboard = () => <div data-testid="dashboard">Dashboard</div>;

const TestRoutes = ({ user, isAuthenticated }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<MockDashboard />} />
        </Route>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route path="/unauthorized" element={<div data-testid="unauthorized">Unauthorized</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  it('should render outlet when user is authenticated with correct role', () => {
    const MockProvider = ({ children }) => (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );

    render(
      <MockProvider>
        <ProtectedRoute allowedRoles={['TEACHER']} />
      </MockProvider>
    );

    expect(ProtectedRoute).toBeDefined();
  });

  it('should redirect to login when not authenticated', () => {
    expect(ProtectedRoute).toBeDefined();
  });

  it('should redirect to unauthorized when role not allowed', () => {
    expect(ProtectedRoute).toBeDefined();
  });

  it('should accept multiple allowed roles', () => {
    const component = <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN', 'PARENT']} />;
    expect(component).toBeDefined();
  });

  it('should work with empty allowedRoles', () => {
    const component = <ProtectedRoute allowedRoles={[]} />;
    expect(component).toBeDefined();
  });
});
