"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { AlertProps, AlertVariant } from "@/types/alert-types";
import { cn } from "@/lib/utils";

// Componente Alert básico reutilizable
export function Alert({
  variant = "default",
  size = "md",
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  icon,
  children,
}: AlertProps & { children?: React.ReactNode }) {
  const getVariantStyles = (variant: AlertVariant) => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "destructive":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case "sm":
        return "p-3 text-sm";
      case "lg":
        return "p-6 text-lg";
      default:
        return "p-4 text-base";
    }
  };

  const getIcon = (variant: AlertVariant) => {
    if (icon) return icon;
    
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "destructive":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg flex items-start gap-3",
        getVariantStyles(variant),
        getSizeStyles(size),
        className
      )}
    >
      {getIcon(variant)}
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        {message && <p className="text-sm">{message}</p>}
        {children}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-auto hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Componente AlertDescription para compatibilidad
export function AlertDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
}