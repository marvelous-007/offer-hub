"use client";

import { useCallback } from "react";

export interface UseErrorHandlerOptions {
  /** Callback when error occurs */
  onError?: (error: Error) => void;
  /** Whether to show error in console */
  logError?: boolean;
}

/**
 * Hook for handling errors in components
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { onError, logError = true } = options;

  const handleError = useCallback((error: unknown) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (logError) {
      console.error("Error handled:", errorObj);
    }
    
    onError?.(errorObj);
  }, [onError, logError]);

  return {
    handleError,
  };
}