"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ParticleBackground from '../login/ParticleBackground'
import Image from "next/image"

export default function ForgotPassword() {
  const router = useRouter()
  const [, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Add your forgot password logic here
    setTimeout(() => {
      setIsLoading(false)
      // Redirect or handle successful email submission
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center overflow-hidden">
      <ParticleBackground />
      
      {/* Logo Section - Left Side */}
      <div className="fixed left-8 top-8 z-10 flex items-center space-x-40">
        <Image
          src="/logo.svg"
          alt="Offer Hub Logo"
          width={80}
          height={80}
          priority
          className="dark:invert"
        />
        {/* Enlace "Back to log in" */}
        <div className="text-sm">
          <Link href="/login" className="hover:underline text-gray-500">
            Back to log in
          </Link>
        </div>
      </div>

      {/* Forgot Password Form - Center */}
      <div className="relative z-10 mx-auto w-full max-w-[400px] space-y-8 px-4">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Forgot password?</h1>
            <p className="text-sm text-gray-500">
              You will receive an email to change your password.
            </p>
          </div>

          <div className="space-y-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="your_email@example.com"
              className="h-11 bg-[#E8F0E9] placeholder:text-gray-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#159A9C] text-white hover:bg-[#002333] rounded-md"
          >
            Send password
          </Button>
        </form>
      </div>
    </div>
  )
}