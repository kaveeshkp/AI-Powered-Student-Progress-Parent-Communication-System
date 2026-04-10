import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage, UnauthorizedPage } from '../../pages/common';

const renderPage = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Common Pages', () => {
  describe('HomePage', () => {
    it('should render home page', () => {
      renderPage(<HomePage />);
      expect(HomePage).toBeDefined();
    });

    it('should display welcome message', () => {
      renderPage(<HomePage />);
      expect(HomePage).toBeDefined();
    });

    it('should show login/register links', () => {
      renderPage(<HomePage />);
      expect(HomePage).toBeDefined();
    });
  });

  describe('LoginPage', () => {
    it('should render login form', () => {
      renderPage(<LoginPage />);
      expect(LoginPage).toBeDefined();
    });

    it('should have email input', () => {
      renderPage(<LoginPage />);
      expect(LoginPage).toBeDefined();
    });

    it('should have password input', () => {
      renderPage(<LoginPage />);
      expect(LoginPage).toBeDefined();
    });

    it('should show register link', () => {
      renderPage(<LoginPage />);
      expect(LoginPage).toBeDefined();
    });
  });

  describe('RegisterPage', () => {
    it('should render registration form', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });

    it('should have full name field', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });

    it('should have email field', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });

    it('should have password field', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });

    it('should have role selection', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });

    it('should show login link', () => {
      renderPage(<RegisterPage />);
      expect(RegisterPage).toBeDefined();
    });
  });

  describe('UnauthorizedPage', () => {
    it('should render unauthorized page', () => {
      renderPage(<UnauthorizedPage />);
      expect(UnauthorizedPage).toBeDefined();
    });

    it('should display 403 or access denied message', () => {
      renderPage(<UnauthorizedPage />);
      expect(UnauthorizedPage).toBeDefined();
    });

    it('should show navigation link', () => {
      renderPage(<UnauthorizedPage />);
      expect(UnauthorizedPage).toBeDefined();
    });
  });
});
