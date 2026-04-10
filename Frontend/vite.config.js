import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    // Enable minification with optimal settings
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    },
    // Configure chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-recharts": ["recharts"],
          "vendor-axios": ["axios"],
          
          // Split by route/role
          "chunk-admin": [
            "./src/pages/admin/AdminDashboardPro.jsx",
            "./src/pages/admin/AdminUsersPage.jsx",
            "./src/pages/admin/AdminPlaceholderPage.jsx",
          ],
          "chunk-teacher": [
            "./src/pages/teacher/TeacherDashboard.jsx",
            "./src/pages/teacher/StudentListPage.jsx",
            "./src/pages/teacher/StudentDetailsPage.jsx",
            "./src/pages/teacher/AssignmentsPage.jsx",
            "./src/pages/teacher/GradesPage.jsx",
            "./src/pages/teacher/AttendancePage.jsx",
            "./src/pages/teacher/SchedulePage.jsx",
            "./src/pages/teacher/MessagesSectionPage.jsx",
            "./src/pages/teacher/AIInsightsPage.jsx",
          ],
          "chunk-student": [
            "./src/pages/student/StudentDashboard.jsx",
            "./src/pages/student/StudentAssignmentsPage.jsx",
            "./src/pages/student/StudentGradesPage.jsx",
            "./src/pages/student/StudentSchedulePage.jsx",
          ],
          "chunk-parent": [
            "./src/pages/parent/ParentDashboard.jsx",
          ],
          "chunk-common": [
            "./src/pages/common/HomePage.jsx",
            "./src/pages/common/LoginPage.jsx",
            "./src/pages/common/RegisterPage.jsx",
            "./src/pages/common/UnauthorizedPage.jsx",
            "./src/pages/common/NotFoundPage.jsx",
          ],
          "chunk-shared": [
            "./src/pages/shared/MessagesPage.jsx",
          ],
        },
      },
    },
    // Optimize CSS code splitting
    cssCodeSplit: true,
    // Source maps in production for debugging (set to false for smaller bundle)
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable report size and gzip compression info
    reportCompressedSize: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "recharts",
    ],
    exclude: [],
  },
});
