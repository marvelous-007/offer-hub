'use client'

import React, { useState } from 'react'
import Header from "@/components/freelancer-profile/steps/header";
import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react";
import { cn } from '@/lib/utils'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'

const CATEGORIES = [
  'Accounting & Consulting',
  'Admin Support',
  'Customer Service',
  'Data Science & Analytics',
  'Design & Creative',
  'Engineering & Architecture',
  'IT Networking',
  'Legal',
  'Sales & Marketing',
  'Translation',
  'Web, Mobile & Software Dev',
  'Writing',
]

const JOB_TYPES_MAP: Record<string, string[]> = {
  'Accounting & Consulting': ['Financial Analysis', 'Bookkeeping', 'Payroll Services'],
  'Admin Support': ['Data Entry', 'Virtual Assistant', 'Project Coordination'],
  'Customer Service': ['Customer Support', 'Technical Support', 'Client Management'],
  'Data Science & Analytics': ['Data Analysis', 'Data Visualization', 'Machine Learning'],
  'Design & Creative': ['Product Design', 'Photography', 'Video & Animation'],
  'Engineering & Architecture': ['Mechanical Design', 'CAD Drafting', 'Architecture Planning'],
  'IT Networking': ['Network Setup', 'Security Analysis', 'Cloud Engineering'],
  'Legal': ['Contract Drafting', 'Legal Consulting', 'Compliance'],
  'Sales & Marketing': ['SEO', 'PPC Advertising', 'Email Marketing'],
  'Translation': ['Language Translation', 'Localization', 'Subtitling'],
  'Web, Mobile & Software Dev': [
    'Blockchain, NFT & Cryptocurrency',
    'AI Apps & Integration',
    'Desktop Application Development',
    'Game Design & Development',
    'Web & Mobile Design',
    'Web Development',
  ],
  'Writing': ['Content Writing', 'Technical Writing', 'Blogging'],
}

export default function UserSelectJobType() {
  const { prevStep, nextStep } = useFreelancerSteps()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])

  const handleSelectJobType = (job: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(job)
        ? prev.filter((j) => j !== job)
        : prev.length < 3
        ? [...prev, job]
        : prev
    )
  }

  const jobOptions = selectedCategory ? JOB_TYPES_MAP[selectedCategory] || [] : []

  return (
    <div className="space-y-6">
      <Header title="2/10" />

      <h2 className="text-2xl font-semibold">
        Great, so what kind of projects are you looking for?
      </h2>
      <p className="text-[#149A9B]">
  Don’t worry you can change these choices later on.
</p>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        {/* Left: Categories List */}
        <div className="space-y-3 ">
          <h3 className="text-lg font-medium ">Select 1 Category</h3>
          <div className="flex flex-col space-y-2 ">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedJobTypes([])
                }}
                className={cn(
                  'text-left px-2 py-1 rounded-md hover:bg-muted transition',
                  selectedCategory === cat && 'text-[#149A9B] font-semibold underline'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Job Types Checkboxes */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Select 3 options</h3>
          <div className="flex flex-col space-y-3">
            {jobOptions.map((job) => (
              <label key={job} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedJobTypes.includes(job)}
                  onChange={() => handleSelectJobType(job)}
                  disabled={
                    !selectedJobTypes.includes(job) && selectedJobTypes.length >= 3
                  }
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{job}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
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
  )
}
