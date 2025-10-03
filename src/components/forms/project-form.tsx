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

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  budget: z.string().min(1, 'Budget is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  category: z.string().min(1, 'Category is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void> | void
  disabled?: boolean
  className?: string
  backendError?: string | null
  initialData?: Partial<ProjectFormData>
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  disabled = false,
  className = "",
  backendError = null,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      deadline: '',
      category: '',
      skills: [],
      ...initialData,
    },
  })

  const handleFormSubmit = async (data: ProjectFormData) => {
    if (isLoading) return // Prevent double submission
    
    setIsLoading(true)
    try {
      await onSubmit(data)
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Project Title
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                    placeholder="Enter project title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Description
                </FormLabel>
                <FormControl>
                  <textarea
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085] min-h-[120px] resize-vertical"
                    placeholder="Describe your project in detail..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                    Budget
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      disabled={disabled || isLoading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                      placeholder="Enter budget"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                    Deadline
                  </FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      disabled={disabled || isLoading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-[#344054] mb-2">
                  Category
                </FormLabel>
                <FormControl>
                  <select
                    disabled={disabled || isLoading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#19213D] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[#667085]"
                    {...field}
                  >
                    <option value="">Select a category</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="writing">Writing</option>
                  </select>
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
            {initialData ? 'Update Project' : 'Create Project'}
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export default ProjectForm