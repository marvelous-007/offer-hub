"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ParticleBackground from './particle-background'

export default function Login() {
  const router = useRouter()
  const [, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Add your login logic here
    setTimeout(() => {
      setIsLoading(false)
      // Redirect or handle successful login
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center overflow-hidden">
      <ParticleBackground />
      {/* Logo Section - Left Side */}
      <div className="fixed left-8 top-8 z-10">
        <Image
          src="/logo.svg"
          alt="Offer Hub Logo"
          width={80}
          height={80}
          priority
          className="dark:invert"
        />
      </div>

      {/* Login Form - Center */}
      <div className="relative z-10 mx-auto w-full max-w-[400px] space-y-8 px-4">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-sm font-medium">Username or Email</label>
            <Input
              type="email"
              placeholder="your_email@example.com"
              className="h-11 bg-[#E8F0E9] placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="********"
              className="h-11 bg-[#E8F0E9]"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Image
                src="/login/keep-me-signed-in.svg"
                alt="Keep me signed in"
                width={20}
                height={20}
              />
              {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-sm hover:underline">
                Keep me signed in
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm hover:underline">
            <div className="flex items-center space-x-2">
              <Image
                src="/login/forgot-password.svg"
                alt="Forgot Password"
                width={20}
                height={20}
              />
              {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-sm hover:underline">Forgot Password</label>
            </div>
            </Link>
          </div>

          <br />
          <br />

          {/* Social Login */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border border-gray-300"
              onClick={() => {/* Add Google sign in logic */}}
            >
              <Image
                src="/login/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
                className="mr-2"
              />
              Sign in with google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border border-gray-300"
              onClick={() => router.push('/signup')}
            >
              <Image
                src="/login/create-new-account.svg"
                alt="Create Account"
                width={20}
                height={20}
                className="mr-2"
              />
              Create New Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
