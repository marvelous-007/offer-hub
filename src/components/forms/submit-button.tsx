"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  className = "",
  variant = 'default',
  type = 'submit',
  onClick,
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantStyles = {
    default: "bg-[#002333] text-white hover:bg-gray-800 focus:ring-[#19213D]",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[#19213D]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-[#002333] hover:underline focus:ring-[#19213D]"
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {isLoading ? 'Processing...' : children}
    </button>
  )
}

export default SubmitButton