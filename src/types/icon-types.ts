import { LucideIcon } from "lucide-react";
import { SVGProps } from "react";

export interface IconProps {
  /** The icon component from Lucide React or custom SVG */
  icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  /** Size of the icon */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Color of the icon */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Accessibility label */
  ariaLabel?: string;
}