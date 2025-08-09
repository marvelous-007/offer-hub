// Mock conversations. Purely static data for the visual implementation.

import { type Conversation } from "@/types/messages-types";

const today = new Date();
const today_0921 = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  9,
  21
);
const today_0923 = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  9,
  23
);

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const yesterday_1810 = new Date(
  yesterday.getFullYear(),
  yesterday.getMonth(),
  yesterday.getDate(),
  18,
  10
);

export const mockConversations: Conversation[] = [
  {
    id: "conv_john",
    participant: {
      id: "user_john",
      name: "John Doe",
      avatarUrl: "/placeholder.svg?height=64&width=64",
    },
    unread: 1,
    messages: [
      {
        id: "m1",
        direction: "sent",
        text: "The main text of the message sent out",
        time: "09:21 am",
        createdAt: today_0921.toISOString(),
      },
      {
        id: "m2",
        direction: "received",
        text: "The main text of the message sent out",
        time: "09:23 am",
        createdAt: today_0923.toISOString(),
      },
    ],
  },
  {
    id: "conv_amy",
    participant: {
      id: "user_amy",
      name: "Amy Lee",
      avatarUrl: "/placeholder.svg?height=64&width=64",
    },
    unread: 0,
    messages: [
      {
        id: "a1",
        direction: "received",
        text: "Hi there! Can you review the document I sent?",
        createdAt: yesterday_1810.toISOString(),
        time: "06:10 pm",
      },
    ],
  },
];
