const fs = require('fs');

// Extract routes from AppRouter.jsx
const appRouterContent = fs.readFileSync('src/routes/AppRouter.jsx', 'utf8');
const pathsContent = fs.readFileSync('src/routes/paths.js', 'utf8');

console.log("✓ Route Configuration Verification\n");

// Check if all PATHS are used in routes
const pathsMatch = pathsContent.match(/(\w+):\s*["'`](\/[^"'`]*)/g) || [];
const routesMatch = appRouterContent.match(/path={PATHS\.(\w+)}/g) || [];

const definedPaths = new Set(pathsMatch.map(m => m.split(':')[0].trim()));
const usedPaths = new Set(routesMatch.map(m => m.match(/PATHS\.(\w+)/)[1]));

console.log(`1. Paths Definition vs Routes Usage:`);
console.log(`   - Defined: ${definedPaths.size} paths`);
console.log(`   - Used in routes: ${usedPaths.size} paths\n`);

// Dynamic paths (functions) don't appear in routes in the same way
const dynamicPaths = ['TEACHER_STUDENTS_DETAIL', 'PARENT_STUDENT_DETAIL'];
const staticUsedPaths = Array.from(usedPaths).filter(p => !dynamicPaths.includes(p));
const staticDefinedPaths = Array.from(definedPaths).filter(p => !dynamicPaths.includes(p));

console.log(`2. Static Paths:`);
console.log(`   - Defined: ${staticDefinedPaths.sort().join(', ')}`);
console.log(`   - Used in routes: ${staticUsedPaths.sort().join(', ')}\n`);

// Check for unused paths
const unusedPaths = staticDefinedPaths.filter(p => !usedPaths.has(p));
if (unusedPaths.length > 0) {
  console.log(`3. ⚠ Potentially Unused Paths:`);
  unusedPaths.forEach(p => console.log(`   - ${p}`));
} else {
  console.log(`3. ✓ All defined paths are used in routes\n`);
}

// Check for protected routes
const protectedRoutes = appRouterContent.match(/<Route element={<ProtectedRoute allowedRoles={\[(.*?)\]}/g) || [];
console.log(`4. Protected Routes: ${protectedRoutes.length} route groups`);
console.log(`   - Admin routes: ${appRouterContent.includes('allowedRoles={["ADMIN"]}') ? '✓' : '✗'}`);
console.log(`   - Teacher routes: ${appRouterContent.includes('allowedRoles={["TEACHER"]}') ? '✓' : '✗'}`);
console.log(`   - Parent routes: ${appRouterContent.includes('allowedRoles={["PARENT"]}') ? '✓' : '✗'}`);
console.log(`   - Shared routes: ${appRouterContent.includes('allowedRoles={["ADMIN", "TEACHER", "PARENT"]}') ? '✓' : '✗'}\n`);

// Check for 404 handling
if (appRouterContent.includes('*') && appRouterContent.includes('Navigate to')) {
  console.log(`5. ✓ 404/Fallback Route: Configured\n`);
} else {
  console.log(`5. ✗ 404/Fallback Route: Missing\n`);
}

// Check for role-based default redirect
if (appRouterContent.includes('getDefaultPathByRole')) {
  console.log(`6. ✓ Role-based Default Redirect: Configured\n`);
} else {
  console.log(`6. ✗ Role-based Default Redirect: Missing\n`);
}

console.log(`✓ Route configuration verification complete!`);
