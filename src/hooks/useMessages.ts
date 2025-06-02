import { useState } from "react"

export interface Message {
  id: number
  content: string
  timestamp: string
  isOutgoing: boolean
  type: "text" | "file"
  fileData?: {
    name: string
    size: string
    uploadDate: string
    status: string
  }
}

export interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  unreadCount?: number
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Looking forward to the proposal.",
    timestamp: "2 min ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Olivia Rhye",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Looking forward to the proposal.",
    timestamp: "5 min ago",
    isOnline: true,
  },
  {
    id: 3,
    name: "Olivia Rhye",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Looking forward to the proposal.",
    timestamp: "1 hour ago",
    isOnline: true,
  },
]

export function useMessages() {
  const [activeConversationId, setActiveConversationId] = useState(1)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "The main text of the message sent out",
      timestamp: "09:21 am",
      isOutgoing: true,
      type: "text",
    },
    {
      id: 2,
      content: "The main text of the message sent out",
      timestamp: "09:21 am",
      isOutgoing: true,
      type: "text",
    },
    {
      id: 3,
      content: "User Layout. PDF",
      timestamp: "09:21 am",
      isOutgoing: true,
      type: "file",
      fileData: {
        name: "PDF_2022-04-20-20 19.30...",
        size: "2.3mb",
        uploadDate: "uploaded Mar 22",
        status: "Under review (5 days) • 2 days remaining",
      },
    },
    {
      id: 4,
      content: "The main text of the message sent out",
      timestamp: "09:23 am",
      isOutgoing: false,
      type: "text",
    },
  ])

  const handleSendMessage = (content: string, file?: File) => {
    const newMessage: Message = file
      ? {
          id: messages.length + 1,
          content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isOutgoing: true,
          type: "file",
          fileData: {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)}mb`,
            uploadDate: `uploaded ${new Date().toLocaleDateString()}`,
            status: "Uploaded successfully",
          },
        }
      : {
          id: messages.length + 1,
          content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isOutgoing: true,
          type: "text",
        }

    setMessages((prev) => [...prev, newMessage])
  }

  const activeConversation = initialConversations.find(
    (conv) => conv.id === activeConversationId
  )

  return {
    conversations: initialConversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    handleSendMessage,
  }
}
