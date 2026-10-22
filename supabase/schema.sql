-- Run this file in Supabase SQL Editor before launching the app.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 60),
  description text not null default '' check (char_length(description) <= 240),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 100),
  description text not null default '' check (char_length(description) <= 500),
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  author_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.tasks enable row level security;

create policy "Profiles are readable" on public.profiles for select using (true);
create policy "Users create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Boards are public to read" on public.boards for select using (true);
create policy "Signed in users create boards" on public.boards for insert with check (auth.uid() = owner_id);
create policy "Owners edit boards" on public.boards for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owners delete boards" on public.boards for delete using (auth.uid() = owner_id);
create policy "Tasks are public to read" on public.tasks for select using (true);
create policy "Signed in users create tasks" on public.tasks for insert with check (
  auth.uid() = author_id and exists (select 1 from public.boards b where b.id = board_id)
);
create policy "Authors edit tasks" on public.tasks for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Authors delete tasks" on public.tasks for delete using (auth.uid() = author_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Grant public board browsing access while writes remain protected by RLS.
grant select on public.boards, public.tasks, public.profiles to anon, authenticated;
grant insert, update, delete on public.boards, public.tasks, public.profiles to authenticated;
