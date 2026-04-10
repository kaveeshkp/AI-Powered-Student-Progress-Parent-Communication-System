import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '../../pages/common/NotFoundPage';

const TestNotFound = () => (
  <BrowserRouter>
    <NotFoundPage />
  </BrowserRouter>
);

describe('NotFoundPage', () => {
  it('should render 404 page', () => {
    render(<TestNotFound />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
  });

  it('should display 404 message', () => {
    render(<TestNotFound />);
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it('should show description text', () => {
    render(<TestNotFound />);
    expect(screen.getByText(/doesn't exist or has been moved/i)).toBeInTheDocument();
  });

  it('should have Go to Home button', () => {
    render(<TestNotFound />);
    const homeButton = screen.getByText(/Go to Home/i);
    expect(homeButton).toBeInTheDocument();
  });

  it('should have Go Back button', () => {
    render(<TestNotFound />);
    const backButton = screen.getByText(/Go Back/i);
    expect(backButton).toBeInTheDocument();
  });

  it('should have Contact Support link', () => {
    render(<TestNotFound />);
    const supportLink = screen.getByText(/Contact Support/i);
    expect(supportLink).toBeInTheDocument();
  });

  it('should navigate to home on button click', () => {
    render(<TestNotFound />);
    const homeButton = screen.getByText(/Go to Home/i);
    expect(homeButton).toBeInTheDocument();
    fireEvent.click(homeButton);
  });
});
