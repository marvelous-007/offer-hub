# PR: Connect frontend with messaging backend

## Summary
This PR integrates the frontend messaging UI with the real messaging API, replacing mock data and adding core messaging features:
- Fetch user conversations and messages from the backend
- Send messages with optimistic UI updates
- Mark messages as read upon viewing a conversation
- Display unread badge counts, last message preview, and timestamps
- Basic polling (20s) for updated conversations and new messages
- File message support via object URLs (placeholder until upload endpoint exists)
- Proper loading and error states across the UI

## Related Issue
- Connect frontend with messaging backend

## Changes
- types: Ensure API-aligned types
  - src/types/messages.types.ts
- API service: typed, error-aware endpoints
  - src/services/api/messages.service.ts
- Hook: state mgmt, API integration, read receipts, optimistic send, polling
  - src/hooks/useMessages.ts
- Components: real data rendering with loading/error states
  - src/components/messages/messages-sidebar.tsx
  - src/components/messages/messages-main.tsx
- Pages: wiring to hook and data flow
  - src/app/messages/page.tsx
  - src/app/user/chat/page.tsx

## How it works
- Conversations load for the current user (placeholder `currentUserId = 'user-1'`).
- Selecting a conversation loads messages and marks them as read.
- Sending a message updates the UI immediately (optimistic), then confirms with the API.
- A 20s polling interval refreshes conversations and, if open, the active conversation messages.

## Error Handling & UX
- API errors are surfaced as user-friendly messages in components.
- Non-blocking errors (e.g., mark-as-read failures) do not disrupt the thread view.
- Loading indicators are shown for conversation/message fetching and sending.

## Notes
- File uploads currently use object URLs to satisfy UI flow; can be swapped for a real upload endpoint later.
- Real-time updates can be upgraded to WebSocket/SSE in a follow-up.
- `currentUserId` is hard-coded in pages for now; integrate with auth/user context in a follow-up.

## Testing
Manual checks:
- Open Messages page and verify conversations load with proper states.
- Select a conversation: messages load, unread badge resets, and messages show read status.
- Send a text and a file message: both appear immediately; status updates after API response.
- Observe polling updates by modifying data server-side (if possible).

Future automated tests (suggested):
- Unit tests for messages.service.ts (mock axios).
- Hook tests for useMessages (mock service responses for success/error).
- Component tests to validate UI states for loading, errors, and content rendering.

## Screenshots
N/A (UI unchanged visually, now powered by live data).

## Checklist
- [x] Types align with backend
- [x] API calls typed and error-handled
- [x] Optimistic updates on send
- [x] Read receipts on view
- [x] Loading and error states
- [x] Basic polling for updates
