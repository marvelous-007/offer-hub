"use client";

import React from "react";
import { IconProps } from "@/types/icon-types";
import { cn } from "@/lib/utils";

export function Icon({
  icon: IconComponent,
  size = "md",
  color,
  className,
  onClick,
  ariaLabel,
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) {
  const getSize = () => {
    if (typeof size === "number") {
      return `${size}px`;
    }
    
    switch (size) {
      case "xs":
        return "12px";
      case "sm":
        return "16px";
      case "md":
        return "20px";
      case "lg":
        return "24px";
      case "xl":
        return "32px";
      default:
        return "20px";
    }
  };

  const iconSize = getSize();

  return (
    <IconComponent
      size={iconSize}
      color={color}
      className={cn(
        "shrink-0",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    />
  );
}

// Convenience components for common icons
export function IconWrapper({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}