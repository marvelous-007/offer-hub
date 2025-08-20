"use client";

import Header from '@/components/client-dashboard/Header'
import { ClientSidebar } from '@/components/client-dashboard/Sidebar' // Adjust the import path as needed
import { Button } from '@/components/ui/button';
import { Heart, Filter, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const TalentPage = () => {
  const talents = [
    {
      id: 1,
      name: "John D",
      title: "UI/UX designer | Brand designer | Figma pro",
      location: "Canada",
      avatar: "/avatar.png",
      skills: [
        { name: "UI/UX", color: "bg-gray-500" },
        { name: "Design", color: "bg-red-500" },
        { name: "Figma", color: "bg-purple-500" },
        { name: "Product design", color: "bg-blue-400" },
        { name: "Framer", color: "bg-yellow-200 text-black" }
      ],
      description: "I am a UI/UX designer with 4 years of experience in creating user-friendly interfaces and enhancing user experiences. My passion lies in understanding user needs and translating them into intuitive designs that dri...",
      actionText: "Message"
    },
    {
      id: 2,
      name: "Alex R",
      title: "Creative Designer | Visual Artist | Figma Specialist",
      location: "Australia",
      avatar: "/avatar.png",
      skills: [
        { name: "User Experience", color: "bg-gray-500" },
        { name: "Creative Solutions", color: "bg-red-500" },
        { name: "Sketch", color: "bg-purple-400" },
        { name: "Interface Design", color: "bg-blue-400" },
        { name: "Webflow", color: "bg-yellow-200 text-black" }
      ],
      description: "I am a UI/UX designer with four years of experience in crafting user-centric interfaces and improving overall user experiences. I thrive on identifying user requirements and transforming them into seamless designs tha...",
      actionText: "Contact Me"
    },
    {
      id: 3,
      name: "Jordan T",
      title: "Innovative Creator | Digital Artist | Figma Expert",
      location: "New Zealand",
      avatar: "/avatar.png",
      skills: [
        { name: "User Interaction", color: "bg-gray-500" },
        { name: "Inventive Strategies", color: "bg-red-500" },
        { name: "Adobe XD", color: "bg-purple-500" },
        { name: "User Interface Development", color: "bg-blue-400" },
        { name: "Squarespace", color: "bg-yellow-200 text-black" }
      ],
      description: "I am a UI/UX designer with five years of experience in creating user-focused interfaces and enhancing overall user satisfaction. I excel at understanding user needs and translating them into intuitive designs that boost...",
      actionText: "Get in Touch"
    }
  ];

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <div className='flex pt-16'>
        <ClientSidebar />
        <div className='flex-1'>
          {/* Header section with white background */}
          <div className='bg-white px-6 py-2'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 text-center'>
                <h1 className='text-base font-bold text-gray-900'>Talents</h1>
              </div>
              <Button className='bg-teal-600 hover:bg-teal-700 text-white rounded-full'>
                <Heart className="w-4 h-4 mr-2" />
                Favourite
              </Button>
            </div>
          </div>

          {/* Main content area with grey background */}
          <div className=' px-6 py-6'>
            {/* White container for all content */}
            <div className='bg-white rounded-lg p-8 max-w-4xl mx-auto'>
              {/* Filter and Search section */}
              <div className='flex gap-4 mb-8'>
                <Button className='bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 px-4'>
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <div className='flex-1 relative'>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Talent Cards */}
              <div className='space-y-6'>
                {talents.map((talent) => (
                  <div key={talent.id} className='bg-gray-50 rounded-lg p-6'>
                    {/* Avatar and Header info in same row */}
                    <div className='flex items-start gap-4 mb-4'>
                      {/* Avatar */}
                      <Image
                        src={talent.avatar}
                        alt={talent.name}
                        width={60}
                        height={60}
                        className='rounded-full object-cover flex-shrink-0'
                      />
                      
                      {/* Header info */}
                      <div className='flex-1'>
                        <h3 className='text-gray-400 text-sm font-normal mb-1'>{talent.name}</h3>
                        <h2 className='text-lg font-semibold text-gray-900 leading-tight mb-1'>{talent.title}</h2>
                        <p className='text-teal-600 text-sm'>{talent.location}</p>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {talent.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium text-white ${skill.color}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                    
                    {/* Description */}
                    <p className='text-gray-600 text-sm mb-6 leading-relaxed'>
                      {talent.description}
                    </p>
                    
                    {/* Action Buttons Row */}
                    <div className='flex items-center gap-4'>
                      <Button variant="ghost" size="sm" className='text-gray-400 hover:text-gray-600 p-2'>
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button className='bg-slate-800 hover:bg-slate-700 text-white rounded-full flex-1 py-3 font-medium'>
                        {talent.actionText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalentPage