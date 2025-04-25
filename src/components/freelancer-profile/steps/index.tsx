'use client'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'
import UserAddWorkExperienceActiveState from '@/components/freelancer-profile/steps/user-add-work-experience-active-state'
import Header from '@/components/freelancer-profile/header'

const steps = [
  { key: 'user-choose-role', component: null }, // to be implemented
  { key: 'user-select-job-type', component: null }, // to be implemented
  { key: 'user-select-interested-category', component: null },  // to be implemented
  { key: 'user-add-work-experience', component: null },  // to be implemented
  { key: 'user-add-work-experience-active-state', component: UserAddWorkExperienceActiveState },
  { key: 'user-add-work-experience-active-state-not-in-focus', component: null },  // to be implemented
  { key: 'user-add-work-experience-default-state', component: null },  // to be implemented
  { key: 'user-add-education-default-state', component: null },  // to be implemented
  { key: 'user-choose-languaje-active-state', component: null },  // to be implemented
  { key: 'user-write-bio', component: null },  // to be implemented
  { key: 'user-enter-service-fee', component: null },  // to be implemented
  { key: 'user-setting-up-account-profile-active-state', component: null },  // to be implemented
  { key: 'user-profile-photo-active-and-focus-state', component: null },  // to be implemented
  { key: 'user-profile-set-uo-preview', component: null },  // to be implemented
]

export default function StepsController() {
  const { currentStep, nextStep, prevStep } = useFreelancerSteps()
  const StepComponent = steps[currentStep]?.component

  return (
    <section className='flex flex-col gap-y-16 pt-8 min-h-svh'>
      <Header />

      <div className='flex-1 flex'>
        {
          StepComponent ?
          <StepComponent
            stepCount={steps.length}
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
          /> :
          <p>This step is not yet implemented.</p>
        }
      </div>
    </section>
  )
}
