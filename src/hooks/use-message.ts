"use client"
import { useState, useRef } from "react"
import type React from "react"

interface UseMessageComposerReturn {
  newMessage: string;
  setNewMessage: (message: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSendMessage: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export function useMessageComposer(onSendMessage: (content: string, file?: File) => void): UseMessageComposerReturn {
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onSendMessage(file.name, file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    newMessage,
    setNewMessage,
    fileInputRef,
    handleSendMessage,
    handleFileUpload,
    handleKeyPress,
  }
}
