# RMMC — Rancho Maria Men's Club Website

## Overview
Member-facing website for the Rancho Maria Men's Club (RMMC), a men's golf club in Santa Maria, CA. Displays board announcements, tournament schedule, and season standings. Includes a password-protected admin panel for board members to manage content.

**Deployed:** Netlify — `https://ranchomaria.netlify.app/`

## Stack
- **React 19** + **Vite 8** — frontend framework and build tool
- **Tailwind CSS v4** — styling via `@tailwindcss/vite` plugin; no `tailwind.config.js` — design tokens live in `src/index.css` inside the `@theme` block
- **React Router v7** — client-side routing
- **Supabase** — Postgres database + email/password auth

## Environment Variables
Required in `.env` (not committed):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
The Supabase client is initialized once in `src/lib/supabase.js` and imported wherever DB or auth access is needed.

## Supabase Schema

### `announcements`
Board announcements shown on the Home page, ordered by `display_order`.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| body | text | Plain text; double newlines render as paragraph breaks |
| display_order | int | Admin-controlled sort order |

### `schedule`
Tournament schedule shown on the Schedule page, ordered by `display_order`.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| event_date | text | Free-form string (e.g. "Jan 10") |
| event_name | text | Tournament/event name |
| display_order | int | Admin-controlled sort order |
| completed | bool | If true, row renders dimmed with strikethrough on public view |

### `links`
External links shown as buttons on the Standings page (typically Google Sheets).
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| label | text | Button label shown to members |
| url | text | Google Sheets or other external URL |
| display_order | int | Admin-controlled sort order |

### `settings`
Key-value store for configurable site copy. Currently two rows:
| key | value |
|---|---|
| `announcements_title` | Heading shown on the Home/Announcements page |
| `schedule_title` | Heading shown on the Schedule page |

`AdminAnnouncements` uses `upsert` for the title; `AdminSchedule` uses `update`.

## Auth
Supabase email/password auth. No sign-up flow — admin accounts are created directly in the Supabase dashboard. `AdminGuard` (`src/components/AdminGuard.jsx`) wraps all `/admin/*` routes and redirects unauthenticated visitors to `/admin/login`. It subscribes to `onAuthStateChange` so sessions stay in sync if a tab is left open.

## Public Routes

| Route | Component | Data |
|---|---|---|
| `/` | `Home` | `settings[announcements_title]`, `announcements` |
| `/schedule` | `Schedule` | `settings[schedule_title]`, `schedule` |
| `/standings` | `Standings` | `links` |

All public routes render inside `PublicLayout` in `App.jsx`, which wraps children with `<SiteNav />`.

## Admin Routes

All under `/admin/*`, protected by `AdminGuard`. The admin panel uses its own `AdminLayout` — a dark `gray-900` nav separate from the public `SiteNav`.

| Route | Component | What it does |
|---|---|---|
| `/admin/login` | `Login` | Email/password sign-in |
| `/admin/announcements` | `AdminAnnouncements` | CRUD announcements; page title edit (auto-saves, 800 ms debounce) |
| `/admin/schedule` | `AdminSchedule` | Add/edit/delete rows; inline auto-save (800 ms debounce per field); reorder; mark completed |
| `/admin/standings` | `AdminStandings` | Add/edit/delete standings links; explicit Save button per link |

### Shared Admin Patterns
- **Reorder:** ▲/▼ buttons swap `display_order` between adjacent rows with two sequential Supabase updates.
- **Flash messages:** `StatusMsg` component shows success/error for 5 s, managed by a `useRef`-based debounce timer.
- **Refresh trigger:** A `tick` state integer increments to re-run the `useEffect` data fetch — no mutation-based optimistic updates.

## Project Structure
```
src/
  lib/
    supabase.js              # Supabase client
  assets/
    rm_logo.png              # Club logo (used in SiteNav)
  components/
    SiteNav.jsx              # Public responsive nav (hamburger on mobile)
    AdminGuard.jsx           # Auth-gated wrapper
    AnnouncementCard.jsx     # Single announcement (paragraph-aware renderer)
    ScheduleTable.jsx        # Schedule — table on desktop, cards on mobile
    StatusMsg.jsx            # Admin flash message (success / error)
  pages/
    Home.jsx                 # Announcements page
    Schedule.jsx             # Schedule page
    Standings.jsx            # Standings links page
    admin/
      Login.jsx
      AdminLayout.jsx        # Admin shell (dark nav + <Outlet />)
      AdminAnnouncements.jsx
      AdminSchedule.jsx
      AdminStandings.jsx
  App.jsx                    # Route tree + PublicLayout
  index.css                  # Tailwind @import + @theme tokens + base styles
  main.jsx                   # React root
```

## Design Tokens
Defined in `src/index.css` `@theme` and used as Tailwind utility classes throughout:

| Token | Value | Usage |
|---|---|---|
| `green` | `#1a5c38` | Primary brand — nav, headings, buttons |
| `green-light` | `#2d7a50` | Button/link hover state |
| `gold` | `#c9a84c` | Accent — decorative lines, borders, logo text |
| `cream` | `#f8f6f1` | Page background |
| `card` | `#ffffff` | Card/surface background |
| `muted` | `#6b7280` | Secondary/helper text |
| `danger` | `#c0392b` | Delete buttons |
| `danger-dark` | `#a93226` | Delete button hover |

## Deployment
- **Platform:** Netlify
- **Build:** `npm run build` → publishes `dist/`
- `netlify.toml` has a catch-all SPA redirect (`/* → /index.html`, status 200)
- Env vars must be set in Netlify dashboard: **Site settings → Environment variables**

## Tickets

Linear project **rmmc** (team Toop, issue IDs `ENG-N`): https://linear.app/tooper/project/rmmc-97877a7662a0
File, update and close this repo's tickets there.
