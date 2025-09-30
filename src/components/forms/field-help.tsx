"use client"

import React from 'react'
import { HelpCircle, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, getVariantStyles } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { FieldHelpProps } from '../ui/tooltip-types'

export default function FieldHelp({
  children,
  helpText,
  errorText,
  successText,
  warningText,
  infoText,
  variant = 'help',
  side = 'right',
  align = 'center',
  size = 'md',
  className,
  disabled = false,
  showIcon = true,
  icon,
  required = false,
  optional = false,
  ...props
}: FieldHelpProps) {
  // Determine variant based on available text
  const getVariant = () => {
    if (errorText) return 'error'
    if (successText) return 'success'
    if (warningText) return 'warning'
    if (infoText) return 'info'
    return variant
  }

  const getText = () => {
    if (errorText) return errorText
    if (successText) return successText
    if (warningText) return warningText
    if (infoText) return infoText
    return helpText
  }

  const getIcon = () => {
    if (icon) return icon
    
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    
    switch (getVariant()) {
      case 'error':
        return <XCircle className={cn(iconSize, "text-red-500")} />
      case 'success':
        return <CheckCircle className={cn(iconSize, "text-green-500")} />
      case 'warning':
        return <AlertCircle className={cn(iconSize, "text-yellow-500")} />
      case 'info':
        return <Info className={cn(iconSize, "text-blue-500")} />
      default:
        return <HelpCircle className={cn(iconSize, "text-gray-400")} />
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-base px-4 py-2'
      default:
        return 'text-sm px-3 py-1.5'
    }
  }

  const getTriggerSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-6 w-6'
      default:
        return 'h-5 w-5'
    }
  }

  const content = getText()

  if (!content || disabled) {
    return <>{children}</>
  }

  const getVariantStyles = () => {
    switch (getVariant()) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'help':
        return 'bg-gray-50 border-gray-200 text-gray-900'
      default:
        return 'bg-white border-gray-200 text-gray-900'
    }
  }

  return (
    <div className="relative w-full">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(getVariantStyles(), "max-w-xs")}
        >
          <div className="flex items-start gap-2">
            {getVariantIcon(getVariant()) && (
              <div className="flex-shrink-0 mt-0.5">
                {getVariantIcon(getVariant())}
              </div>
            )}
            <div className="flex-1">
              <div className="space-y-1">
                <div className="font-medium">
                  {getVariant() === 'error' && 'Error'}
                  {getVariant() === 'success' && 'Success'}
                  {getVariant() === 'warning' && 'Warning'}
                  {getVariant() === 'info' && 'Information'}
                  {getVariant() === 'help' && 'Help'}
                </div>
                <div className="text-sm opacity-90">
                  {content}
                </div>
                {(required || optional) && (
                  <div className="text-xs opacity-75 pt-1 border-t border-gray-200">
                    {required && 'This field is required'}
                    {optional && 'This field is optional'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      {showIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {getVariantIcon(getVariant())}
        </div>
      )}
    </div>
  )
}

// Specialized field help components
export function FieldError({ 
  children, 
  errorText, 
  ...props 
}: Omit<FieldHelpProps, 'variant' | 'errorText'> & { errorText: string }) {
  return (
    <FieldHelp
      variant="error"
      errorText={errorText}
      {...props}
    >
      {children}
    </FieldHelp>
  )
}

export function FieldSuccess({ 
  children, 
  successText, 
  ...props 
}: Omit<FieldHelpProps, 'variant' | 'successText'> & { successText: string }) {
  return (
    <FieldHelp
      variant="success"
      successText={successText}
      {...props}
    >
      {children}
    </FieldHelp>
  )
}

export function FieldWarning({ 
  children, 
  warningText, 
  ...props 
}: Omit<FieldHelpProps, 'variant' | 'warningText'> & { warningText: string }) {
  return (
    <FieldHelp
      variant="warning"
      warningText={warningText}
      {...props}
    >
      {children}
    </FieldHelp>
  )
}

export function FieldInfo({ 
  children, 
  infoText, 
  ...props 
}: Omit<FieldHelpProps, 'variant' | 'infoText'> & { infoText: string }) {
  return (
    <FieldHelp
      variant="info"
      infoText={infoText}
      {...props}
    >
      {children}
    </FieldHelp>
  )
}

// Form field wrapper with integrated help
interface FormFieldWithHelpProps {
  label: string
  children: React.ReactNode
  helpText?: string
  errorText?: string
  successText?: string
  warningText?: string
  infoText?: string
  required?: boolean
  optional?: boolean
  className?: string
}

export function FormFieldWithHelp({
  label,
  children,
  helpText,
  errorText,
  successText,
  warningText,
  infoText,
  required = false,
  optional = false,
  className,
  ...props
}: FormFieldWithHelpProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-gray-500 ml-1">(optional)</span>}
      </label>
      <FieldHelp
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        warningText={warningText}
        infoText={infoText}
        required={required}
        optional={optional}
        {...props}
      >
        {children}
      </FieldHelp>
    </div>
  )
}
