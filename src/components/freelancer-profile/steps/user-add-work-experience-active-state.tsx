"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react"
import { Experience } from '@/app/types/freelancer-profile'
import AddWorkExperienceForm from '@/components/freelancer-profile/add-work-experience-form'
import Footer from '@/components/freelancer-profile/footer'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'

function UserAddWorkExperienceActiveState() {
  const { currentStep, nextStep, prevStep } = useFreelancerSteps()
  const [experienceList, setExperienceList] = useState<Experience[]>([])
  const handleAddExperience = (experience: Experience) => {
    setExperienceList((prev) => [...prev, experience])
    nextStep()
  }

  return (
    <div className='flex flex-col gap-y-16 w-full'>
      <div className='flex-1 max-w-xl w-full mx-auto px-4'>
        <AddWorkExperienceForm addExperience={handleAddExperience} />
      </div>
      
      <Footer className='px-4 flex justify-between'>
        <div>
          <Button
            onClick={prevStep}
            variant="ghost" className='gap-1 rounded-full'>
            <ArrowLeft size={18} /> Back
          </Button>
        </div>

        <div className='space-x-4'>
          <Button
            onClick={() => {}}
            variant="outline"
            className='border-[#149A9B] text-[#149A9B] hover:text-[#149A9B]
            bg-transparent rounded-full md:min-w-36'>
            Cancel
          </Button>
          <Button
            type='submit'
            form='add-work-experience-form'
            className='gap-1 bg-[#149A9B] text-white rounded-full md:min-w-36'>
            Save
          </Button>
        </div>
      </Footer>
    </div>
  )
}

export default UserAddWorkExperienceActiveState