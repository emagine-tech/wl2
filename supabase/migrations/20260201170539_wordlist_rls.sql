alter table public.teacher_students enable row level security;
alter table public.wordlists enable row level security;
alter table public.assignments enable row level security;

-- teacher_students
create policy "teacher can manage their student links"
on public.teacher_students
for all
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

create policy "student can view their teacher link"
on public.teacher_students
for select
using (auth.uid() = student_id);

-- wordlists
create policy "teacher can CRUD their wordlists"
on public.wordlists
for all
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

create policy "student can read assigned wordlists"
on public.wordlists
for select
using (
  exists (
    select 1 from public.assignments a
    where a.wordlist_id = wordlists.id
      and a.student_id = auth.uid()
  )
);

-- assignments
create policy "teacher can create assignments to their linked students"
on public.assignments
for insert
with check (
  auth.uid() = teacher_id
  and exists (
    select 1 from public.teacher_students ts
    where ts.teacher_id = auth.uid()
      and ts.student_id = assignments.student_id
  )
);

create policy "teacher can read/update their assignments"
on public.assignments
for select
using (auth.uid() = teacher_id);

create policy "teacher can update their assignments"
on public.assignments
for update
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

create policy "student can read their assignments"
on public.assignments
for select
using (auth.uid() = student_id);

create policy "student can update their assignment status"
on public.assignments
for update
using (auth.uid() = student_id)
with check (auth.uid() = student_id);
