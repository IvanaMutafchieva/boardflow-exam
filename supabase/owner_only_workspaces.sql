-- Run once in Supabase SQL Editor to ensure only board owners can manage a board workspace.
drop policy if exists "Signed in users create tasks" on public.tasks;
drop policy if exists "Signed in users create tasks on visible boards" on public.tasks;
drop policy if exists "Board owners create tasks" on public.tasks;
create policy "Board owners create tasks"
  on public.tasks for insert to authenticated
  with check (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and b.owner_id = auth.uid()
    )
  );

drop policy if exists "Authors edit tasks" on public.tasks;
drop policy if exists "Authors edit tasks on visible boards" on public.tasks;
drop policy if exists "Authors edit tasks on their own boards" on public.tasks;
create policy "Authors edit tasks on their own boards"
  on public.tasks for update to authenticated
  using (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and b.owner_id = auth.uid()
    )
  ) with check (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and b.owner_id = auth.uid()
    )
  );

drop policy if exists "Authors delete tasks" on public.tasks;
drop policy if exists "Authors delete tasks on visible boards" on public.tasks;
drop policy if exists "Authors delete tasks on their own boards" on public.tasks;
create policy "Authors delete tasks on their own boards"
  on public.tasks for delete to authenticated
  using (
    auth.uid() = author_id and exists (
      select 1 from public.boards b
      where b.id = board_id and b.owner_id = auth.uid()
    )
  );
