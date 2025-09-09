/**
 * Tuk Tuk Eazy Tailwind Preset
 * 
 * This preset extends Tailwind CSS with our design tokens.
 * Import this in your tailwind.config.js to use the design system.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: "rgb(var(--tt-primary) / <alpha-value>)",
          accent: "rgb(var(--tt-accent) / <alpha-value>)",
          secondary: "rgb(var(--tt-secondary) / <alpha-value>)",
        },
        
        // Base colors
        ink: "rgb(var(--tt-ink) / <alpha-value>)",
        surface: "rgb(var(--tt-surface) / <alpha-value>)",
        
        // Feedback colors
        success: "rgb(var(--tt-success) / <alpha-value>)",
        warning: "rgb(var(--tt-warning) / <alpha-value>)",
        danger: "rgb(var(--tt-danger) / <alpha-value>)",
        muted: "rgb(var(--tt-muted) / <alpha-value>)",
        
        // Status colors (for ride status chips)
        status: {
          REQUESTED: "rgb(var(--tt-status-requested) / <alpha-value>)",
          ASSIGNED: "rgb(var(--tt-status-assigned) / <alpha-value>)",
          ENROUTE: "rgb(var(--tt-status-enroute) / <alpha-value>)",
          STARTED: "rgb(var(--tt-status-started) / <alpha-value>)",
          COMPLETED: "rgb(var(--tt-status-completed) / <alpha-value>)",
          CANCELLED: "rgb(var(--tt-status-cancelled) / <alpha-value>)",
        },
      },
      
      // Border radius using design tokens
      borderRadius: {
        sm: "var(--tt-radius-sm)",
        md: "var(--tt-radius-md)",
        lg: "var(--tt-radius-lg)",
        xl: "var(--tt-radius-xl)",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      
      // Box shadows
      boxShadow: {
        soft: "var(--tt-shadow-soft)",
        elevate: "var(--tt-shadow-elevate)",
        strong: "var(--tt-shadow-strong)",
      },
      
      // Container max width
      maxWidth: {
        container: "var(--tt-container-max)",
      },
      
      // Focus ring color
      ringColor: {
        brand: "rgb(var(--tt-ring) / <alpha-value>)",
      },
      
      // Typography scale
      fontSize: {
        xs: ["var(--tt-text-xs)", { lineHeight: "1.4" }],
        sm: ["var(--tt-text-sm)", { lineHeight: "1.5" }],
        base: ["var(--tt-text-base)", { lineHeight: "1.6" }],
        lg: ["var(--tt-text-lg)", { lineHeight: "1.6" }],
        xl: ["var(--tt-text-xl)", { lineHeight: "1.5" }],
        "2xl": ["var(--tt-text-2xl)", { lineHeight: "1.4" }],
        "3xl": ["var(--tt-text-3xl)", { lineHeight: "1.3" }],
      },
      
      // Spacing scale
      spacing: {
        1: "var(--tt-space-1)",
        2: "var(--tt-space-2)",
        3: "var(--tt-space-3)",
        4: "var(--tt-space-4)",
        5: "var(--tt-space-5)",
        6: "var(--tt-space-6)",
        8: "var(--tt-space-8)",
        10: "var(--tt-space-10)",
        12: "var(--tt-space-12)",
      },
      
      // Animation and transitions
      transitionDuration: {
        DEFAULT: "200ms",
      },
      
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};