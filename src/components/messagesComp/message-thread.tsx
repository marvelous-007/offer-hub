"use client";

import { type Message } from "../../types/messages-types";
import { DateDivider } from "./date-divider";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { cn } from "@/lib/utils";
import { formatDayLabel, startOfDay } from "@/lib/date";
import { useEffect, useMemo, useRef } from "react";

// Thread that groups by day, auto-scrolls, and supports "jump to replied message"
export function MessageThread({
  messages = [],
  typing,
  typingName,
  onReply,
  className,
}: {
  messages?: Message[];
  typing?: boolean;
  typingName?: string;
  onReply?: (messageId: string) => void;
  className?: string;
}) {
  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  const groups = useMemo(() => {
    const map: Record<string, Message[]> = {};
    for (const m of sorted) {
      const key = startOfDay(new Date(m.createdAt)).toISOString();
      if (!map[key]) map[key] = [];
      map[key].push(m);
    }
    return map;
  }, [sorted]);

  const dayKeys = useMemo(
    () =>
      Object.keys(groups).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [groups]
  );

  // Keep refs for each message so we can scroll to it when clicking a quoted preview
  const refMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const jumpToMessage = (id: string) => {
    const el = refMap.current.get(id);
    if (!el) return;
    // Smoothly scroll the original message into view and highlight briefly
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-sky-400/60", "rounded-xl");
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-sky-400/60", "rounded-xl");
    }, 1500);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages?.length, typing]);

  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-hidden rounded-xl bg-white",
        className
      )}
      aria-label="Message thread"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col gap-3 p-2 sm:gap-4 sm:p-2">
        {dayKeys.map((dayKey) => {
          const items = groups[dayKey];
          const label = formatDayLabel(new Date(dayKey));
          return (
            <div key={dayKey}>
              <DateDivider label={label} />
              <div className="flex flex-col gap-3 sm:gap-4">
                {items.map((m) => (
                  <div
                    key={m.id}
                    ref={(el) => {
                      if (el) refMap.current.set(m.id, el);
                      else refMap.current.delete(m.id);
                    }}
                    className="transition-shadow"
                    data-message-id={m.id}
                  >
                    <MessageBubble
                      id={m.id}
                      text={m.text}
                      time={m.time}
                      direction={m.direction}
                      attachments={m.attachments}
                      status={m.status}
                      replyTo={m.replyTo}
                      onReply={onReply}
                      onJumpTo={jumpToMessage}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {typing && <TypingIndicator name={typingName} align="left" />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
