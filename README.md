# RMMC — Rancho Maria Men's Club

Club website for Rancho Maria Men's Club. Public-facing pages for announcements, schedule, and standings links, plus a password-protected admin panel for managing content.

## Stack

- **React 19** + **Vite** — SPA, builds to `dist/`
- **Tailwind CSS v4**
- **Supabase** — Postgres database + email/password auth
- **Netlify** — hosting, auto-deploys on push to `main`

## Routes

| Route | Description |
|---|---|
| `/` | Announcements |
| `/schedule` | Tournament schedule |
| `/standings` | Google Sheets standings links |
| `/admin/login` | Admin login |
| `/admin/announcements` | Manage announcements |
| `/admin/schedule` | Manage schedule |
| `/admin/standings` | Manage standings links |

All unknown routes redirect to `/`.

## Database

Four tables in Supabase Postgres.

**`announcements`**
| column | type | notes |
|---|---|---|
| `id` | uuid | primary key |
| `body` | text | announcement text, supports newlines |
| `display_order` | integer | controls sort order on public page |

**`schedule`**
| column | type | notes |
|---|---|---|
| `id` | uuid | primary key |
| `event_date` | text | free-text date string (e.g. "Jan 10") |
| `event_name` | text | |
| `display_order` | integer | controls sort order |

**`links`** (standings page)
| column | type | notes |
|---|---|---|
| `id` | uuid | primary key |
| `label` | text | button label shown on public page |
| `url` | text | Google Sheets URL |
| `display_order` | integer | controls sort order |

**`settings`**
| column | type | notes |
|---|---|---|
| `key` | text | primary key |
| `value` | text | |

Currently used keys: `announcements_title` (the heading shown on the public announcements page).

## Auth

Supabase email/password auth. Login at `/admin/login` calls `supabase.auth.signInWithPassword`. The session is managed by the Supabase client and persisted in `localStorage`.

`AdminGuard` wraps all `/admin/*` routes. On mount it calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange`. Unauthenticated requests redirect to `/admin/login`; authenticated ones pass through to the admin layout.

There is no self-serve signup. Admin accounts are created directly in the Supabase dashboard under Authentication → Users.

## Environment variables

| variable | value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL from Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key from Supabase dashboard |

Set in `.env` locally and in Netlify under Site settings → Environment variables.
