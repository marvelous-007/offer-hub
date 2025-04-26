'use client'

import React, { useState } from 'react'
import Header from '@/components/freelancer-search/header'
import { Button } from '@/components/ui/button'
//import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'

// Fake skill list for now (you can replace with API data later)
const ALL_SKILLS = [
  'Illustration',
  'Informational Infographic',
  'Brand Development',
  'Music Production',
  'Creative Brief',
  'Creative Computer Services',
  'Creative Strategy',
  'Creative Writing',
  'Adobe Creative Cloud',
  'Branding & Marketing',
  'Branding',
  'Branding Management',
]

export default function UserSelectJobType() {
  const { prevStep, nextStep } = useFreelancerSteps()

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelectSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : prev.length < 4 // 1 main + 3 optional
        ? [...prev, skill]
        : prev
    )
  }

  const filteredSkills = ALL_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Header title="3/10" />

      <h2 className="text-2xl font-semibold">You’re close! What work are you here to do?</h2>
      <p className="text-muted-foreground">
        Your skills show clients what you can offer, and help us choose which jobs to recommend to you.
      </p>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Search Input */}
      <div>
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Skill Suggestions Dropdown */}
      {searchTerm && (
        <div className="border rounded-md shadow-md max-h-48 overflow-auto">
          {filteredSkills.map((skill) => (
            <div
              key={skill}
              onClick={() => {
                handleSelectSkill(skill)
                setSearchTerm('') // Clear after selection
              }}
              className={cn(
                'p-3 cursor-pointer hover:bg-muted',
                selectedSkills.includes(skill) && 'bg-primary/10'
              )}
            >
              {skill}
            </div>
          ))}
          {filteredSkills.length === 0 && (
            <div className="p-3 text-muted-foreground text-sm">No matching skills found.</div>
          )}
        </div>
      )}

      {/* Suggested Skills Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Suggested Skills</h3>
        <div className="flex flex-wrap gap-2">
          {['Branding & Marketing', 'Branding', 'Branding Management'].map((suggestedSkill) => (
            <Button
              key={suggestedSkill}
              variant="outline"
              size="sm"
              onClick={() => handleSelectSkill(suggestedSkill)}
              disabled={selectedSkills.includes(suggestedSkill)}
            >
              + {suggestedSkill}
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={selectedSkills.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
