# xRentz

A Discord-inspired room rental platform connecting tenants and property owners.

## Tech Stack Priority

| Priority | Technology | Purpose |
|----------|------------|---------|
| 1 | **Next.js** | React framework with App Router, SSR, API routes |
| 2 | **TypeScript** | Type safety across the entire codebase |
| 3 | **Tailwind CSS** | Discord-inspired styling (slate grays, whites, accent) |
| 4 | **Lucide React** | Minimalist icon library |
| 5 | **Supabase** | PostgreSQL database, Auth, Realtime, Storage |
| 6 | **React Query** | Server state management and caching |

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │
│  │  Auth   │  │ Tenant  │  │       Owner         │  │
│  │  Pages  │  │Dashboard│  │     Dashboard       │  │
│  └────┬────┘  └────┬────┘  └──────────┬──────────┘  │
│       │            │                  │              │
│       └────────────┴──────────────────┘              │
│                         │                             │
│              ┌──────────▼──────────┐                 │
│              │   Supabase Client    │                 │
│              └──────────┬──────────┘                 │
└─────────────────────────┼─────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
   │  Auth   │      │ PostgreSQL│     │  Realtime │
   │ (OAuth)  │      │ Database  │     │  Chat     │
   └─────────┘      └───────────┘     └───────────┘
```

## Key Features

- **Authentication**: Email/password + Google OAuth with role-based routing
- **Property Management**: CRUD operations for owners with image uploads
- **Discovery Feed**: Filterable listings for tenants
- **Real-time Chat**: Discord-style messaging between tenants and owners
- **Row Level Security**: Data isolation per user role

## Database Schema

```sql
users        → id, role (tenant/owner), sub_role (student/family)
properties   → id, owner_id, details, pricing, images
messages     → id, sender_id, receiver_id, content
conversations → id, tenant_id, owner_id, property_id
```

## Project Structure

```
xRentz/
├── app/                 # Next.js App Router pages
│   ├── auth/            # Login & Signup
│   ├── (tenant)/        # Tenant dashboard
│   └── (owner)/        # Owner dashboard
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # App shell & navigation
│   └── chat/            # Real-time chat components
├── hooks/               # Custom React hooks
├── lib/                 # Supabase client config
└── types/               # TypeScript definitions
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Development Phases

1. **Scaffolding** - Project setup, Tailwind config, UI components
2. **Backend** - Supabase schema, RLS policies, auth hooks
3. **Auth UI** - Login/Signup screens with role selection
4. **Core App** - Dashboard layouts, property management
5. **Real-time** - Chat functionality with live updates

---

See [prompt.md](./prompt.md) for detailed task breakdown.