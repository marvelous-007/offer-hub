"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from "lucide-react"
import Footer from '@/components/freelancer-profile/footer'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'
import { Stack } from '@/components/ui/stack'
import { Textarea } from '@/components/ui/textarea'
import ExampleBioCard from './user-add-bio-example-card'

function UserAddBioActiveState() {
  const { nextStep, prevStep } = useFreelancerSteps()
  const [bio, setBio] = useState("")
  const [bioError, setBioError] = useState("")
  
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
    if (e.target.value.length < 100) {
      setBioError("Bio must be at least 100 characters")
    } else {
      setBioError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (bio.length < 100) {
      setBioError("Bio must be at least 100 characters")
      return
    }
    nextStep()
  }

  return (
    <div className='flex flex-col gap-y-16 w-full'>
      <div className='flex-1 max-w-xl w-full mx-auto px-4'>
        <form id="add-bio-form" onSubmit={handleSubmit}>
          <Stack className="font-semibold space-y-4">
            <p className="text-neutral-500">8/10</p>
            <h1 className="text-lg text-[#19213D]">
              Great. Now write a bio to tell the world about yourself.
            </h1>
            <p className="font-normal text-xs text-[#19213D]">
              Help people get to know you at a glance. What work do you do best? Tell them clearly. 
              Using paragraphs or bullet points. You can always edit later; just make sure you proof read now.
            </p>
          </Stack>

          <div className="mt-8">
            <label htmlFor="bio" className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
              className="w-full min-h-32 border border-[#19213D] rounded-lg p-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19213D]"
            />
            <div className="flex justify-between mt-2">
              {bioError && (
                <span className="text-red-500 text-xs">{bioError}</span>
              )}
              <span className={`text-xs ${bio.length < 100 ? 'text-gray-500' : 'text-gray-500'}`}>
                At least 100 characters ({bio.length}/100)
              </span>
            </div>
          </div>

          <ExampleBioCard />
        </form>
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
            onClick={nextStep}
            variant="outline"
            className='border-[#149A9B] text-[#149A9B] hover:text-[#149A9B]
            bg-transparent rounded-full md:min-w-36'>
            Skip
          </Button>
          <Button
            type='submit'
            form='add-bio-form'
            className='gap-1 bg-[#149A9B] text-white rounded-full md:min-w-36'>
            Set your rate
          </Button>
        </div>
      </Footer>
    </div>
  )
}

export default UserAddBioActiveState