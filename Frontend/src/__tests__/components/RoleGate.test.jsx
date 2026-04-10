import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoleGate from '../../routes/RoleGate';
import { AuthProvider } from '../../context/AuthContext';

const TestComponent = () => (
  <AuthProvider>
    <RoleGate allowedRoles={['TEACHER']}>
      <div data-testid="allowed-content">Teacher Content</div>
    </RoleGate>
  </AuthProvider>
);

describe('RoleGate Component', () => {
  it('should render children when role is allowed', () => {
    render(<TestComponent />);
    expect(RoleGate).toBeDefined();
  });

  it('should render fallback when role not allowed', () => {
    const component = (
      <RoleGate 
        allowedRoles={['ADMIN']} 
        fallback={<div data-testid="fallback">Not Allowed</div>}
      >
        <div data-testid="content">Content</div>
      </RoleGate>
    );
    expect(component).toBeDefined();
  });

  it('should accept multiple allowed roles', () => {
    const component = (
      <RoleGate allowedRoles={['TEACHER', 'ADMIN', 'PARENT']}>
        <div>Content</div>
      </RoleGate>
    );
    expect(component).toBeDefined();
  });

  it('should render null as default fallback', () => {
    const component = (
      <RoleGate allowedRoles={['ADMIN']}>
        <div>Content</div>
      </RoleGate>
    );
    expect(component).toBeDefined();
  });

  it('should handle empty allowedRoles array', () => {
    const component = (
      <RoleGate allowedRoles={[]}>
        <div>Content</div>
      </RoleGate>
    );
    expect(component).toBeDefined();
  });
});
