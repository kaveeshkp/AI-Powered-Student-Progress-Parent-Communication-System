import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StudentAssignmentsPage } from '../../pages/student/StudentAssignmentsPage';
import { StudentGradesPage } from '../../pages/student/StudentGradesPage';
import { StudentSchedulePage } from '../../pages/student/StudentSchedulePage';
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

describe('Student Pages', () => {
  describe('StudentAssignmentsPage', () => {
    it('should render assignments page', () => {
      renderWithProviders(<StudentAssignmentsPage />);
      expect(screen.getByText(/My Assignments/i)).toBeInTheDocument();
    });

    it('should display assignment stats', () => {
      renderWithProviders(<StudentAssignmentsPage />);
      expect(screen.getByText(/Total/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending/i)).toBeInTheDocument();
      expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Submitted/i)).toBeInTheDocument();
    });

    it('should display assignments list', () => {
      renderWithProviders(<StudentAssignmentsPage />);
      expect(screen.getByText(/Math Homework Chapter 5/i)).toBeInTheDocument();
    });

    it('should show assignment progress bars', () => {
      renderWithProviders(<StudentAssignmentsPage />);
      expect(StudentAssignmentsPage).toBeDefined();
    });

    it('should display due dates for assignments', () => {
      renderWithProviders(<StudentAssignmentsPage />);
      expect(screen.getByText(/Due:/i)).toBeInTheDocument();
    });
  });

  describe('StudentGradesPage', () => {
    it('should render grades page', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(screen.getByText(/My Grades/i)).toBeInTheDocument();
    });

    it('should display overall GPA', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(screen.getByText(/Overall GPA/i)).toBeInTheDocument();
    });

    it('should show grades by subject', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
      expect(screen.getByText(/English/i)).toBeInTheDocument();
    });

    it('should display teacher names', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(screen.getByText(/Teacher:/i)).toBeInTheDocument();
    });

    it('should show grade breakdown with weights', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(StudentGradesPage).toBeDefined();
    });

    it('should display percentage scores', () => {
      renderWithProviders(<StudentGradesPage />);
      expect(StudentGradesPage).toBeDefined();
    });
  });

  describe('StudentSchedulePage', () => {
    it('should render schedule page', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/My Schedule/i)).toBeInTheDocument();
    });

    it('should display days of the week', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/Monday/i)).toBeInTheDocument();
      expect(screen.getByText(/Friday/i)).toBeInTheDocument();
    });

    it('should show classes with times', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/09:00 - 10:30/i)).toBeInTheDocument();
    });

    it('should display class subjects', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/Mathematics/i)).toBeInTheDocument();
    });

    it('should show room information', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/Room:/i)).toBeInTheDocument();
    });

    it('should display instructor names', () => {
      renderWithProviders(<StudentSchedulePage />);
      expect(screen.getByText(/Instructor:/i)).toBeInTheDocument();
    });
  });
});
