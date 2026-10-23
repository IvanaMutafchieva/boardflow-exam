import { supabase, isConfigured } from './supabase.js'
export async function listBoards({ mine = false, userId, ownerId } = {}) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  let query = supabase
    .from('boards')
    .select('id,title,description,is_public,created_at,owner_id,profiles(full_name)')
    .order('created_at', { ascending: false })
  if (mine && userId) query = query.eq('owner_id', userId)
  else query = query.eq('is_public', true)
  if (ownerId) query = query.eq('owner_id', ownerId)
  return query
}

export async function searchPublicBoards(searchTerm) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  const term = searchTerm.trim()
  if (term.length < 2) return { data: [], error: null }
  return supabase
    .from('boards')
    .select('id,title,description,is_public')
    .eq('is_public', true)
    .ilike('title', `%${term}%`)
    .order('created_at', { ascending: false })
    .limit(6)
}

export async function listProfiles() {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase
    .from('profiles')
    .select('id,full_name,created_at')
    .order('created_at', { ascending: false })
}
export async function getBoard(id) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase
    .from('boards')
    .select('id,title,description,is_public,created_at,owner_id,profiles(full_name)')
    .eq('id', id)
    .single()
}

export async function getTask(id) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase
    .from('tasks')
    .select(
      'id,title,description,status,priority,author_id,board_id,created_at,boards(id,title,owner_id)'
    )
    .eq('id', id)
    .single()
}

export async function getProfile(id) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase.from('profiles').select('id,full_name,created_at').eq('id', id).single()
}

export async function updateProfile(id, { full_name }) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase
    .from('profiles')
    .update({ full_name: full_name.trim() })
    .eq('id', id)
    .select('id,full_name,created_at')
    .single()
}

export async function createBoard({ title, description = '', is_public = true }) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return supabase
    .from('boards')
    .insert({ title: title.trim(), description: description.trim(), is_public, owner_id: user.id })
    .select()
    .single()
}

export async function updateBoard(id, changes) {
  return supabase
    .from('boards')
    .update({
      title: changes.title.trim(),
      description: changes.description.trim(),
      is_public: changes.is_public,
    })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteBoard(id) {
  return supabase.from('boards').delete().eq('id', id)
}

export async function listTasks(boardId) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  let query = supabase
    .from('tasks')
    .select(
      'id,title,description,status,priority,author_id,board_id,created_at,boards!inner(id,title,is_public)'
    )
    .order('created_at', { ascending: false })
  if (boardId) query = query.eq('board_id', boardId).order('created_at', { ascending: true })
  else query = query.eq('boards.is_public', true)
  return query
}

export async function createTask(boardId, { title, description, status, priority }) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return supabase
    .from('tasks')
    .insert({
      board_id: boardId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      author_id: user.id,
    })
    .select()
    .single()
}

export async function updateTask(id, changes) {
  return supabase.from('tasks').update(changes).eq('id', id).select().single()
}

export async function deleteTask(id) {
  return supabase.from('tasks').delete().eq('id', id)
}

export async function submitHelpQuestion({ name, email, question }) {
  if (!isConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  return supabase.from('help_questions').insert({
    name: name.trim(),
    email: email.trim(),
    question: question.trim(),
  })
}
