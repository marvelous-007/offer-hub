"use client";

import { useState } from "react";

export default function UserAddWorkExperienceBody() {
  const [role, setRole] = useState("");

  return (
    <main className="flex flex-col items-center px-4 pt-8 pb-28">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-base font-semibold text-[#B4B9C9]">
          4/10
        </div>        <div className="space-y-2">
          <h1 className="text-[20px] font-semibold leading-none text-[#19213D]">
            Now, Let tell the world what you have been about.
          </h1>
          <p className="text-[12px] font-normal leading-none text-[#19213D]">
            It’s the very first thing clients see, so make it count. Stand out by describing your expertise in your own words.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="role" className="text-sm font-medium text-[#19213D]">
            Your professional role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Example: Design & Creative"
            className="w-full border border-[#19213D] rounded-[16px] p-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19213D]"
          />
        </div>
      </div>
    </main>
  );
}
