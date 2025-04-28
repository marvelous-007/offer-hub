"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/freelancer-profile/steps/header";

type Props = {
  prevStep: () => void;
  nextStep: () => void;
};

export default function UserAddWorkExperience({ prevStep, nextStep }: Props) {
  const [role, setRole] = useState("");

  return (
    <div className="flex flex-col gap-y-8 w-full max-w-xl mx-auto p-4">
      <Header />
      <div className="text-sm text-gray-500">Step 4/10</div>

      <section>
        <h1 className="text-2xl font-bold mt-4">
          Now, Let’s tell the world what you have been about.
        </h1>
        <p className="text-gray-600 mt-2">
          It’s the very first thing clients see, so make it count. Stand out by describing your expertise in your own words.
        </p>
      </section>

      <section className="relative mt-6">
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Exp: Creative Writer"
          className="w-full border p-3 pl-10 rounded"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </section>

      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="ghost" className="gap-1 rounded-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-[#149A9B] text-white rounded-full md:min-w-36"
        >
          Add Experience
        </Button>
      </div>
    </div>
  );
}
