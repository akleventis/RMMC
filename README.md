# RMMC — Rancho Maria Men's Club

Club website for Rancho Maria Men's Club. Public-facing pages for announcements, schedule, and standings links, plus a password-protected admin panel for managing content.

[![Netlify Status](https://api.netlify.com/api/v1/badges/979b24d4-b2f4-4ad0-9a93-f2e8c0a07801/deploy-status)](https://app.netlify.com/projects/ranchomaria/deploys)

## Stack

- **React 19** + **Vite** — SPA, builds to `dist/`
- **Tailwind CSS v4**
- **Supabase** — Postgres database + email/password auth
- **Netlify** — hosting, auto-deploys on push to `main`; scheduled function keeps Supabase awake

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

Five tables in Supabase Postgres.

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
| `completed` | boolean | renders dimmed with strikethrough on public page |

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

Currently used keys: `announcements_title` (heading on the announcements page) and `schedule_title` (heading on the schedule page).

**`keep_alive`** (not used by the site — see [Supabase keep-alive](#supabase-keep-alive))
| column | type | notes |
|---|---|---|
| `id` | integer | primary key, always `1` (single row) |
| `pinged_at` | timestamptz | last keep-alive ping |

## Auth

Supabase email/password auth. Login at `/admin/login` calls `supabase.auth.signInWithPassword`. The session is managed by the Supabase client and persisted in `localStorage`.

`AdminGuard` wraps all `/admin/*` routes. On mount it calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange`. Unauthenticated requests redirect to `/admin/login`; authenticated ones pass through to the admin layout.

There is no self-serve signup. Admin accounts are created directly in the Supabase dashboard under Authentication → Users.

## Supabase keep-alive

Supabase pauses free-tier projects after ~7 days without activity. To prevent that, a Netlify Scheduled Function (`netlify/functions/keep-alive.mjs`) runs daily at midnight UTC and calls the `keep_alive()` Postgres function, which updates the timestamp in the `keep_alive` table.

- `keep_alive` has RLS enabled with no policies, so the anon key can't read or write it directly. The only access is through `keep_alive()` (`security definer`, executable by `anon`).
- Logs: Netlify → Cloud compute → Functions → keep-alive (has a **Run now** button).
- Check last ping: `select pinged_at from keep_alive;` in the Supabase SQL Editor.
- Test locally: `node --env-file=.env -e "import('./netlify/functions/keep-alive.mjs').then(m => m.default())"`

<details>
<summary>SQL to recreate (run once in Supabase SQL Editor)</summary>

```sql
create table if not exists public.keep_alive (
  id int primary key default 1 check (id = 1),
  pinged_at timestamptz not null default now()
);

alter table public.keep_alive enable row level security;

create or replace function public.keep_alive()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  insert into public.keep_alive (id, pinged_at)
  values (1, now())
  on conflict (id) do update set pinged_at = excluded.pinged_at
  returning pinged_at;
$$;

revoke execute on function public.keep_alive() from public;
grant execute on function public.keep_alive() to anon;
```

</details>

## Environment variables

| variable | value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL from Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key from Supabase dashboard |

Set in `.env` locally and in Netlify under Environment variables. Both are also read by the keep-alive function, so their Netlify scope must include Functions.
