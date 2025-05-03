// app/user-management/layout.tsx
"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { Menu } from "lucide-react";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header - Full Width */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        showMenuButton={true} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
        <div 
          className={`fixed md:relative inset-y-0 left-0 transform md:transform-none transition-transform duration-300 ease-in-out z-30 md:block ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f2f4f9] ">
          {children}
        </main>
      </div>
    </div>
  );
}