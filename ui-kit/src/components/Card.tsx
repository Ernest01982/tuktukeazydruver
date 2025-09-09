import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card elevation level */
  elevation?: "soft" | "elevate" | "strong";
  /** Whether card should have padding */
  padded?: boolean;
  /** Whether card should be interactive (hover effects) */
  interactive?: boolean;
}

export function Card({
  elevation = "soft",
  padded = true,
  interactive = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses = [
    "bg-white rounded-lg border border-black/5",
    "transition-all duration-200",
  ].join(" ");

  const elevationClasses = {
    soft: "shadow-soft",
    elevate: "shadow-elevate",
    strong: "shadow-strong",
  };

  const paddingClass = padded ? "p-4" : "";
  
  const interactiveClasses = interactive
    ? "hover:shadow-elevate hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <div
      className={`${baseClasses} ${elevationClasses[elevation]} ${paddingClass} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card sub-components for better composition
export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-ink ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-ink/80 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}