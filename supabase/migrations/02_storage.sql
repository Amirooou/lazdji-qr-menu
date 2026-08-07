-- Storage bucket for dish photos. Public read (so <img src> just works on
-- the customer site with no auth), authenticated-only write (uploads only
-- happen from the admin panel).
--
-- Independent of 01_schema.sql and 03_seed.sql — safe to run in any order
-- relative to them, and safe to run more than once.

insert into storage.buckets (id, name, public)
values ('dish-photos', 'dish-photos', true)
on conflict (id) do nothing;

drop policy if exists "dish photos are publicly readable" on storage.objects;
create policy "dish photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'dish-photos');

drop policy if exists "dish photos are uploadable by authenticated staff" on storage.objects;
create policy "dish photos are uploadable by authenticated staff"
  on storage.objects for insert
  with check (bucket_id = 'dish-photos' and auth.role() = 'authenticated');

drop policy if exists "dish photos are updatable by authenticated staff" on storage.objects;
create policy "dish photos are updatable by authenticated staff"
  on storage.objects for update
  using (bucket_id = 'dish-photos' and auth.role() = 'authenticated');

drop policy if exists "dish photos are deletable by authenticated staff" on storage.objects;
create policy "dish photos are deletable by authenticated staff"
  on storage.objects for delete
  using (bucket_id = 'dish-photos' and auth.role() = 'authenticated');
