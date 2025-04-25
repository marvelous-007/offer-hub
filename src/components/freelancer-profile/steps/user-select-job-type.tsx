'use client'

import { useState } from 'react'
import Header from '@/components/freelancer-search/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'

const CATEGORIES = [
  'IT & Networking',
  'Design & Creative',
  'Development & Programming',
  'Writing & Translation',
  'Marketing & Sales',
]

const JOB_TYPES_MAP: Record<string, string[]> = {
  'IT & Networking': ['Network Setup', 'Security Analysis', 'Cloud Engineering'],
  'Design & Creative': ['Logo Design', 'UI/UX Design', 'Animation'],
  'Development & Programming': ['Frontend Dev', 'Backend Dev', 'Mobile Apps'],
  'Writing & Translation': ['Content Writing', 'Technical Writing', 'Translation'],
  'Marketing & Sales': ['SEO', 'PPC Advertising', 'Email Marketing'],
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
      <Header />
      <div className="text-sm text-muted-foreground">Step 2/10</div>

      <h2 className="text-2xl font-semibold">Great, so what kind of projects are you looking for?</h2>
      <p className="text-muted-foreground">Don’t worry you can change these choices later on.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Left: Category (Single Select) */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select a category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <Card
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedJobTypes([])
                }}
                className={cn(
                  'cursor-pointer',
                  selectedCategory === cat && 'ring-2 ring-primary'
                )}
              >
                <CardContent className="p-4">{cat}</CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Job Types (Multi Select up to 3) */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select up to 3 job types</h3>
          <div className="space-y-2">
            {jobOptions.map((job) => (
              <Card
                key={job}
                onClick={() => handleSelectJobType(job)}
                className={cn(
                  'cursor-pointer',
                  selectedJobTypes.includes(job) && 'ring-2 ring-primary'
                )}
              >
                <CardContent className="p-4">{job}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!selectedCategory || selectedJobTypes.length === 0}
        >
          Choose type of job
        </Button>
      </div>
    </div>
  )
}
