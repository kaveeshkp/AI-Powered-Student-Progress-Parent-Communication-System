import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Logout Functionality', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('DashboardLayout - Logout button redirects to login page', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardLayout>
            <div>Dashboard Content</div>
          </DashboardLayout>
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('AdminDashboardPro - Sign Out button redirects to login page', async () => {
    const AdminDashboardPro = require('../pages/admin/AdminDashboardPro').default;

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminDashboardPro />
        </AuthProvider>
      </BrowserRouter>
    );

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('Auth token is cleared after logout', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardLayout>
            <div>Dashboard Content</div>
          </DashboardLayout>
        </AuthProvider>
      </BrowserRouter>
    );

    // Verify token exists before logout
    let token = localStorage.getItem('authToken');
    expect(token).toBeTruthy();

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      token = localStorage.getItem('authToken');
      expect(token).toBeNull();
    });
  });
});
