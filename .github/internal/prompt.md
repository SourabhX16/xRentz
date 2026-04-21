# xRentz - Room Rental Platform (Discord-Inspired UI)

## Project Overview

Build a Discord-inspired room rental platform called **xRentz** using:
- **Frontend**: Next.js (or React/Vite) with TypeScript
- **Styling**: Tailwind CSS (Discord-inspired palette: slate grays, crisp whites, primary accent)
- **Icons**: Lucide React (minimalist)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Design**: Minimalist, flat-design aesthetic

---

## Phase 1: Project Scaffolding & Design

### Task 1.1: Project Initialization

Generate the project foundation files:
- `package.json` - Next.js/React with TypeScript dependencies
- `tailwind.config.js` - Discord-inspired color palette (slate grays, whites, primary accent)
- `tsconfig.json` - TypeScript configuration

### Task 1.2: Component Library

Create isolated, reusable Tailwind components in `/components/ui/`:
- `Button.tsx` - Primary, secondary, ghost variants
- `Input.tsx` - Text input with label and error states
- `Select.tsx` - Dropdown select
- `Card.tsx` - Container card
- `Modal.tsx` - Overlay modal dialog

All components should follow a minimalist, flat-design aesthetic.

---

## Phase 2: Database & Backend (Supabase)

### Task 2.1: Database Schema

Design the PostgreSQL schema for Supabase:

```sql
-- Required Tables:
-- users: id, role (tenant/owner), sub_role (student/family), full_name, email, phone, created_at
-- properties: id, owner_id, title, description, price, location, amenities[], images[], status, created_at
-- messages: id, sender_id, receiver_id, property_id (nullable), content, created_at
-- conversations: id, tenant_id, owner_id, property_id, created_at, updated_at
```

Implement **Row Level Security (RLS)** policies:
- Tenants can only view active listings and their own chats
- Owners can only edit their own properties
- Messages are only visible to conversation participants

### Task 2.2: Supabase Client & Auth Hook

Create `/lib/supabase.ts` - client configuration with environment variables.

Create `/hooks/useAuth.ts` - custom React hook handling:
- Email/password signup (fields: Full Name, Role, Email, Phone)
- Google OAuth integration
- Session state management
- Role-based user type (Tenant/Owner, Student/Family sub-role)

---

## Phase 3: Authentication UI

### Task 3.1: Auth Layout & Visual UI

Build `/app/auth/` routes with responsive layouts:
- `login/page.tsx` - Clean login form
- `signup/page.tsx` - Signup form with Tenant/Owner toggle cards
- Visual-only (no logic yet) using the component library
- Responsive design (mobile-first)

### Task 3.2: Auth State Integration

Connect the Auth UI to Supabase:
- Form validation (email format, password matching, required fields)
- Error state handling (display user-friendly messages)
- Success routing based on user role:
  - Tenant → `/tenant/dashboard`
  - Owner → `/owner/dashboard`
- Loading states during authentication

---

## Phase 4: Core Application Shell

### Task 4.1: Discord-Inspired Shell Layout

Create `/components/layout/AppShell.tsx`:
- Left-side vertical navigation bar (Discord servers/channels style)
- Top header with breadcrumbs and search
- Main content area
- Responsive: collapsible sidebar on mobile
- Navigation items: Dashboard, Properties, Messages, Settings

### Task 4.2: Owner Dashboard - Property Management

Build `/app/(owner)/dashboard/` routes:
- Property list view (owner's properties)
- Add/Edit Property form:
  - Image upload (to Supabase Storage)
  - Rent pricing input
  - Amenities checkboxes
  - Location details
  - Status toggle (active/inactive)
- Delete confirmation modal
- Form state management with optimistic updates

### Task 4.3: Tenant Dashboard - Property Discovery

Build `/app/(tenant)/dashboard/` routes:
- Property feed grid/list toggle view
- Property cards showing:
  - Thumbnail image
  - Price
  - Title
  - Location
  - "Contact Owner" button
- Favorite/save functionality

### Task 4.4: Search & Filter Logic

Implement property feed functionality:
- Supabase query for active listings
- Filters:
  - Price range (min/max)
  - Location/area
  - Student vs Family friendly
  - Amenities filter
- Pagination (infinite scroll or page-based)
- Sorting options (price, date, distance)

---

## Phase 5: Real-Time Chat (Discord Element)

### Task 5.1: Chat UI Components

Create `/components/chat/`:
- `ChatWindow.tsx` - Main chat container
- `MessageList.tsx` - Message history pane
- `MessageInput.tsx` - Input bar at bottom
- `ConversationList.tsx` - Sidebar of conversations
- Discord DM-style aesthetic

### Task 5.2: Real-time Supabase Subscriptions

Integrate Supabase Realtime:
- Subscribe to messages table changes
- Instant message updates
- Optimistic UI updates (show message before server confirm)
- Typing indicators (optional)
- Unread message counts
- Connection status handling

---

## File Structure

```
xRentz/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (tenant)/
│   │   └── dashboard/page.tsx
│   ├── (owner)/
│   │   └── dashboard/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   └── AppShell.tsx
│   └── chat/
│       ├── ChatWindow.tsx
│       ├── MessageList.tsx
│       ├── MessageInput.tsx
│       └── ConversationList.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── supabase.ts
├── types/
│   └── index.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.local
```

---

## Technical Requirements

1. **TypeScript**: Strict mode enabled, proper typing for all components
2. **Tailwind**: Use custom color palette from config
3. **Supabase**: Environment variables for connection
4. **Accessibility**: ARIA labels, keyboard navigation
5. **Responsive**: Mobile-first approach
6. **Performance**: Lazy loading, image optimization

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```