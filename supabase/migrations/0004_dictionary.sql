-- Smart Dictionary -----------------------------------------------------

create table dictionary_entries (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  root text,
  part_of_speech text,
  meaning text not null,
  examples text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index dictionary_entries_word_idx on dictionary_entries (word);
create index dictionary_entries_root_idx on dictionary_entries (root);

alter table dictionary_entries enable row level security;

create policy "published dictionary entries are public"
  on dictionary_entries for select
  using (is_published or is_admin());

create policy "admins manage dictionary entries"
  on dictionary_entries for all
  using (is_admin())
  with check (is_admin());
