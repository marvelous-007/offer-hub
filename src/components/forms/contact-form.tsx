"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ValidationMessage } from './validation-messages'
import { SubmitButton } from './submit-button'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void> | void
  disabled?: boolean
  className?: string
  backendError?: string | null
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  disabled = false,
  className = "",
  backendError = null,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const handleFormSubmit = async (data: ContactFormData) => {
    if (isLoading) return // Prevent double submission
    
    setIsLoading(true)
    try {
      await onSubmit(data)
      // Optionally reset form on success
      // form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {backendError && (
        <ValidationMessage message={backendError} type="error" />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Name
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                    placeholder="Your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Email
                </FormLabel>
                <FormControl>
                  <input
                    type="email"
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                    placeholder="your@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Subject
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                    placeholder="What is this regarding?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Message
                </FormLabel>
                <FormControl>
                  <textarea
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085] min-h-[120px] resize-vertical"
                    placeholder="Your message..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            isLoading={isLoading}
            disabled={disabled || !form.formState.isValid}
            className="w-full"
          >
            Send Message
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm