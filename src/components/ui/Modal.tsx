"use client";
import React, { useEffect, useRef, KeyboardEvent, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function Modal({ 
  children, 
  isOpen = true, 
  onClose,
  title,
  description,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  initialFocusRef,
  showCloseButton = true,
  size = 'md',
  className = ""
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Get all focusable elements within the modal
  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(modalRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  };

  // Handle keyboard navigation within the modal
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        if (closeOnEscape && onClose) {
          e.preventDefault();
          onClose();
        }
        break;
      
      case 'Tab':
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstFocusableElement.current) {
            e.preventDefault();
            lastFocusableElement.current?.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastFocusableElement.current) {
            e.preventDefault();
            firstFocusableElement.current?.focus();
          }
        }
        break;
      
      case 'Home':
        e.preventDefault();
        firstFocusableElement.current?.focus();
        break;
      
      case 'End':
        e.preventDefault();
        lastFocusableElement.current?.focus();
        break;
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Set up focusable elements
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0];
        lastFocusableElement.current = focusableElements[focusableElements.length - 1];
      }

      // Focus the initial element or first focusable element
      setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (firstFocusableElement.current) {
          firstFocusableElement.current.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Return focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialFocusRef]);

  // Update focusable elements when children change
  useEffect(() => {
    if (isOpen) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0];
        lastFocusableElement.current = focusableElements[focusableElements.length - 1];
      }
    }
  }, [isOpen, children]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto focus:outline-none ${className}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header with close button */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={handleCloseClick}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#15949C] focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        
        {/* Description for screen readers */}
        {description && (
          <p id="modal-description" className="sr-only">
            {description}
          </p>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}