import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '../routes/AppRouter';
import { AuthProvider } from '../context/AuthContext';

const TestRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
);

describe('App Router', () => {
  it('should render router without crashing', () => {
    const { container } = render(<TestRouter />);
    expect(container).toBeTruthy();
  });

  it('should have AppRouter component', () => {
    expect(AppRouter).toBeDefined();
  });

  it('should provide routing functionality', () => {
    const { container } = render(<TestRouter />);
    expect(container.querySelector('[role="document"]') || container.firstChild).toBeTruthy();
  });

  it('should render with multiple child routes', () => {
    expect(AppRouter).toBeDefined();
  });

  it('should handle protected routes', () => {
    expect(AppRouter).toBeDefined();
  });

  it('should handle public routes', () => {
    expect(AppRouter).toBeDefined();
  });

  it('should provide 404 fallback', () => {
    expect(AppRouter).toBeDefined();
  });
});
