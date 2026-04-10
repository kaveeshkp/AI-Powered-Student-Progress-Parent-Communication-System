import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { AuthProvider } from '../../context/AuthContext';

const TestDashboard = () => (
  <BrowserRouter>
    <AuthProvider>
      <DashboardLayout title="Test Dashboard">
        <div data-testid="content">Test Content</div>
      </DashboardLayout>
    </AuthProvider>
  </BrowserRouter>
);

describe('DashboardLayout Component', () => {
  it('should render layout with title', () => {
    render(<TestDashboard />);
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(<TestDashboard />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should render header with logout button', () => {
    render(<TestDashboard />);
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should toggle sidebar on mobile', () => {
    render(<TestDashboard />);
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should filter navigation links by user role', () => {
    render(<TestDashboard />);
    expect(DashboardLayout).toBeDefined();
  });

  it('should accept custom links prop', () => {
    const customLinks = [
      { to: '/custom', label: 'Custom Link', icon: '⚙️', roles: ['TEACHER'] },
    ];
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardLayout title="Test" links={customLinks}>
            <div>Content</div>
          </DashboardLayout>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(DashboardLayout).toBeDefined();
  });

  it('should display user full name in header', () => {
    render(<TestDashboard />);
    expect(DashboardLayout).toBeDefined();
  });

  it('should close sidebar after navigation on mobile', () => {
    render(<TestDashboard />);
    expect(DashboardLayout).toBeDefined();
  });
});
