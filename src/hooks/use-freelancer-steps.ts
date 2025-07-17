import { useState } from "react"

export function useFreelancerSteps() {
  const [currentStep, setCurrentStep] = useState(10)

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return { currentStep, nextStep, prevStep }
}
