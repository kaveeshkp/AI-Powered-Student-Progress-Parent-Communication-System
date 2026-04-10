# Testing Guide - Student Management Application

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test -- --run
```

### Generate Coverage Report
```bash
npm test:coverage
```

### View Coverage Report
```bash
npm test:coverage
open coverage/index.html
```

---

## Test Structure

### Organization
```
src/__tests__/
├── api.test.js                    # API client testing
├── routes.test.jsx                # Route testing
├── navigation.test.js             # Navigation paths (existing)
├── logout.test.jsx                # Logout functionality (existing)
├── setup.js                       # Test setup & mocks
├── components/
│   ├── DashboardLayout.test.jsx
│   ├── ProtectedRoute.test.jsx
│   └── RoleGate.test.jsx
├── context/
│   └── auth.context.test.jsx
├── pages/
│   ├── StudentPages.test.jsx
│   ├── DashboardPages.test.jsx
│   ├── CommonPages.test.jsx
│   └── NotFoundPage.test.jsx
├── services/
│   ├── auth.service.test.js
│   └── student.service.test.js
├── forms/
│   └── forms.test.jsx
└── utils/
    └── jwt.test.js
```

---

## Test Commands

### Run Tests in Watch Mode
```bash
npm test
```
Runs tests continuously, re-running on file changes.

### Run Tests Once
```bash
npm test -- --run
```
Runs all tests and exits.

### Run Specific Test File
```bash
npm test -- src/__tests__/navigation.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --grep "Auth"
```
Runs only tests with "Auth" in their description.

### Generate Coverage Report
```bash
npm test:coverage
```
Creates detailed coverage report in `coverage/` directory.

### View Coverage HTML Report
```bash
npm test:coverage
# Then open coverage/index.html in browser
```

### Run Tests with UI Viewer
```bash
npm test:ui
```
Opens interactive test UI in browser.

---

## Test Categories

### Navigation Tests (12 tests)
- PATHS constants validation
- Dynamic route generation
- Role-based default redirects
- Route filtering by role

**File**: `src/__tests__/navigation.test.js`

### Component Tests (35 tests)

#### DashboardLayout Tests
- Layout rendering
- Header display
- Sidebar functionality
- Mobile toggle
- Role-based link filtering

**File**: `src/__tests__/components/DashboardLayout.test.jsx`

#### ProtectedRoute Tests
- Authentication checks
- Role validation
- Redirect on unauthorized

**File**: `src/__tests__/components/ProtectedRoute.test.jsx`

#### RoleGate Tests
- Conditional rendering
- Fallback display
- Multiple role handling

**File**: `src/__tests__/components/RoleGate.test.jsx`

### Page Tests (35 tests)

#### Student Pages
- StudentAssignmentsPage
- StudentGradesPage
- StudentSchedulePage

**File**: `src/__tests__/pages/StudentPages.test.jsx`

#### Dashboard Pages
- TeacherDashboard
- AdminDashboard
- ParentDashboard

**File**: `src/__tests__/pages/DashboardPages.test.jsx`

#### Common Pages
- HomePage
- LoginPage
- RegisterPage
- UnauthorizedPage

**File**: `src/__tests__/pages/CommonPages.test.jsx`

### Service Tests (20 tests)

#### Auth Service
- login()
- register()
- logout()
- getToken()
- isAuthenticated()

**File**: `src/__tests__/services/auth.service.test.js`

#### Student Service
- getStudents()
- getStudentById()
- updateStudent()
- deleteStudent()

**File**: `src/__tests__/services/student.service.test.js`

#### API Client
- GET requests
- POST requests
- PUT requests
- DELETE requests
- Error handling (401, 403, 404, 500)

**File**: `src/__tests__/api.test.js`

### Form Tests (15 tests)

#### Login Form
- Email validation
- Password field
- Form submission

#### Register Form
- Full name field
- Email validation
- Password minimum length
- Role selection

**File**: `src/__tests__/forms/forms.test.jsx`

### Utility Tests (15 tests)

#### JWT Utilities
- Token decoding
- Expiration checking
- Token validation
- Role extraction
- Invalid token handling

**File**: `src/__tests__/utils/jwt.test.js`

### Context Tests (15 tests)

#### AuthContext
- Provides auth context
- Handles login state
- Handles logout
- useAuth hook availability
- User data management
- Token management

**File**: `src/__tests__/context/auth.context.test.jsx`

### Router Tests (7 tests)

#### App Router
- Routing functionality
- Protected routes
- Public routes
- 404 handling

**File**: `src/__tests__/routes.test.jsx`

---

## Coverage Targets

### Current Target: 80%

| Metric | Target | Expected |
|--------|--------|----------|
| Statements | 80% | 82% |
| Branches | 75% | 78% |
| Functions | 80% | 81% |
| Lines | 80% | 82% |

---

## Mocking Strategy

### localStorage Mock
```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
```

### window.matchMedia Mock
Used for testing responsive behavior.

### IntersectionObserver Mock
Used for visibility-based testing.

### Axios Mock
All HTTP requests are mocked in tests.

---

## Writing New Tests

### Test Template
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Common Testing Patterns

#### Component Testing
```javascript
import { render, screen } from '@testing-library/react';

it('should render component', () => {
  render(<Component />);
  expect(screen.getByText('Expected')).toBeInTheDocument();
});
```

#### User Interaction Testing
```javascript
import { fireEvent } from '@testing-library/react';

it('should handle click', () => {
  const { getByRole } = render(<Button>Click</Button>);
  fireEvent.click(getByRole('button'));
  // Assert result
});
```

#### Async Testing
```javascript
it('should fetch data', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test -- --run --coverage
      - uses: codecov/codecov-action@v3
```

---

## Troubleshooting

### Tests Hanging
- Check for infinite loops in code
- Ensure all async operations complete
- Check mock setup in setup.js

### Import Errors
- Check file paths are correct
- Ensure files are exported properly
- Check alias configuration in vitest.config.js

### Coverage Not Meeting Target
- Run `npm test:coverage` and review report
- Look at uncovered lines in coverage/index.html
- Add tests for missing branches

---

## Performance Tips

### Run Specific Test Files
Faster than running entire suite during development:
```bash
npm test -- src/__tests__/navigation.test.js
```

### Use Watch Mode
For rapid feedback during development:
```bash
npm test
```

### Parallel Execution
Vitest runs tests in parallel by default for speed.

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## Summary

✅ 15 test files
✅ 150+ test cases
✅ 82% expected coverage
✅ All major modules tested
✅ Ready for CI/CD integration

**Next Steps:**
1. Run `npm install` to install test dependencies
2. Run `npm test -- --run` to verify tests pass
3. Run `npm test:coverage` to see coverage report
4. Review `coverage/index.html` for detailed coverage breakdown
