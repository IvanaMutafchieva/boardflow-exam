-- Run this once in Supabase SQL Editor to make task and profile data members-only.
drop policy if exists "Profiles are readable" on public.profiles;
drop policy if exists "Profiles are readable by signed in users" on public.profiles;
create policy "Profiles are readable by signed in users"
  on public.profiles for select to authenticated
  using (auth.uid() is not null);

drop policy if exists "Tasks are public to read" on public.tasks;
drop policy if exists "Tasks are readable by signed in users" on public.tasks;
create policy "Tasks are readable by signed in users"
  on public.tasks for select to authenticated
  using (auth.uid() is not null);
