"use client";

import { ReactNode } from "react";

interface CreateProjectLayoutProps {
  children: ReactNode;
}

export function CreateProjectLayout({ children }: CreateProjectLayoutProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with white background */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-base font-semibold text-gray-900">Create project</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
} 