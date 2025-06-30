import { ReactNode } from "react"

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

export interface MessagesMainProps {
  activeConversation?: Conversation
  messages: Message[]
  onSendMessage: (content: string, file?: File) => void
}


export interface DisputeRow {
  date: string;
  name: string;
  ticket: string;
  email: string;
}


export interface TabItem {
  label: string;
  value: string;
  component: ReactNode; 
}

export interface PillTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}