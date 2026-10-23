-- Run once in Supabase SQL Editor to add public/private board access.
alter table public.boards
  add column if not exists is_public boolean not null default true;

drop policy if exists "Boards are public to read" on public.boards;
drop policy if exists "Boards are visible to everyone when public or to their owner" on public.boards;
create policy "Boards are visible to everyone when public or to their owner"
  on public.boards for select
  using (is_public or auth.uid() = owner_id);

drop policy if exists "Tasks are public to read" on public.tasks;
drop policy if exists "Tasks are readable by signed in users" on public.tasks;
drop policy if exists "Tasks follow board visibility" on public.tasks;
create policy "Tasks follow board visibility"
  on public.tasks for select to authenticated
  using (
    exists (
      select 1 from public.boards b
      where b.id = board_id and (b.is_public or b.owner_id = auth.uid())
    )
  );

drop policy if exists "Signed in users create tasks" on public.tasks;
drop policy if exists "Signed in users create tasks on visible boards" on public.tasks;
create policy "Signed in users create tasks on visible boards"
  on public.tasks for insert to authenticated
  with check (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and (b.is_public or b.owner_id = auth.uid())
    )
  );

drop policy if exists "Authors edit tasks" on public.tasks;
drop policy if exists "Authors edit tasks on visible boards" on public.tasks;
create policy "Authors edit tasks on visible boards"
  on public.tasks for update to authenticated
  using (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and (b.is_public or b.owner_id = auth.uid())
    )
  ) with check (auth.uid() = author_id);

drop policy if exists "Authors delete tasks" on public.tasks;
drop policy if exists "Authors delete tasks on visible boards" on public.tasks;
create policy "Authors delete tasks on visible boards"
  on public.tasks for delete to authenticated
  using (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and (b.is_public or b.owner_id = auth.uid())
    )
  );
