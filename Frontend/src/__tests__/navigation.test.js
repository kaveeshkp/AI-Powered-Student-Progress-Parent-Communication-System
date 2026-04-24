import { PATHS, getDefaultPathByRole } from '../routes/paths';

describe('Navigation & Routing', () => {
  describe('PATHS constants', () => {
    it('should have all required common paths', () => {
      expect(PATHS.HOME).toBe('/');
      expect(PATHS.APP).toBe('/app');
      expect(PATHS.LOGIN).toBe('/login');
      expect(PATHS.REGISTER).toBe('/register');
      expect(PATHS.UNAUTHORIZED).toBe('/unauthorized');
      expect(PATHS.MESSAGES).toBe('/messages');
    });

    it('should have all required admin paths', () => {
      expect(PATHS.ADMIN).toBe('/admin');
      expect(PATHS.ADMIN_USERS).toBe('/admin/users');
      expect(PATHS.ADMIN_INSTITUTIONS).toBe('/admin/institutions');
      expect(PATHS.ADMIN_REPORTS).toBe('/admin/reports');
      expect(PATHS.ADMIN_SECURITY).toBe('/admin/security');
      expect(PATHS.ADMIN_SETTINGS).toBe('/admin/settings');
    });

    it('should have all required teacher paths', () => {
      expect(PATHS.TEACHER).toBe('/teacher');
      expect(PATHS.TEACHER_STUDENTS).toBe('/teacher/students');
      expect(PATHS.TEACHER_ASSIGNMENTS).toBe('/teacher/assignments');
      expect(PATHS.TEACHER_GRADES).toBe('/teacher/grades');
      expect(PATHS.TEACHER_ATTENDANCE).toBe('/teacher/attendance');
      expect(PATHS.TEACHER_SCHEDULE).toBe('/teacher/schedule');
      expect(PATHS.TEACHER_AI_INSIGHTS).toBe('/teacher/ai-insights');
    });

    it('should have all required student paths', () => {
      expect(PATHS.STUDENT).toBe('/student');
      expect(PATHS.STUDENT_ASSIGNMENTS).toBe('/student/assignments');
      expect(PATHS.STUDENT_GRADES).toBe('/student/grades');
      expect(PATHS.STUDENT_SCHEDULE).toBe('/student/schedule');
    });

    it('should have dynamic path functions', () => {
      expect(PATHS.TEACHER_STUDENTS_DETAIL(123)).toBe('/teacher/students/123');
      expect(PATHS.PARENT_STUDENT_DETAIL(456)).toBe('/parent/student/456');
    });
  });

  describe('getDefaultPathByRole', () => {
    it('should return admin path for ADMIN role', () => {
      expect(getDefaultPathByRole('ADMIN')).toBe(PATHS.ADMIN);
    });

    it('should return teacher path for TEACHER role', () => {
      expect(getDefaultPathByRole('TEACHER')).toBe(PATHS.TEACHER);
    });

    it('should return parent path for PARENT role', () => {
      expect(getDefaultPathByRole('PARENT')).toBe(PATHS.PARENT);
    });

    it('should return student path for STUDENT role', () => {
      expect(getDefaultPathByRole('STUDENT')).toBe(PATHS.STUDENT);
    });

    it('should return login path for unknown role', () => {
      expect(getDefaultPathByRole(null)).toBe(PATHS.LOGIN);
      expect(getDefaultPathByRole(undefined)).toBe(PATHS.LOGIN);
      expect(getDefaultPathByRole('UNKNOWN')).toBe(PATHS.LOGIN);
    });
  });

  describe('DashboardLayout Link Filtering', () => {
    const baseLinks = [
      { to: PATHS.ADMIN, label: 'Dashboard', icon: '⊞', roles: ['ADMIN'] },
      { to: PATHS.TEACHER, label: 'Overview', icon: '⊞', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_STUDENTS, label: 'Students', icon: '👥', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_ASSIGNMENTS, label: 'Assignments', icon: '📋', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_GRADES, label: 'Grades', icon: '📊', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_ATTENDANCE, label: 'Attendance', icon: '✅', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_SCHEDULE, label: 'Schedule', icon: '🗓️', roles: ['TEACHER'] },
      { to: PATHS.TEACHER_AI_INSIGHTS, label: 'AI Insights', icon: '🤖', roles: ['TEACHER'] },
      { to: PATHS.PARENT, label: 'Dashboard', icon: '⊞', roles: ['PARENT'] },
      { to: PATHS.STUDENT, label: 'Overview', icon: '⊞', roles: ['STUDENT'] },
      { to: PATHS.STUDENT_ASSIGNMENTS, label: 'Assignments', icon: '📋', roles: ['STUDENT'] },
      { to: PATHS.STUDENT_GRADES, label: 'Grades', icon: '📊', roles: ['STUDENT'] },
      { to: PATHS.STUDENT_SCHEDULE, label: 'Schedule', icon: '🗓️', roles: ['STUDENT'] },
      { to: PATHS.MESSAGES, label: 'Messages', icon: '💬', roles: ['ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] }
    ];

    it('should show only admin links for ADMIN role', () => {
      const adminLinks = baseLinks.filter((link) => !link.roles || link.roles.includes('ADMIN'));
      expect(adminLinks).toContainEqual(expect.objectContaining({ to: PATHS.ADMIN }));
      expect(adminLinks).toContainEqual(expect.objectContaining({ to: PATHS.MESSAGES }));
      expect(adminLinks.length).toBe(2);
    });

    it('should show only teacher links for TEACHER role', () => {
      const teacherLinks = baseLinks.filter((link) => !link.roles || link.roles.includes('TEACHER'));
      expect(teacherLinks.length).toBe(8);
      expect(teacherLinks.map(l => l.to)).toContain(PATHS.TEACHER);
      expect(teacherLinks.map(l => l.to)).toContain(PATHS.TEACHER_STUDENTS);
      expect(teacherLinks.map(l => l.to)).toContain(PATHS.TEACHER_AI_INSIGHTS);
    });

    it('should show only parent links for PARENT role', () => {
      const parentLinks = baseLinks.filter((link) => !link.roles || link.roles.includes('PARENT'));
      expect(parentLinks).toContainEqual(expect.objectContaining({ to: PATHS.PARENT }));
      expect(parentLinks).toContainEqual(expect.objectContaining({ to: PATHS.MESSAGES }));
      expect(parentLinks.length).toBe(2);
    });
  });

  describe('Route Path Consistency', () => {
    it('should not have overlapping paths', () => {
      const allPaths = Object.values(PATHS).filter(v => typeof v === 'string');
      const uniquePaths = new Set(allPaths);
      expect(uniquePaths.size).toBe(allPaths.length);
    });

    it('should have consistent naming conventions', () => {
      // Admin paths should start with /admin
      expect(PATHS.ADMIN_USERS.startsWith('/admin')).toBe(true);
      expect(PATHS.ADMIN_INSTITUTIONS.startsWith('/admin')).toBe(true);

      // Teacher paths should start with /teacher
      expect(PATHS.TEACHER_STUDENTS.startsWith('/teacher')).toBe(true);
      expect(PATHS.TEACHER_ASSIGNMENTS.startsWith('/teacher')).toBe(true);

      // Parent paths should start with /parent
      expect(PATHS.PARENT.startsWith('/parent')).toBe(true);
    });
  });
});
