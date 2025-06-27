"use client"

import { useState } from "react"
import ProfileCard from "./profile-card"
import EditProfileForm from "./edit-profile-form"
import ChangePasswordForm from "./change-password-form"

type ProfileView = "overview" | "edit" | "security"

interface ProfileSectionProps {
  className?: string
}

export default function ProfileSection({ className }: ProfileSectionProps) {
  const [currentView, setCurrentView] = useState<ProfileView>("overview")
  const [userData, setUserData] = useState({
    name: "Aminu A.",
    firstName: "Aminu",
    lastName: "Abdulrasheed",
    email: "youremail@domain.com",
    phone: "",
    avatar: "/verificationImage.svg",
  })

  const handleSaveProfile = (data: any) => {
    setUserData((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
    }))
    setCurrentView("overview")
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "overview":
        return (
          <ProfileCard
            user={userData}
            onEditProfile={() => setCurrentView("edit")}
            onSecurity={() => setCurrentView("security")}
          />
        )
      case "edit":
        return (
          <EditProfileForm
            user={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
            }}
            onBack={() => setCurrentView("overview")}
            onSave={handleSaveProfile}
          />
        )
      case "security":
        return <ChangePasswordForm onBack={() => setCurrentView("overview")} />
      default:
        return null
    }
  }

  return <div className={className}>{renderCurrentView()}</div>
}
