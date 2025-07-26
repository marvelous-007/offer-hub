import { format, subHours } from "date-fns";

import { DisputeRow } from "@/types";
import { faker } from '@faker-js/faker';
import { useState } from 'react'

export const mockMessages = [
  {
    id: 1,
    content: "Hey there!",
    timestamp: "10:30 AM",
    isOutgoing: false,
    type: "text",
  },
  {
    id: 2,
    content: "Hello! How are you?",
    timestamp: "10:31 AM",
    isOutgoing: true,
    type: "text",
  },
  {
    id: 3,
    content: "Document file",
    timestamp: "10:32 AM",
    isOutgoing: false,
    type: "file",
    fileData: {
      name: "ProjectBrief.pdf",
      size: "1.2MB",
      uploadDate: "2024-06-01",
      status: "Uploaded",
    },
  },
]

export const mockConversation = {
  id: 1,
  name: "Alice Johnson",
  avatar: "/placeholder.svg",
  lastMessage: "Let's catch up",
  timestamp: "10:32 AM",
  isOnline: true,
  unreadCount: 2,
}

export const mockDisputes = (length = 12, status?: DisputeRow['status']): DisputeRow[] =>
  Array.from({ length }).map((_, i) => ({
    date: format(subHours(new Date(), (length - i) * 12), 'd MMMM yyyy : HH:mm:ss'),
    name: faker.person.fullName(),
    ticket: (faker.string.alpha(4) + faker.string.numeric(4) + faker.string.alpha(1)).toLowerCase(),
    userId: (faker.string.alpha(4) + faker.string.numeric(4) + faker.string.alpha(1)).toLowerCase(),
    email: faker.internet.email(),
    amount: faker.commerce.price({ min: 700, max: 900, dec: 0 }),
    status: status ?? ['active', 'unassigned', 'resolved'][faker.number.int({ min: 0, max: 2 })] as DisputeRow['status'],
  }));

export const useMockDisputes = (length = 12, status?: DisputeRow['status']) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [originalDisputes] = useState(() => mockDisputes(length, status))
  const [filteredDisputes, setFilteredDisputes] = useState(originalDisputes)

  const search = (str: string, key?: 'name' | 'date') => {
    if (key === 'date') {
      setSelectedDate(str)

      setFilteredDisputes(
        originalDisputes.filter(
          e => (!str || format(e.date, 'd MMMM yyyy') === format(str, 'd MMMM yyyy')) &&
            (!searchTerm || e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.ticket.includes(searchTerm))
        )
      )
    } else {
      setSearchTerm(str)

      setFilteredDisputes(
        originalDisputes.filter(
          e => (e.name.toLowerCase().includes(str.toLowerCase()) || e.ticket.includes(str)) &&
            (!selectedDate || format(e.date, 'd MMMM yyyy') === format(selectedDate, 'd MMMM yyyy'))
        )
      )
    }
  }

  const filter = (status: DisputeRow['status']) => {
    setFilteredDisputes(
      originalDisputes.filter(e => e.status === status)
    )
  }

  return {
    disputes: filteredDisputes,
    selectedDate,
    searchTerm,
    search,
    filter,
  }
}
