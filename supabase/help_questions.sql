-- Run this after schema.sql to enable the public Help form.
-- Submitted questions can be inserted by guests, but are not readable through the public API.
create table if not exists public.help_questions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  email text not null check (char_length(email) between 3 and 254 and position('@' in email) > 1),
  question text not null check (char_length(btrim(question)) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.help_questions enable row level security;

drop policy if exists "Visitors submit help questions" on public.help_questions;
create policy "Visitors submit help questions"
  on public.help_questions for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 2 and 80
    and char_length(email) between 3 and 254
    and position('@' in email) > 1
    and char_length(btrim(question)) between 10 and 2000
  );

grant insert on public.help_questions to anon, authenticated;
