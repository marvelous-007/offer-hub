// Type definitions for the freelancer profile flow

// Work experience entry type
export interface WorkExperience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
  location?: string
}

// Education entry type
export interface Education {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string
  description?: string
  location?: string
}

// Language entry type
export interface Language {
  id: string
  language: string
  level: string
}

// User data type for the freelancer profile
export interface UserProfileData {
  name?: string
  email?: string
  location?: string
  profilePicture?: string
  title?: string
  bio?: string
  bulletPoints?: string[]
  hourlyRate?: string
  skills?: string[]
  workExperience?: WorkExperience[]
  education?: Education[]
  languages?: Language[]
  achievements?: string[]
}

// Props type for profile step components
export interface ProfileStepProps {
  userData?: UserProfileData
  updateUserData?: (data: Partial<UserProfileData>) => void
  nextStep?: () => void
  prevStep?: () => void
  goToStep?: (stepKey: string) => void
  onComplete?: (data: UserProfileData) => Promise<void>
}