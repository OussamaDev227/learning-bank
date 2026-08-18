-- Roles & profiles --------------------------------------------------------

create type role as enum ('student', 'admin');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are readable by their owner"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles are updatable by their owner"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Helper: is the current user an admin? ------------------------------------

create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Courses -------------------------------------------------------------------

create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  order_index int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table courses enable row level security;

create policy "published courses are readable by everyone signed in"
  on courses for select
  using (is_published or is_admin());

create policy "admins manage courses"
  on courses for all
  using (is_admin())
  with check (is_admin());

-- Lessons ---------------------------------------------------------------

create table lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  content text not null,
  order_index int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table lessons enable row level security;

create policy "published lessons are readable by everyone signed in"
  on lessons for select
  using (is_published or is_admin());

create policy "admins manage lessons"
  on lessons for all
  using (is_admin())
  with check (is_admin());

-- Lesson progress ------------------------------------------------------

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table lesson_progress enable row level security;

create policy "users manage their own lesson progress"
  on lesson_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Quizzes & questions ----------------------------------------------------

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references lessons (id) on delete cascade,
  title text not null
);

alter table quizzes enable row level security;

create policy "quizzes readable when their lesson is readable"
  on quizzes for select
  using (
    is_admin()
    or exists (select 1 from lessons l where l.id = lesson_id and l.is_published)
  );

create policy "admins manage quizzes"
  on quizzes for all
  using (is_admin())
  with check (is_admin());

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes (id) on delete cascade,
  question_text text not null,
  options jsonb not null,
  correct_index int not null,
  order_index int not null default 0
);

alter table quiz_questions enable row level security;

create policy "quiz questions readable when their quiz is readable"
  on quiz_questions for select
  using (
    is_admin()
    or exists (
      select 1 from quizzes q
      join lessons l on l.id = q.lesson_id
      where q.id = quiz_id and l.is_published
    )
  );

create policy "admins manage quiz questions"
  on quiz_questions for all
  using (is_admin())
  with check (is_admin());

-- Quiz attempts -----------------------------------------------------------

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id uuid not null references quizzes (id) on delete cascade,
  score int not null,
  total int not null,
  completed_at timestamptz not null default now()
);

alter table quiz_attempts enable row level security;

create policy "users manage their own quiz attempts"
  on quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
