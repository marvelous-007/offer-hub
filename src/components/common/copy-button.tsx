"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Custom fallback UI */
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Whether to show a reset button */
  showResetButton?: boolean;
  /** Custom reset function */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and display JavaScript errors
 * in child component tree.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    
    // Call custom reset function if provided
    this.props.onReset?.();
  };

  reloadPage = () => {
    window.location.reload();
  };

  goHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try again.
              </p>
              
              {/* Error Details - Only show in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-3 bg-muted rounded-lg text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Error Details:</span>
                  </div>
                  <code className="text-xs text-red-600 dark:text-red-400 break-all">
                    {this.state.error.message}
                  </code>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        Stack trace
                      </summary>
                      <pre className="text-xs mt-2 text-muted-foreground overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {this.props.showResetButton !== false && (
                <Button
                  onClick={this.resetError}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              )}
              
              <Button
                onClick={this.reloadPage}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              
              <Button
                onClick={this.goHome}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {/* Support Information */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                If the problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;