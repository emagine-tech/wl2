-- TEACHER ↔ STUDENT MAP
create table if not exists public.teacher_students (
  id bigserial primary key,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (teacher_id, student_id)
);

-- WORDLISTS
create table if not exists public.wordlists (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Wordlist',
  phonemes text[] not null default '{}'::text[],
  words text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

-- ASSIGNMENTS
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  wordlist_id uuid not null references public.wordlists(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'assigned'
    check (status in ('assigned','in_progress','completed')),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_wordlists_teacher
  on public.wordlists(teacher_id, created_at desc);

create index if not exists idx_assignments_student
  on public.assignments(student_id, assigned_at desc);

create index if not exists idx_assignments_teacher
  on public.assignments(teacher_id, assigned_at desc);
