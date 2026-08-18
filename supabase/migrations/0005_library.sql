-- Digital Library ------------------------------------------------------

create table library_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  author text,
  resource_type text not null check (resource_type in ('كتاب', 'مقال', 'رسالة جامعية', 'معجم رقمي')),
  file_url text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table library_resources enable row level security;

create policy "published library resources are public"
  on library_resources for select
  using (is_published or is_admin());

create policy "admins manage library resources"
  on library_resources for all
  using (is_admin())
  with check (is_admin());

-- Storage bucket for the uploaded files -------------------------------

insert into storage.buckets (id, name, public)
values ('library', 'library', true)
on conflict (id) do nothing;

create policy "public can read library files"
  on storage.objects for select
  using (bucket_id = 'library');

create policy "admins upload library files"
  on storage.objects for insert
  with check (bucket_id = 'library' and is_admin());

create policy "admins update library files"
  on storage.objects for update
  using (bucket_id = 'library' and is_admin());

create policy "admins delete library files"
  on storage.objects for delete
  using (bucket_id = 'library' and is_admin());
