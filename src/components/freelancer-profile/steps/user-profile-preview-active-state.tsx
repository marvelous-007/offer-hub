'use client'

import { useState } from 'react'
import { Edit, Trash2, ChevronRight } from 'lucide-react'
import ProfileHeader from '@/components/profile/profile-header'

// Mock user data - in a real app, this would come from props or context
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: 'New York, USA',
  profilePicture: '/placeholder-profile.jpg',
  bio: 'Experienced web developer with 5+ years in React, Next.js, and TypeScript. Passionate about creating clean, user-friendly interfaces.',
  hourlyRate: '0.05',
  skills: ['React', 'TypeScript', 'Next.js', 'UI/UX', 'Web3'],
  workExperience: [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Leading frontend development for multiple projects.'
    },
    {
      id: '2',
      title: 'Web Developer',
      company: 'Digital Agency',
      startDate: '2018-03',
      endDate: '2019-12',
      description: 'Developed responsive websites for various clients.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'BSc Computer Science',
      institution: 'University of Technology',
      startDate: '2014-09',
      endDate: '2018-06'
    }
  ],
  languages: [
    { id: '1', language: 'English', level: 'Native' },
    { id: '2', language: 'Spanish', level: 'Intermediate' }
  ],
  achievements: ['Certified Web Developer', 'Hackathon Winner 2022']
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  if (dateString === 'Present') return 'Present'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function UserProfilePreviewActiveState() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState(mockUserData)

  const handleSubmitProfile = async () => {
    setIsSubmitting(true)
    
    try {
      // Here you would submit the data to your backend
      // await submitProfileData(userData)
      
      // Navigate to success page or dashboard
      // router.push('/dashboard')
      console.log('Profile submitted successfully!')
      alert('Profile submitted successfully!')
    } catch (error) {
      console.error('Error submitting profile:', error)
    } finally {
      setIsSubmitting(false)
    }

    setUserData(mockUserData)
  }

  // Function to navigate to specific editing steps
  const navigateToSection = (sectionKey: string) => {
    // Map section names to step indices
    const sectionToStepMap: Record<string, number> = {
      'profile': 0,
      'skills': 2,
      'workExperience': 3,
      'education': 7,
      'languages': 8,
      'bio': 9,
      'hourlyRate': 10
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <ProfileHeader />
      
      <h1 className="text-3xl font-bold mb-6">Preview Profile</h1>
      
      {/* Confirmation Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex justify-between flex-col items-start gap-4">
          <p className="text-blue-800">
            Looking good {userData.name}. Make any edits you want, then submit your profile. 
            You can make more changes after it's live.
          </p>
          <button
            onClick={handleSubmitProfile}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Profile'}
          </button>
        </div>
      </div>
      
      {/* Profile Header Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
              {/* {userData.profilePicture && (
                <img
                  src={userData.profilePicture}
                  alt={`${userData.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              )} */}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-gray-600">{userData.location}</p>
            </div>
          </div>
          <button 
            onClick={() => navigateToSection('profile')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
      </div>
      
      {/* Bio Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">Bio</h3>
          <button 
            onClick={() => navigateToSection('bio')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <p className="text-gray-700">{userData.bio}</p>
      </div>
      
      {/* Hourly Rate Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">Hourly Rate</h3>
          <button 
            onClick={() => navigateToSection('hourlyRate')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="flex items-center">
          <span className="flex items-center font-medium text-xl">
            <span className="mr-2">Ξ</span> {userData.hourlyRate} ETH/hr
          </span>
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Achievements</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {userData.achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center h-24 w-24 bg-gray-100 rounded-lg text-center p-2"
            >
              <span className="text-sm">{achievement}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <button 
            onClick={() => navigateToSection('skills')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Work Experience Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Work Experience</h3>
          <button 
            onClick={() => navigateToSection('workExperience')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {userData.workExperience.map((exp) => (
            <div key={exp.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between">
                <h4 className="font-medium">{exp.title}</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateToSection('workExperience')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Education Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Education</h3>
          <button 
            onClick={() => navigateToSection('education')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {userData.education.map((edu) => (
            <div key={edu.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between">
                <h4 className="font-medium">{edu.degree}</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigateToSection('education')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Languages Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Languages</h3>
          <button 
            onClick={() => navigateToSection('languages')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {userData.languages.map((lang) => (
            <div key={lang.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{lang.language}</span>
                <span className="text-gray-500 ml-2">({lang.level})</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigateToSection('languages')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmitProfile}
          disabled={isSubmitting}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Profile'}
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  )
}