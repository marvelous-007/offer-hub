"use client"

import { useCallback, useEffect, useRef } from "react"

interface UseAutoSaveOptions {
  delay?: number
  onSave?: (data: any) => void | Promise<void>
}

interface UseAutoSaveReturn {
  saveData: (data: any) => void
  isSaving: boolean
  lastSaved: Date | null
}

export function useAutoSave({
  delay = 2000,
  onSave
}: UseAutoSaveOptions = {}): UseAutoSaveReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<Date | null>(null)
  const isSavingRef = useRef(false)

  const saveData = useCallback((data: any) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (onSave && !isSavingRef.current) {
        isSavingRef.current = true
        try {
          await onSave(data)
          lastSavedRef.current = new Date()
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          isSavingRef.current = false
        }
      }
    }, delay)
  }, [delay, onSave])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    saveData,
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current
  }
}
