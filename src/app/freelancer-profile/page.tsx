"use client"

import StepsController from "@/components/freelancer-profile/steps"
import { useFreelancerOnboarding } from "@/hooks/use-freelancer-steps"

export default function FreelancerProfilePage() {
  const { currentStep, userData, nextStep, prevStep, updateUserData } = useFreelancerOnboarding()

  return (
    <div className="relative bg-[#f6f6f6] min-h-screen">
      <StepsController
        currentStep={currentStep}
        userData={userData}
        nextStep={nextStep}
        prevStep={prevStep}
        updateUserData={updateUserData}
      />
    </div>
  )
}
