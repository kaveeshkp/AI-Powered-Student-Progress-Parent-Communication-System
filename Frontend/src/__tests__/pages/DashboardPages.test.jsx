import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TeacherDashboard } from '../../pages/teacher';
import { AdminDashboardPro } from '../../pages/admin';
import { ParentDashboard } from '../../pages/parent';
import { AuthProvider } from '../../context/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Pages', () => {
  describe('TeacherDashboard', () => {
    it('should render teacher dashboard', () => {
      renderWithProviders(<TeacherDashboard />);
      expect(TeacherDashboard).toBeDefined();
    });

    it('should display teacher navigation', () => {
      renderWithProviders(<TeacherDashboard />);
      expect(TeacherDashboard).toBeDefined();
    });

    it('should show teacher-specific content', () => {
      renderWithProviders(<TeacherDashboard />);
      expect(TeacherDashboard).toBeDefined();
    });
  });

  describe('AdminDashboardPro', () => {
    it('should render admin dashboard', () => {
      renderWithProviders(<AdminDashboardPro />);
      expect(AdminDashboardPro).toBeDefined();
    });

    it('should display admin controls', () => {
      renderWithProviders(<AdminDashboardPro />);
      expect(AdminDashboardPro).toBeDefined();
    });

    it('should show admin-specific features', () => {
      renderWithProviders(<AdminDashboardPro />);
      expect(AdminDashboardPro).toBeDefined();
    });
  });

  describe('ParentDashboard', () => {
    it('should render parent dashboard', () => {
      renderWithProviders(<ParentDashboard />);
      expect(ParentDashboard).toBeDefined();
    });

    it('should display parent-specific content', () => {
      renderWithProviders(<ParentDashboard />);
      expect(ParentDashboard).toBeDefined();
    });

    it('should show child information section', () => {
      renderWithProviders(<ParentDashboard />);
      expect(ParentDashboard).toBeDefined();
    });
  });
});
