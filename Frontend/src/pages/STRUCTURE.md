# Pages Folder Structure

This folder is organized by user role and functionality to maintain clean code organization and scalability.

## Directory Structure

```
pages/
├── common/                      # Shared pages for all users
│   ├── index.js                # Re-exports all common pages
│   └── Files: HomePage, LoginPage, RegisterPage, UnauthorizedPage
│
├── teacher/                     # Teacher-only pages
│   ├── index.js                # Re-exports all teacher pages
│   └── Files: TeacherDashboard, StudentListPage, StudentDetailsPage,
│             AssignmentsPage, GradesPage, AttendancePage,
│             SchedulePage, MessagesSectionPage, AIInsightsPage
│
├── admin/                       # Admin-only pages
│   ├── index.js                # Re-exports admin pages
│   └── Files: AdminDashboard
│
├── parent/                      # Parent-only pages
│   ├── index.js                # Re-exports parent pages
│   └── Files: ParentDashboard
│
├── shared/                      # Shared pages across multiple roles
│   ├── index.js                # Re-exports shared pages
│   └── Files: MessagesPage, RoleHomePage
│
├── STRUCTURE.md                 # This file
├── HomePage.jsx                 # Home landing page
├── LoginPage.jsx                # User login (authentication)
├── RegisterPage.jsx             # User registration
├── UnauthorizedPage.jsx         # 403 error page
├── TeacherDashboard.jsx         # Teacher home dashboard
├── AdminDashboard.jsx           # Admin home dashboard
├── ParentDashboard.jsx          # Parent home dashboard
├── StudentListPage.jsx          # Teacher: all students list
├── StudentDetailsPage.jsx       # Teacher: individual student details
├── AssignmentsPage.jsx          # Teacher: manage assignments
├── GradesPage.jsx               # Teacher: grade book
├── AttendancePage.jsx           # Teacher: attendance tracking
├── SchedulePage.jsx             # Teacher: class schedule
├── MessagesSectionPage.jsx      # Teacher: dedicated messages section
├── AIInsightsPage.jsx           # Teacher: AI-powered insights
├── MessagesPage.jsx             # Shared: messaging system
├── RoleHomePage.jsx             # Shared: role selection home
└── STRUCTURE.md                 # This documentation
```

## Import Guidelines

### Old Way (NOT recommended):
```javascript
import HomePage from '../pages/HomePage';
import TeacherDashboard from '../pages/TeacherDashboard';
```

### New Way (CLEAN & RECOMMENDED):
```javascript
// Import from index files
import { HomePage, LoginPage } from '../pages/common';
import { TeacherDashboard, StudentListPage } from '../pages/teacher';
import { AdminDashboard } from '../pages/admin';
import { ParentDashboard } from '../pages/parent';
import { MessagesPage } from '../pages/shared';
```

## Page Categories

### Common Pages (Public Access)
- **HomePage** - Landing page with introduction and role cards
- **LoginPage** - User authentication form
- **RegisterPage** - New user registration form
- **UnauthorizedPage** - 403 error page for insufficient permissions

### Teacher Pages (Role: TEACHER)
- **TeacherDashboard** - Main teacher home with overview metrics
  - Students Snapshot, Quick Actions, Focus Tips, Class Performance
- **StudentListPage** - Directory view of all enrolled students
- **StudentDetailsPage** - Individual student profile and analytics
- **AssignmentsPage** - Assignment management with submission tracking
- **GradesPage** - Interactive grade book with editable marks
- **AttendancePage** - Quick attendance marking interface
- **SchedulePage** - Weekly class schedule and timetable
- **MessagesSectionPage** - Teacher-dedicated messaging interface
- **AIInsightsPage** - AI-powered student performance analysis

### Admin Pages (Role: ADMIN)
- **AdminDashboard** - System administration and user management

### Parent Pages (Role: PARENT)
- **ParentDashboard** - Child progress tracking and communication

### Shared Pages (Multiple Roles)
- **MessagesPage** - Universal messaging system
- **RoleHomePage** - Role selection after login

## Future Considerations

### When to Create New Pages:
1. New feature for existing role → Add to appropriate role folder
2. Cross-role feature → Add to `/shared` folder
3. Required for multiple roles → Add to `/shared` folder

### Scaling:
- If teacher pages grow large, consider sub-folders:
  - `teacher/dashboard/`, `teacher/grading/`, `teacher/communication/`
- If shared pages grow, consider `shared/messages/`, `shared/profile/`
