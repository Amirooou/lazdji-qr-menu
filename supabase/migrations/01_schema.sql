-- Lazdji menu — core schema.
-- Run this in the Supabase SQL editor (or via `supabase db push` if you use
-- the CLI) on a fresh project before 02_storage.sql / 03_seed.sql.
--
-- Safe to run more than once: every `create` is guarded, and policies are
-- dropped-then-recreated instead of erroring if they already exist.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ─────────────────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name_ru     text not null,
  name_kz     text not null,
  "order"     int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- dishes
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists dishes (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references categories(id) on delete restrict,
  title_ru        text not null,
  title_kz        text not null,
  description_ru  text not null default '',
  description_kz  text not null default '',
  -- null when the dish is priced per-portion instead (see `portions` below).
  price           numeric,
  photo           text not null default '',
  available       boolean not null default true,
  is_signature    boolean not null default false,
  is_spicy        boolean not null default false,
  is_new          boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint price_non_negative check (price is null or price >= 0)
);

create index if not exists dishes_category_id_idx on dishes(category_id);

-- keep updated_at current on every row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dishes_set_updated_at on dishes;
create trigger dishes_set_updated_at
  before update on dishes
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- portions
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists portions (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references dishes(id) on delete cascade,
  title_ru    text not null,
  title_kz    text not null,
  price       numeric not null check (price >= 0),
  serves      text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists portions_dish_id_idx on portions(dish_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
--
-- Everyone (the anon key the customer site uses) can READ. Only signed-in
-- staff (the admin panel, authenticated via Supabase Auth) can write. This
-- is what makes the anon key safe to ship in client-side code.
-- ─────────────────────────────────────────────────────────────────────────
alter table categories enable row level security;
alter table dishes     enable row level security;
alter table portions   enable row level security;

drop policy if exists "categories are publicly readable" on categories;
create policy "categories are publicly readable"
  on categories for select
  using (true);

drop policy if exists "categories are writable by authenticated staff" on categories;
create policy "categories are writable by authenticated staff"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "dishes are publicly readable" on dishes;
create policy "dishes are publicly readable"
  on dishes for select
  using (true);

drop policy if exists "dishes are writable by authenticated staff" on dishes;
create policy "dishes are writable by authenticated staff"
  on dishes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "portions are publicly readable" on portions;
create policy "portions are publicly readable"
  on portions for select
  using (true);

drop policy if exists "portions are writable by authenticated staff" on portions;
create policy "portions are writable by authenticated staff"
  on portions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────
-- Realtime
--
-- Lets the customer site subscribe to changes and update instantly —
-- no manual refresh needed when staff edits the menu. Guarded because
-- `alter publication ... add table` errors (not just no-ops) if the table
-- has already been added — e.g. on a second run of this file.
-- ─────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'categories'
  ) then
    alter publication supabase_realtime add table categories;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'dishes'
  ) then
    alter publication supabase_realtime add table dishes;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'portions'
  ) then
    alter publication supabase_realtime add table portions;
  end if;
end $$;
