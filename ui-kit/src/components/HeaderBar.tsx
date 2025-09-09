import * as React from "react";

export interface HeaderBarProps {
  /** Header title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Content to display on the right side */
  right?: React.ReactNode;
  /** Content to display on the left side (usually back button) */
  left?: React.ReactNode;
  /** Whether header should be sticky */
  sticky?: boolean;
  /** Background variant */
  variant?: "default" | "transparent" | "surface";
  /** Additional CSS classes */
  className?: string;
}

export function HeaderBar({
  title,
  subtitle,
  right,
  left,
  sticky = true,
  variant = "default",
  className = "",
}: HeaderBarProps) {
  const baseClasses = [
    "flex items-center justify-between",
    "px-4 py-3",
    "border-b border-black/5",
    "backdrop-blur-sm",
    "transition-all duration-200",
  ].join(" ");

  const stickyClass = sticky ? "sticky top-0 z-10" : "";

  const variantClasses = {
    default: "bg-white/95",
    transparent: "bg-transparent",
    surface: "bg-[rgb(var(--tt-surface))]",
  };

  return (
    <header className={`${baseClasses} ${stickyClass} ${variantClasses[variant]} ${className}`}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        {left && <div className="flex-shrink-0">{left}</div>}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-ink truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right side */}
      {right && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {right}
        </div>
      )}
    </header>
  );
}

// Common header patterns as sub-components
export interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 -ml-2 text-muted hover:text-ink transition-colors rounded-md hover:bg-black/5 ${className}`}
      aria-label="Go back"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

export interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

export function MenuButton({ onClick, className = "" }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-muted hover:text-ink transition-colors rounded-md hover:bg-black/5 ${className}`}
      aria-label="Open menu"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}