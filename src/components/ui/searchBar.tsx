"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center px-4 py-2 rounded-[23.5px] border border-[#DEEFE7] bg-[#DEEFE7] w-[393px] h-[47px]">
      <Input
        type="text"
        placeholder="Designer, developer..."
        className="bg-transparent text-[#002333] placeholder:text-[#B4BEC9] text-sm flex-grow outline-none"
      />
      <Search className="text-[#002333] w-5 h-5 ml-2" /> 
    </div>
  );
}
