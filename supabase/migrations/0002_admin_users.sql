-- Admin user management ----------------------------------------------------
-- auth.users isn't queryable via PostgREST, so denormalize email onto profiles
-- for the admin Users page.

alter table profiles add column email text;

update profiles p
set email = u.email
from auth.users u
where p.id = u.id;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

-- Admins can see and manage every profile (needed for the Users page).

create policy "admins read all profiles"
  on profiles for select
  using (is_admin());

create policy "admins update all profiles"
  on profiles for update
  using (is_admin())
  with check (is_admin());

-- Guard against privilege escalation: the existing "owner can update their own
-- profile" policy is row-level only, so without this a student could PATCH
-- their own role to 'admin'. This trigger blocks any role change made by a
-- non-admin, regardless of whose row a policy would otherwise let them touch.

create function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    raise exception 'Only admins can change a user role';
  end if;
  return new;
end;
$$;

create trigger guard_role_change
  before update on profiles
  for each row execute procedure prevent_role_self_escalation();
