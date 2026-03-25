# Blessedly Frontend

Blessedly is a modern mental health companion web app built with Next.js App Router.
It provides mood tracking, AI chat support, analytics, reports, notes, and admin content/log management.

## Overview

This frontend integrates with the Blessedly backend API and includes:

- Google OAuth login
- Email verification flow
- Onboarding baseline assessment
- Daily mood logging and history
- AI companion chat sessions
- Notes and coping toolkit management
- Analytics generation and trend viewing
- Mental health report generation and detail pages
- Admin article/content management
- Admin audit log monitoring

## Tech Stack

- Next.js 16.1.6 (App Router)
- React 19.2.3
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
- Biome (linting and formatting)

## Prerequisites

- Node.js 20+ recommended
- npm
- Blessedly backend API running locally (default: http://localhost:8000)

## Environment Variables

Create a .env file in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/
```

Important:
- Keep the trailing slash in NEXT_PUBLIC_BACKEND_URL.
- Frontend API utilities and upload rewrites depend on this value.

## Installation

```bash
git clone https://github.com/AkuSeorangManusia/bsdy_fe.git
cd bsdy_fe
npm install
```

## Run Locally

1. Start the backend API first (bsdy_api).
2. Start the frontend:

```bash
npm run dev
```

3. Open:

http://localhost:3000

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Biome check
npm run format   # Biome format --write
```

## App Routes

### Public Routes

- / : Landing page
- /auth/callback : Google OAuth callback handler
- /auth/verify-email : Email verification and resend flow
- /blog/[slug] : Public article page

### Authenticated User Routes

All routes below are protected by AuthContext + ProtectedRoute.

- /dashboard : Main user overview and quick actions
- /mood : Mood tracker form and history
- /chat : Chat thread list and session creation
- /chat/[id] : Chat conversation view
- /notes : Coping toolkit notes CRUD
- /analytics : Analytics generation and history
- /reports : Report generation and list
- /reports/[id] : Report detail page
- /profile : Profile and baseline data overview
- /onboarding : Baseline assessment flow (for users who have not completed onboarding)

### Admin Routes

Admin pages require authenticated user with role=admin.

- /admin/content : Content management list
- /admin/content/[id] : Content editor (title, excerpt, markdown body, status, cover upload)
- /admin/logs : Auth/activity/admin logs with pagination

## Authentication and Access Rules

The app uses token-based auth in localStorage and route-level guard checks.

Route protection behavior:
- Unauthenticated users are redirected to /
- Unverified users are redirected to /auth/verify-email
- Users without onboarding completion are redirected to /onboarding
- Non-admin users attempting admin routes are redirected to /dashboard

## API Integration

Frontend API helpers are centralized in src/lib/api.js.

Main API groups:
- authApi
- onboardingApi
- moodApi
- analyticsApi
- reportsApi
- notesApi
- chatsApi
- contentApi
- logsApi

Behavior notes:
- Authorization header is attached automatically when token exists.
- 401 responses clear local token and redirect user to /?sessionExpired=true.

## Project Structure

```text
.
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── content
│   │   │   └── logs
│   │   ├── analytics
│   │   ├── auth
│   │   │   ├── callback
│   │   │   └── verify-email
│   │   ├── blog
│   │   ├── chat
│   │   ├── dashboard
│   │   ├── mood
│   │   ├── notes
│   │   ├── onboarding
│   │   ├── profile
│   │   └── reports
│   ├── components
│   │   ├── Navbar.js
│   │   ├── PopupModal.js
│   │   └── ProtectedRoute.js
│   ├── context
│   │   └── AuthContext.js
│   └── lib
│       └── api.js
├── public
│   └── assets
├── biome.json
├── next.config.mjs
├── postcss.config.mjs
└── package.json
```

## License

This project is part of a competition entry for TECHSOFT 2026.