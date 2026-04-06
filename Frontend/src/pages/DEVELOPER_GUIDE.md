# Pages Folder - Developer Guide

## Overview

The `pages/` folder is organized by **user role and functionality** to maintain clean code architecture and improve scalability.

## Quick Reference

| Folder | Purpose | Add Page When |
|--------|---------|---------------|
| `common/` | Public pages (auth, landing) | Creating login, register, error pages |
| `teacher/` | Teacher-only features | Adding teacher features |
| `admin/` | Admin-only features | Adding admin management pages |
| `parent/` | Parent-only features | Adding parent features |
| `shared/` | Multi-role features | Feature used by multiple roles |

## How to Add a New Page

### Step 1: Create your page component
```jsx
// src/pages/MyNewPage.jsx
export default function MyNewPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Your module content */}
    </div>
  );
}
```

### Step 2: Add export to the appropriate index.js

**For Teacher Pages:**
```javascript
// src/pages/teacher/index.js - ADD THIS LINE
export { default as MyNewPage } from '../MyNewPage';
```

**For Shared Pages:**
```javascript
// src/pages/shared/index.js - ADD THIS LINE
export { default as MyNewPage } from '../MyNewPage';
```

### Step 3: Update AppRouter.jsx

**Import the new page:**
```javascript
// src/routes/AppRouter.jsx
import { MyNewPage } from "../pages/teacher";  // or "../pages/shared"
```

**Add the route:**
```javascript
<Route
  path="/teacher/my-new-page"
  element={
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

### Step 4: Add menu item to TeacherDashboard (if applicable)

```javascript
// src/pages/TeacherDashboard.jsx
const NAV = [
  // ... existing items
  {
    icon: "🆕",  // Choose emoji icon
    label: "My New Feature",
    path: "/teacher/my-new-page"
  }
];
```

## File Structure Rules

### NEVER do this:
```javascript
// ❌ WRONG - Import directly from pages folder
import MyPage from "../pages/MyNewPage";
```

### ALWAYS do this:
```javascript
// ✅ CORRECT - Import from organized index files
import { MyNewPage } from "../pages/teacher";
```

### NEVER do this:
```javascript
// ❌ WRONG - Page files scattered at root level
src/pages/
├── Page1.jsx
├── Page2.jsx
├── Page3.jsx
└── Page4.jsx
```

### ALWAYS do this:
```javascript
// ✅ CORRECT - Pages organized by role
src/pages/
├── common/
│  └── index.js
├── teacher/
│  └── index.js
├── admin/
│  └── index.js
├── parent/
│  └── index.js
└── shared/
   └── index.js
```

## File Naming Conventions

- Use **PascalCase** for page component files: `TeacherDashboard.jsx`
- Use **descriptive names**: `StudentListPage.jsx` (not just `Students.jsx`)
- Include **"Page"** suffix for clarity: `MyFeaturePage.jsx`

## Page Categories

### Common Pages
```
Characteristics:
- No authentication required
- Accessible to all visitors
- Examples: Login, Register, Home

When to use:
- Public landing page
- Authentication forms
- Error pages (401, 403, 404)
```

### Teacher Pages
```
Characteristics:
- Require TEACHER role
- Teaching-focused features
- Examples: Grade book, Attendance, Assignments

When to use:
- Any teacher-specific functionality
- Student management features
- Grading and assessment tools
```

### Admin Pages
```
Characteristics:
- Require ADMIN role
- System administration
- Examples: User management, System settings

When to use:
- Administrative features
- User/role management
- System-wide configurations
```

### Parent Pages
```
Characteristics:
- Require PARENT role
- Parent-focused view
- Examples: Child progress, Communication

When to use:
- Parent dashboard
- Student progress tracking
- Parent-child communication
```

### Shared Pages
```
Characteristics:
- Used by multiple roles
- Cross-role functionality
- Examples: Messaging, Profile

When to use:
- Features needed by 2+ roles
- Cross-role collaboration
- Universal tools
```

## Best Practices

### ✅ DO:
1. **Keep pages focused** - One main responsibility per page
2. **Use index.js re-exports** - Always import from index files
3. **Follow role organization** - Place pages in correct role folder
4. **Document in route comments** - Explain what each route does
5. **Test protected routes** - Verify role-based access control
6. **Use consistent imports** - `import { Component } from "../pages/teacher"`

### ❌ DON'T:
1. **Mix role pages** - Don't combine teacher + parent logic in one page
2. **Import directly** - `import Page from "../pages/Page"` is anti-pattern
3. **Create files outside structure** - All pages belong in folders
4. **Forget to export** - Always update index.js when adding pages
5. **Leave routes undocumented** - Comment what each route is for

## Scaling Guidelines

### Current Structure Supports:
- Up to 10-15 pages per role folder
- Clear separation of concerns
- Easy role-based access control
- Scalable import pattern

### When to Sub-Organize:
If a role folder grows beyond 15 pages, consider sub-folders:

```javascript
// EXAMPLE: If teacher folder grows too large
src/pages/teacher/
├── dashboard/
│  ├── TeacherDashboard.jsx
│  ├── ClassOverview.jsx
│  └── index.js
├── grading/
│  ├── GradesPage.jsx
│  ├── AssignmentsPage.jsx
│  └── index.js
├── communication/
│  ├── MessagesSectionPage.jsx
│  └── index.js
└── index.js  // Main teacher index that re-exports all sub-folders

// AppRouter would then import:
import { TeacherDashboard, ClassOverview } from "../pages/teacher";
```

## Common Patterns

### Protected Teacher Route
```javascript
<Route
  path="/teacher/my-feature"
  element={
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <MyFeaturePage />
    </ProtectedRoute>
  }
/>
```

### Shared Multi-Role Route
```javascript
<Route
  path="/messages"
  element={
    <ProtectedRoute allowedRoles={["TEACHER", "PARENT"]}>
      <MessagesPage />
    </ProtectedRoute>
  }
/>
```

### Public Route (No Auth Required)
```javascript
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Page not found" error | Check if page is exported in index.js |
| Import breaking after reorganization | Verify all imports use index files |
| 403 Unauthorized error | Check ProtectedRoute allowedRoles config |
| Pages folder is messy | Group new pages in appropriate role folder |

## Future Considerations

- Consider sub-folder organization if teacher pages exceed 15+
- Plan for role-based menu generation from a config object
- Consider dynamic route generation from route definitions

---

**Last Updated:** Current session  
**Maintained by:** Development Team  
**Contact:** See project README for architectural decisions
