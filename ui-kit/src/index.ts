/**
 * Tuk Tuk Eazy UI Kit
 * 
 * A comprehensive design system and component library for Tuk Tuk Eazy apps.
 * 
 * @example
 * ```tsx
 * import { Button, Card, StatusChip } from '@tuktuk-eazy/ui';
 * import '@tuktuk-eazy/ui/styles.css';
 * 
 * function App() {
 *   return (
 *     <Card>
 *       <StatusChip status="COMPLETED" />
 *       <Button variant="primary">Book Ride</Button>
 *     </Card>
 *   );
 * }
 * ```
 */

// Components
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/StatusChip";
export * from "./components/HeaderBar";

// Types
export type { ButtonProps } from "./components/Button";
export type { CardProps } from "./components/Card";
export type { StatusChipProps, RideStatus } from "./components/StatusChip";
export type { HeaderBarProps, BackButtonProps, MenuButtonProps } from "./components/HeaderBar";

// Re-export utility functions
export { 
  getStatusColor, 
  isTerminalStatus, 
  getNextStatus 
} from "./components/StatusChip";