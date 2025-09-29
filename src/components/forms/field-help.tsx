"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import StandardTooltip, {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface FieldHelpProps {
  helpText: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  iconClassName?: string
  delayDuration?: number
  // Field-specific props
  fieldId?: string
  required?: boolean
}

const FieldHelp = ({
  helpText,
  side = "top",
  align = "center",
  className,
  iconClassName,
  delayDuration = 300,
  fieldId,
  required = false,
}: FieldHelpProps) => {
  const tooltipId = fieldId ? `${fieldId}-help` : undefined

  return (
    <StandardTooltip
      content={
        <div className="max-w-xs space-y-1">
          <p className="text-sm">{helpText}</p>
          {required && (
            <p className="text-xs text-muted-foreground">This field is required.</p>
          )}
        </div>
      }
      side={side}
      align={align}
      className={cn("bg-popover text-popover-foreground", className)}
      delayDuration={delayDuration}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-describedby={tooltipId}
        aria-label="Field help"
      >
        <HelpCircle
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors h-3.5 w-3.5",
            iconClassName,
          )}
        />
      </button>
    </StandardTooltip>
  )
}

// FieldHelp with Provider for form usage
interface FieldHelpWithProviderProps extends FieldHelpProps {
  children?: React.ReactNode
}

export const FieldHelpWithProvider = ({
  helpText,
  side = "top",
  align = "center",
  className,
  delayDuration = 300,
  fieldId,
  required = false,
  children,
}: FieldHelpWithProviderProps) => {
  const tooltipId = fieldId ? `${fieldId}-help` : undefined

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children || (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-describedby={tooltipId}
              aria-label="Field help"
            >
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn("bg-popover text-popover-foreground max-w-xs", className)}
          id={tooltipId}
        >
          <div className="space-y-1">
            <p className="text-sm">{helpText}</p>
            {required && (
              <p className="text-xs text-muted-foreground">This field is required.</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// FieldHelp for inline usage with label
interface FieldHelpInlineProps extends FieldHelpProps {
  label?: string
}

export const FieldHelpInline = ({
  helpText,
  label,
  side = "top",
  align = "center",
  className,
  fieldId,
  required = false,
}: FieldHelpInlineProps) => {
  return (
    <div className="inline-flex items-center gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <FieldHelp
        helpText={helpText}
        side={side}
        align={align}
        className={className}
        fieldId={fieldId}
        required={required}
      />
    </div>
  )
}

export default FieldHelp