# Lazdji — Digital Menu

A mobile-first restaurant menu PWA for Lazdji (Dungan & Asian cuisine), built with
React + Vite + Tailwind CSS + Supabase. White-label ready — swap the data, colors,
and images to reuse this for another restaurant.

## ⚠️ This needs a real Supabase project to run

Unlike earlier drafts of this project, the menu is no longer backed by local mock
data — it reads live from Supabase, and the admin panel writes to it. **If you
skip the setup below, the app won't crash, but it will show a "не удалось
загрузить меню" (couldn't load the menu) screen instead of the menu** — that's
expected, not a bug. Follow the steps in order and it'll resolve.

### 1. Create a Supabase project

Free tier is fine — [supabase.com](https://supabase.com) → New Project.

### 2. Run the migrations

In the Supabase dashboard → SQL Editor, run these three files **in order**
(they're also valid input to `supabase db push` if you use the CLI instead):

```
supabase/migrations/01_schema.sql   -- tables: categories, dishes, portions
supabase/migrations/02_storage.sql  -- public dish-photos storage bucket
supabase/migrations/03_seed.sql     -- the current menu, so you have real content
```

Each file is independent and safe to run more than once (idempotent — guarded
`create`s, `drop policy if exists` before recreating, `on conflict do nothing`
on the seed inserts). If your project is in a partially-applied state from an
earlier attempt, just run all three again in order; nothing will duplicate or
error. If it's badly stuck, the clean-slate option is dropping the three
tables (`drop table if exists portions, dishes, categories cascade;`) and
running 01 → 03 fresh.

### 3. Create a staff account for the admin panel

Dashboard → Authentication → Users → Add user. There's no self-serve sign-up
screen on purpose (see `src/services/authService.js`) — this is the only way
to create one.

### 4. Configure the app

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — both are in your
Supabase project's dashboard under Settings → API.

### 5. Install and run

```bash
npm install
npm run dev
```

Open the printed local URL on your phone or in device-emulation mode — the
layout is mobile-only by design (390–430px wide); desktop isn't a target for
this QR-menu use case. The admin panel is at `/admin` (sign in with the
account from step 3).

To build for production: `npm run build` / `npm run preview`.

## Project structure

```
src/
  admin/             The admin panel — a separate top-level tree from the
                     customer menu, split by URL path in main.jsx (no router
                     dependency needed for just two destinations)
  assets/            Logo (light + dark variants) and the Halal badge image
  components/        Customer-facing UI — one component per file
  context/           AppContext.jsx — cart, language, admin mode, toasts, table number
  data/              Reference only now (see note below) — kept as documentation
                     of the exact shape the Supabase tables use
  hooks/             useMenu.js (live menu + Realtime subscription),
                     useAuth.js (admin session state)
  services/          menuService.js, authService.js — the only files that import
                     supabase directly; every component goes through these
  lib/               supabaseClient.js — the actual client, plus
                     isSupabaseConfigured (see the error-handling note below)
  utils/             format.js (pricing/colors), tableParam.js (QR table detection)
  i18n/              translations.js — Russian + Kazakh UI strings
  App.jsx            Customer page layout: hero, sticky header, category rail
  main.jsx           Entry point — routes to App or AdminApp by URL path
supabase/
  migrations/        Run these against your Supabase project (see setup above)
```

**Note on `src/data/*.js`:** these were the Sprint 2 mock data files. Nothing
imports them anymore — `menuService.js` queries Supabase directly — but
they're left in place as living documentation of the exact bilingual/
portions/flags shape the real tables use, and as a quick reference when
adding content through the admin panel.

## Error handling

`src/lib/supabaseClient.js` exports `isSupabaseConfigured`, checked before
every Supabase call in `menuService.js` / `authService.js`. Without it, a
missing `.env` would otherwise crash the *entire app* at import time (Supabase's
`createClient` throws synchronously if the URL/key are missing) — instead, it
now surfaces as a normal catchable error, and `App.jsx` / `AdminApp.jsx` show
`ConnectionError` instead of a blank page.

## Realtime sync

`useMenu()` subscribes to Postgres changes on `categories`/`dishes`/`portions`
(see `subscribeToMenuChanges` in `menuService.js`). Edit a dish in the admin
panel and it updates on any open customer tab within moments — no refresh.

## QR codes per table

`src/utils/tableParam.js` reads the table number from either URL shape a
printed QR code might use — `/menu?table=12` or `/menu/12` — and stashes it in
`sessionStorage` for the visit. Exposed as `tableNumber` from `useApp()`, not
wired into any UI yet — reserved for a future "call waiter" / "send order" flow.

**Deployment note:** static hosts need a SPA fallback so `/menu/12` serves
`index.html` instead of 404ing — e.g. on Netlify, `public/_redirects` already
has `/* /index.html 200`.

## Cart

`AppContext` owns the cart (`add/removeFromCart`, `clearCart`, `cartTotal`,
`cartCount`, `lineTotal`) — in-memory only, no persistence across a refresh yet.

"Показать официанту" (`WaiterOrderView.jsx`) is the actual order-placement
moment today, since there's no payment/kitchen integration: a clean, large-type
summary the guest turns around and shows staff. The payment method tiles in
the cart sheet are placeholders for a future sprint.

## Contacts

Instagram / WhatsApp / phone / 2GIS live in `src/data/contacts.js` — every
value there is a placeholder marked `TODO`; update before launch.

## Notes on the current design

- **Admin / stop-list mode**: long-press the wordmark in the customer site's
  header (~750ms) toggles a dish's availability instantly, for "86 this dish"
  in the moment without opening the full admin panel — both paths call the
  same `setDishAvailability()`.
- **Language**: `KZ`/`RU` toggle switches both UI strings
  (`src/i18n/translations.js`) and dish/category content (the `_ru`/`_kz`
  columns in the database).
- **Prices** use a shared `<Price />` component (`src/components/Price.jsx`)
  with two gold tones — `on="light"` on white/cream backgrounds, `on="dark"`
  on black/red ones, for correct contrast.
