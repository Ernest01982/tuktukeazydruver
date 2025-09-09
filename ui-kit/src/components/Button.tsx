import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style variant */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Whether button should take full width */
  full?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  loading = false,
  icon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98]",
  ].join(" ");

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-5 py-3 text-base rounded-lg",
    lg: "px-6 py-4 text-lg rounded-xl",
  };

  const variantClasses = {
    primary: [
      "bg-brand-primary text-white shadow-elevate",
      "hover:bg-brand-primary/90 hover:shadow-strong",
      "active:bg-brand-primary/80",
    ].join(" "),
    
    secondary: [
      "bg-brand-accent text-ink shadow-soft",
      "hover:bg-brand-accent/90 hover:shadow-elevate",
      "active:bg-brand-accent/80",
    ].join(" "),
    
    ghost: [
      "bg-transparent text-brand-primary border border-brand-primary/20",
      "hover:bg-brand-primary/10 hover:border-brand-primary/30",
      "active:bg-brand-primary/20",
    ].join(" "),
    
    danger: [
      "bg-danger text-white shadow-soft",
      "hover:bg-danger/90 hover:shadow-elevate",
      "active:bg-danger/80",
    ].join(" "),
  };

  const widthClass = full ? "w-full" : "";

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}