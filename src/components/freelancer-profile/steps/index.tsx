'use client'

import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'
import UserSelectJobType from './user-select-job-type'

const steps = [
  { key: 'user-choose-role', component: null }, // to be implemented
  { key: 'user-select-job-type', component: UserSelectJobType },
  { key: 'user-select-interested-category', component: null },  // to be implemented
  { key: 'user-add-work-experience', component: null },  
  { key: 'user-add-work-experience-active-state', component: null },  
  { key: 'user-add-work-experience-active-state-not-in-focus', component: null },  
  { key: 'user-add-work-experience-default-state', component: null },  
  { key: 'user-add-education-default-state', component: null },  
  { key: 'user-choose-language-active-state', component: null },  
  { key: 'user-write-bio', component: null },  
  { key: 'user-enter-service-fee', component: null },  
  { key: 'user-setting-up-account-profile-active-state', component: null },  
  { key: 'user-profile-photo-active-and-focus-state', component: null },  
  { key: 'user-profile-set-up-preview', component: null },  
]

export default function StepsController() {
  const { currentStep, nextStep, prevStep } = useFreelancerSteps()
  const StepComponent = steps[currentStep]?.component

  return (
    <>
      {StepComponent ? <StepComponent /> : <p>This step is not yet implemented.</p>}


      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} disabled={currentStep === 0}>
          Back
        </button>
        <button onClick={nextStep} disabled={currentStep === steps.length - 1}>
          Next
        </button>
      </div>
    </>
  )
}
