# xRentz Development TODO

## Phase 1: Project Scaffolding & Design
- [ ] Create package.json with Next.js, TypeScript, Tailwind, Lucide React
- [ ] Configure tailwind.config.js with Discord-inspired color palette
- [ ] Set up tsconfig.json for strict TypeScript
- [ ] Build Button component
- [ ] Build Input component
- [ ] Build Select component
- [ ] Build Card component
- [ ] Build Modal component

## Phase 2: Database & Backend
- [ ] Create Supabase SQL schema (users, properties, messages, conversations)
- [ ] Implement RLS policies for tenant/owner access control
- [ ] Create supabase.ts client configuration
- [ ] Build useAuth.ts hook for authentication
- [ ] Implement email/password signup flow
- [ ] Implement Google OAuth flow
- [ ] Handle session state management

## Phase 3: Authentication UI
- [ ] Build Login page layout
- [ ] Build Signup page layout with Tenant/Owner toggle
- [ ] Wire form validation
- [ ] Handle error states display
- [ ] Implement role-based routing after login

## Phase 4: Core Application
- [ ] Build AppShell layout with Discord-style sidebar
- [ ] Create owner dashboard property list view
- [ ] Build Add/Edit Property form
- [ ] Implement image upload to Supabase Storage
- [ ] Create tenant dashboard property feed
- [ ] Build property card components
- [ ] Implement search and filter logic
- [ ] Add pagination for property listings

## Phase 5: Real-Time Chat
- [ ] Build ChatWindow component
- [ ] Build MessageList component
- [ ] Build MessageInput component
- [ ] Build ConversationList sidebar
- [ ] Integrate Supabase Realtime subscriptions
- [ ] Implement optimistic UI updates for messages
- [ ] Add typing indicators
- [ ] Handle unread message counts

## Phase 6: Polish & Testing
- [ ] Add loading states throughout app
- [ ] Test responsive design on mobile
- [ ] Verify RLS policies work correctly
- [ ] Test real-time chat functionality
- [ ] Error boundary implementation
- [ ] Final accessibility audit