# @tuktuk-eazy/ui

A comprehensive design system and UI component library for Tuk Tuk Eazy applications. This package provides consistent design tokens, Tailwind CSS presets, and reusable React components across all Tuk Tuk Eazy apps (Driver, Passenger, Admin).

## Features

- 🎨 **Centralized Design Tokens** - CSS custom properties for colors, spacing, typography
- 🎯 **Tailwind CSS Preset** - Pre-configured theme extending Tailwind with design tokens
- 🧩 **React Components** - Production-ready components with TypeScript support
- 📱 **Mobile-First** - Optimized for mobile experiences
- 🌙 **Dark Mode Ready** - Built-in dark theme support
- ♿ **Accessible** - WCAG compliant components
- 🌳 **Tree Shakeable** - Import only what you need

## Installation

```bash
npm install @tuktuk-eazy/ui
```

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom tailwindcss
```

## Quick Start

### 1. Import Styles

Import the CSS tokens in your main CSS file or app entry point:

```css
/* src/index.css or src/main.css */
@import '@tuktuk-eazy/ui/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Configure Tailwind

Update your `tailwind.config.js` to use the UI kit preset:

```js
// tailwind.config.js
import preset from '@tuktuk-eazy/ui/tailwind.preset';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  presets: [preset],
  // Your additional config...
};
```

### 3. Use Components

```tsx
import { Button, Card, StatusChip, HeaderBar } from '@tuktuk-eazy/ui';

function App() {
  return (
    <div>
      <HeaderBar 
        title="My App" 
        right={<Button variant="ghost">Menu</Button>}
      />
      
      <Card className="m-4">
        <div className="flex items-center justify-between">
          <StatusChip status="COMPLETED" />
          <Button variant="primary">Book Ride</Button>
        </div>
      </Card>
    </div>
  );
}
```

## Design Tokens

The UI kit provides CSS custom properties that can be used directly or through Tailwind classes:

### Colors

```css
/* CSS Custom Properties */
--tt-primary: 46 196 182;     /* Teal */
--tt-accent: 242 201 76;      /* Yellow */
--tt-secondary: 255 107 107;  /* Coral */
--tt-ink: 14 23 42;           /* Dark text */
--tt-surface: 248 250 252;    /* Light background */
```

```tsx
/* Tailwind Classes */
<div className="bg-brand-primary text-white">
<div className="text-ink bg-surface">
<div className="border-brand-accent">
```

### Status Colors

Special colors for ride status indicators:

```tsx
<StatusChip status="REQUESTED" />   {/* Gray */}
<StatusChip status="ASSIGNED" />    {/* Teal */}
<StatusChip status="ENROUTE" />     {/* Blue */}
<StatusChip status="STARTED" />     {/* Amber */}
<StatusChip status="COMPLETED" />   {/* Green */}
<StatusChip status="CANCELLED" />   {/* Red */}
```

## Components

### Button

Versatile button component with multiple variants and states:

```tsx
<Button variant="primary" size="lg" full>
  Primary Button
</Button>

<Button variant="secondary" loading>
  Loading...
</Button>

<Button variant="ghost" icon={<Icon />}>
  With Icon
</Button>
```

**Props:**
- `variant`: `"primary" | "secondary" | "ghost" | "danger"`
- `size`: `"sm" | "md" | "lg"`
- `full`: `boolean` - Full width
- `loading`: `boolean` - Show loading spinner
- `icon`: `ReactNode` - Icon before text

### Card

Flexible container component with elevation and interactive states:

```tsx
<Card elevation="elevate" interactive>
  <CardHeader>
    <CardTitle>Ride Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Pickup: Downtown</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Accept</Button>
  </CardFooter>
</Card>
```

**Props:**
- `elevation`: `"soft" | "elevate" | "strong"`
- `padded`: `boolean` - Include padding (default: true)
- `interactive`: `boolean` - Hover effects

### StatusChip

Status indicator for ride states:

```tsx
<StatusChip status="ENROUTE" size="lg" />
<StatusChip status="COMPLETED" showDot={false} />
```

**Props:**
- `status`: `RideStatus` - The ride status
- `size`: `"sm" | "md" | "lg"`
- `showDot`: `boolean` - Show status dot (default: true)

**Utility Functions:**
```tsx
import { getStatusColor, isTerminalStatus, getNextStatus } from '@tuktuk-eazy/ui';

const colors = getStatusColor('COMPLETED');
const isComplete = isTerminalStatus('COMPLETED'); // true
const next = getNextStatus('ASSIGNED'); // 'ENROUTE'
```

### HeaderBar

Consistent header component with navigation and actions:

```tsx
<HeaderBar
  title="Active Ride"
  subtitle="Trip #12345"
  left={<BackButton onClick={() => navigate(-1)} />}
  right={<MenuButton onClick={openMenu} />}
/>
```

**Props:**
- `title`: `string` - Main title
- `subtitle`: `string` - Optional subtitle
- `left`: `ReactNode` - Left side content
- `right`: `ReactNode` - Right side content
- `sticky`: `boolean` - Sticky positioning (default: true)
- `variant`: `"default" | "transparent" | "surface"`

## Dark Mode

Enable dark mode by adding the `data-theme="dark"` attribute:

```tsx
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Or use with a state
<html data-theme={isDark ? 'dark' : 'light'}>
```

## TypeScript Support

The package includes full TypeScript definitions:

```tsx
import type { ButtonProps, RideStatus, StatusChipProps } from '@tuktuk-eazy/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Customization

### Extending Colors

Add custom colors in your Tailwind config:

```js
// tailwind.config.js
import preset from '@tuktuk-eazy/ui/tailwind.preset';

export default {
  presets: [preset],
  theme: {
    extend: {
      colors: {
        custom: {
          blue: '#0066CC',
        },
      },
    },
  },
};
```

### CSS Custom Properties

Override design tokens in your CSS:

```css
:root {
  /* Override primary color */
  --tt-primary: 59 130 246; /* Blue instead of teal */
  
  /* Add custom tokens */
  --my-custom-color: 255 0 128;
}

.my-component {
  background-color: rgb(var(--my-custom-color));
}
```

## Development

### Building the Package

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

### Local Development

To use the package locally in your apps during development:

```bash
# In the ui-kit directory
npm run build
npm link

# In your app directory
npm link @tuktuk-eazy/ui
```

## Migration Guide

### From Individual App Styles

If you're migrating from individual app styling:

1. **Replace color values** with design tokens:
   ```tsx
   // Before
   <div className="bg-[#2EC4B6]">
   
   // After
   <div className="bg-brand-primary">
   ```

2. **Update component imports**:
   ```tsx
   // Before
   import Button from './components/Button';
   
   // After
   import { Button } from '@tuktuk-eazy/ui';
   ```

3. **Import styles**:
   ```css
   /* Add to your main CSS file */
   @import '@tuktuk-eazy/ui/styles.css';
   ```

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new components
3. Include comprehensive documentation
4. Test components in multiple apps before publishing
5. Update this README for any new features

## License

MIT © Tuk Tuk Eazy

---

For questions or support, please contact the development team.