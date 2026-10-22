import { supabase, isConfigured } from './supabase.js'
export async function listBoards({ mine = false, userId } = {}) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  let query = supabase.from('boards').select('id,title,description,created_at,owner_id,profiles(full_name)').order('created_at', { ascending: false })
  if (mine && userId) query = query.eq('owner_id', userId)
  return query
}
export async function getBoard(id) {
  if (!isConfigured)
    return { data: null, error: new Error('Supabase is not configured.') };
  return supabase.from('boards').select('id,title,description,created_at,owner_id,profiles(full_name)').eq('id', id).single()
}

export async function createBoard({ title, description = '' }) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('boards').insert({ title: title.trim(), description: description.trim(), owner_id: user.id }).select().single()
}

export async function updateBoard(id, changes) {
  return supabase.from('boards').update({ title: changes.title.trim(), description: changes.description.trim() }).eq('id', id).select().single()
}

export async function deleteBoard(id) {
  return supabase.from('boards').delete().eq('id', id)
}

export async function listTasks(boardId) {
  return supabase.from('tasks').select('*').eq('board_id', boardId).order('created_at', { ascending: true })
}

export async function createTask(boardId, { title, description, status, priority }) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('tasks').insert({ board_id: boardId, title: title.trim(), description: description.trim(), status, priority, author_id: user.id }).select().single()
}

export async function updateTask(id, changes) {
  return supabase.from('tasks').update(changes).eq('id', id).select().single()
}

export async function deleteTask(id) {
  return supabase.from('tasks').delete().eq('id', id)
}

