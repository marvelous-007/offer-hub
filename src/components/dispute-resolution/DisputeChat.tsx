import React from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";

const mockMessages = [
  {
    id: 1,
    content: "Hello, I have an issue with the payment.",
    timestamp: "10:00 AM",
    isOutgoing: false,
    avatar: "/avatar_olivia.jpg",
  },
  {
    id: 2,
    content: "Can you provide more details?",
    timestamp: "10:01 AM",
    isOutgoing: true,
  },
];

export default function DisputeChat({ onCloseConflict }: { onCloseConflict: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-auto p-4 bg-gray-50 rounded-t-lg">
        {mockMessages.map((msg) => (
          <MessageBubble key={msg.id} {...msg} />
        ))}
      </div>
      <div className="p-4 border-t bg-white flex justify-end">
        <Button variant="destructive" onClick={onCloseConflict}>
          Close conflict & release payment
        </Button>
      </div>
    </div>
  );
} 