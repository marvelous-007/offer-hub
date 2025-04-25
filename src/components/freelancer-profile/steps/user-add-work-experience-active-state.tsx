"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Info, ArrowLeft } from "lucide-react"
import { Experience } from '@/app/types/freelancer-profile'
import ExperienceCard from '@/components/freelancer-profile/experience-card'
import AddWorkExperienceForm from '@/components/freelancer-profile/add-work-experience-form'
import Footer from '@/components/freelancer-profile/footer'

type Props = {
  stepCount: number
  currentStep: number
  nextStep: () => void
  prevStep: () => void
}

function UserAddWorkExperienceActiveState({
  stepCount,
  currentStep,
  nextStep,
  prevStep,
}: Props) {
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false)

  const [experienceList, setExperienceList] = useState<Experience[]>([])
  const hasAddedExperience = !!experienceList.length
  const handleAddExperience = (experience: Experience) => {
    setExperienceList((prev) => [...prev, experience])
    setShowAddExperienceForm(false)
  }

  return (
    <div className='flex flex-col gap-y-16 w-full'>
      <div className='flex-1 max-w-xl w-full mx-auto px-4'>
        {
          !showAddExperienceForm ? 
          <>
            <section>
              <span className='font-semibold text-2xl text-[#6D758F]'>{currentStep}/{stepCount}</span>
              <h2 className='text-3xl mt-6 text-[#002333]'>Share your work experience, what are your relevant work experiences.</h2>
              <p className='text-lg font-medium text-[#6D758F] mt-4'>
                Freelancers who add their relevant work experiences wins client trust. But if you’re just starting out,
                you can still create a great profile. Just head on to the next page.
              </p>
            </section>

            <hr className='my-8 border-[#B4B9C9]' />

            <section>
              <h3 className='text-[#344054] font-medium text-2xl'>Add your experience</h3>
              {
                hasAddedExperience ?
                  <div className='mt-4 grid grid-cols-1 gap-4'>
                    {
                      experienceList.map((experience, index) => (
                        <ExperienceCard {...experience} key={index} />
                      ))
                    }
                  </div> :
                  <span className='flex items-center gap-1 text-[#6D758F] text-sm font-normal'>
                    <Info size={18} /> Add at least one item
                  </span>
              }
              <Button
                onClick={() => setShowAddExperienceForm(true)}
                variant="outline"
                className={`gap-1 ${hasAddedExperience? 'bg-[#149A9B] text-white hover:bg-[#149A9B]/80 hover:text-white' :
                'border-[#149A9B] bg-transparent'} rounded-full mt-4`}>
                <Plus size={18} /> Add experience
              </Button>
            </section>
          </> :

          <AddWorkExperienceForm addExperience={handleAddExperience} />
        }
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
          {
            showAddExperienceForm ?
            <>
            <Button
              onClick={() => setShowAddExperienceForm(false)}
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
            </> :
            <>
              {hasAddedExperience && <Button
                onClick={nextStep}
                variant="outline"
                className='border-[#149A9B] text-[#149A9B] hover:text-[#149A9B]
                bg-transparent rounded-full md:min-w-36'>
                Skip
              </Button>}

              <Button
                onClick={nextStep}
                className='gap-1 bg-[#149A9B] text-white rounded-full md:min-w-36'>
                Add Education
              </Button>
            </>
          }
        </div>
      </Footer>
    </div>
  )
}

export default UserAddWorkExperienceActiveState