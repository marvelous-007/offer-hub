'use client'
import type { ReactNode  } from "react";
import { useState } from "react";

export default function DisputeResolutionLayout({ children }: { children: ReactNode }) {
 
  return <div className="min-h-screen bg-white pt-5">
      {children}
  </div>;
} 