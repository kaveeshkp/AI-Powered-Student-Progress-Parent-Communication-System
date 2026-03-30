# Professional UI & CSS System Documentation

## Overview
This project uses a comprehensive professional UI system built with **Tailwind CSS** and custom CSS component library. The system ensures consistency, maintainability, and a modern, polished appearance across all pages.

## Setup & Configuration

### Dependencies Installed
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS post-processor
- `autoprefixer` - Vendor prefix automation

### Configuration Files
- `tailwind.config.js` - Tailwind configuration with custom theme
- `postcss.config.js` - PostCSS plugins configuration
- `src/styles.css` - Global styles with Tailwind directives

## Design System

### Color Palette
- **Primary**: Indigo/Sky blue (#0284c7)
- **Success**: Emerald green (#10b981)
- **Warning**: Amber yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Dark backgrounds**: Slate 900-950 series
- **Light text**: Slate/White

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Font Sizes**: Responsive and semantic (h1-h6, p, etc.)
- **Font Weights**: 400, 500, 600, 700
- **Line Height**: 1.6 (body), semantic for headings

### Spacing
- Uses Tailwind's 4px base unit spacing scale
- Consistent gaps and padding through css variables
- Responsive padding with mobile-first approach

### Shadows & Elevation
- **sm-soft**: Light shadows for subtle elevation
- **md-soft**: Medium shadows for cards
- **lg-soft**: Strong shadows for prominent cards
- **xl**: Extra strong shadows for overlays

### Border Radius
- **sm**: 8px (small elements)
- **md**: 12px (form inputs)
- **lg**: 16px (cards)
- **xl**: 20px (large cards)

## Component Library (UiPrimitives.jsx)

### Container Components
```jsx
<Card className="custom-class">
  Content here
</Card>

<CardHeader title="Title" subtitle="Optional subtitle" badge="Live" action={<Button>Action</Button>} />
```

### Status/Message Components
```jsx
<ErrorBanner message="Error occurred!" />
<SuccessBanner message="Success!" />
<InfoBanner message="Info message" />
```

### Loading States
```jsx
<SkeletonLine /> - Single line loading state
<SkeletonBlock className="h-12" /> - Block loading state
<SkeletonRow /> - Table row loading state
<SkeletonTable rows={3} cols={3} /> - Full table loading state
```

### Badge Components
```jsx
<Badge variant="primary|success|warning|error|neutral" size="sm|md|lg">
  Label
</Badge>

<StatusBadge status="present|absent|late|active|inactive|pending" />
```

### Button Component
```jsx
<Button
  variant="primary|secondary|outline|danger"
  size="sm|md|lg"
  disabled={false}
>
  Click me
</Button>
```

### Table Components
```jsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Column 1</TableHeader>
      <TableHeader>Column 2</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Stat Components
```jsx
<StatCard
  label="Total Students"
  value="248"
  tone="indigo|emerald|amber|red"
  loading={false}
  subtitle="Optional subtitle"
/>
```

### Alert Components
```jsx
<AlertCard
  title="Alert Title"
  detail="Alert details"
  severity="info|warning|success|error"
/>
```

## Page Styling

### Authentication Pages
- **LoginPage**: Dark theme with gradient background
- **RegisterPage**: Consistent with LoginPage, additional fields
- Features: Smooth animations, error display, form validation

### Dashboard Layout
- **Responsive sidebar**: Collapsible on mobile
- **Sticky header**: Always visible navigation
- **Glass-morphism effects**: Modern frosted glass appearance
- **Color-coded sections**: Different tones for different content areas

### Dashboard Pages
- **TeacherDashboard**: Student roster, quick actions, summary cards
- **ParentDashboard**: Children overview, performance metrics, alerts
- **StudentDetailsPage**: Detailed student info with charts
- **MessagesPage**: Conversation list with message threading
- **AIInsightsPage**: Data-driven insights with strength/weakness analysis

## CSS Variables & Customization

All main colors, sizes, and transitions are defined as CSS variables in `:root` for easy customization:

```css
:root {
  --color-primary: #0284c7;
  --color-primary-dark: #0369a1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);

  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}
```

## Responsive Design

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
- All styles are mobile-optimized by default
- Larger screens get enhanced layouts via `md:`, `lg:`, etc.

## Dark Mode Features

The UI system uses:
- Dark slate backgrounds for contrast
- Light text colors for readability
- Subtle borders in darker slate tones
- Color-coded accents for different semantic meanings

## Animations & Transitions

- **slideUp**: Entrance animation for auth cards (0.5s)
- **pulse**: Loading state animation
- **hover states**: Smooth transitions on interactive elements
- **focus states**: Visible focus indicators for accessibility

## Best Practices

1. **Use Tailwind utilities** first before custom CSS
2. **Leverage UiPrimitives components** for consistency
3. **Maintain CSS variable scheme** for theming
4. **Test on mobile devices** - ensure responsive design
5. **Use semantic HTML** - improve accessibility
6. **Keep animations under 300ms** - avoid jank
7. **Follow color scheme** - maintain visual hierarchy

## Accessibility Features

- ✅ Focus indicators on all interactive elements
- ✅ Semantic HTML structure
- ✅ Color contrast ratios meet WCAG standards
- ✅ Keyboard navigation support
- ✅ Screen reader friendly labels

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers iOS/Android

---

**Last Updated**: 2026-03-30
**Version**: 1.0.0
