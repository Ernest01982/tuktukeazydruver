import * as React from "react";

export type RideStatus = 
  | "REQUESTED" 
  | "ASSIGNED" 
  | "ENROUTE" 
  | "STARTED" 
  | "COMPLETED" 
  | "CANCELLED";

export interface StatusChipProps {
  /** The ride status to display */
  status: RideStatus;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the status dot */
  showDot?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const statusLabels: Record<RideStatus, string> = {
  REQUESTED: "Requested",
  ASSIGNED: "Assigned", 
  ENROUTE: "En Route",
  STARTED: "Started",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusStyles: Record<RideStatus, { bg: string; text: string; dot: string }> = {
  REQUESTED: {
    bg: "rgb(var(--tt-status-requested) / 0.12)",
    text: "rgb(var(--tt-status-requested))",
    dot: "rgb(var(--tt-status-requested))",
  },
  ASSIGNED: {
    bg: "rgb(var(--tt-status-assigned) / 0.12)",
    text: "rgb(var(--tt-status-assigned))",
    dot: "rgb(var(--tt-status-assigned))",
  },
  ENROUTE: {
    bg: "rgb(var(--tt-status-enroute) / 0.12)",
    text: "rgb(var(--tt-status-enroute))",
    dot: "rgb(var(--tt-status-enroute))",
  },
  STARTED: {
    bg: "rgb(var(--tt-status-started) / 0.12)",
    text: "rgb(var(--tt-status-started))",
    dot: "rgb(var(--tt-status-started))",
  },
  COMPLETED: {
    bg: "rgb(var(--tt-status-completed) / 0.12)",
    text: "rgb(var(--tt-status-completed))",
    dot: "rgb(var(--tt-status-completed))",
  },
  CANCELLED: {
    bg: "rgb(var(--tt-status-cancelled) / 0.12)",
    text: "rgb(var(--tt-status-cancelled))",
    dot: "rgb(var(--tt-status-cancelled))",
  },
};

export function StatusChip({ 
  status, 
  className = "", 
  showDot = true, 
  size = "md" 
}: StatusChipProps) {
  const styles = statusStyles[status];
  const label = statusLabels[status];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2", 
    lg: "h-2.5 w-2.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md font-medium ${sizeClasses[size]} ${className}`}
      style={{ 
        backgroundColor: styles.bg, 
        color: styles.text 
      }}
    >
      {showDot && (
        <span 
          className={`rounded-full ${dotSizes[size]}`}
          style={{ backgroundColor: styles.dot }}
        />
      )}
      {label}
    </span>
  );
}

// Utility function to get status color for custom styling
export function getStatusColor(status: RideStatus): {
  background: string;
  text: string;
  dot: string;
} {
  return statusStyles[status];
}

// Utility function to check if status is terminal
export function isTerminalStatus(status: RideStatus): boolean {
  return status === "COMPLETED" || status === "CANCELLED";
}

// Utility function to get next valid status
export function getNextStatus(currentStatus: RideStatus): RideStatus | null {
  const transitions: Record<RideStatus, RideStatus | null> = {
    REQUESTED: "ASSIGNED",
    ASSIGNED: "ENROUTE", 
    ENROUTE: "STARTED",
    STARTED: "COMPLETED",
    COMPLETED: null,
    CANCELLED: null,
  };
  
  return transitions[currentStatus];
}