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

interface InfoTooltipProps {
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  iconClassName?: string
  delayDuration?: number
  size?: "sm" | "md" | "lg"
}

const InfoTooltip = ({
  content,
  side = "top",
  align = "center",
  className,
  iconClassName,
  delayDuration = 300,
  size = "md",
}: InfoTooltipProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <StandardTooltip
      content={content}
      side={side}
      align={align}
      className={className}
      delayDuration={delayDuration}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Additional information"
      >
        <HelpCircle
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors",
            sizeClasses[size],
            iconClassName,
          )}
        />
      </button>
    </StandardTooltip>
  )
}

// InfoTooltip with Provider for isolated usage
interface InfoTooltipWithProviderProps extends InfoTooltipProps {
  children?: React.ReactNode
}

export const InfoTooltipWithProvider = ({
  content,
  side = "top",
  align = "center",
  className,
  delayDuration = 300,
  children,
}: InfoTooltipWithProviderProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children || (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Additional information"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default InfoTooltip