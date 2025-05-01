import Header from "@/components/admin/layouts/Header";
import Sidebar from "@/components/admin/layouts/Sidebar";
import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
