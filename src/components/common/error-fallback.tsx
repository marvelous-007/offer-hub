"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface ErrorFallbackProps {
  /** The error that was thrown */
  error: Error;
  /** Function to reset the error boundary */
  resetError: () => void;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Whether to show error details */
  showErrorDetails?: boolean;
}

/**
 * Custom fallback UI for error boundaries
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  showErrorDetails = process.env.NODE_ENV === 'development',
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center">{message}</p>
        
        {showErrorDetails && error && (
          <div className="p-3 bg-muted rounded-lg">
            <details>
              <summary className="cursor-pointer text-sm font-medium">
                Error Details
              </summary>
              <div className="mt-2">
                <code className="text-xs text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </code>
              </div>
            </details>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={resetError}
          className="w-full flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorFallback;