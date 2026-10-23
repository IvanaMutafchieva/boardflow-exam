import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  createTask,
  deleteBoard,
  deleteTask,
  getBoard,
  listTasks,
  updateBoard,
  updateTask,
} from '../lib/data.js'
import { Notice, Loading } from '../components/Notice.jsx'
import Modal from '../components/Modal.jsx'

const statuses = [
  { id: 'todo', label: 'To do', color: 'coral' },
  { id: 'in_progress', label: 'In progress', color: 'violet' },
  { id: 'done', label: 'Done', color: 'green' },
]
const priorities = ['Low', 'Medium', 'High']

export default function BoardWorkspace() {
  const { boardId } = useParams(),
    { user } = useAuth(),
    navigate = useNavigate()
  const [board, setBoard] = useState(null),
    [tasks, setTasks] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [modal, setModal] = useState(null),
    [menu, setMenu] = useState(false),
    [confirmDelete, setConfirmDelete] = useState(null),
    [deleting, setDeleting] = useState(false)

  const refresh = useCallback(async () => {
    const b = await getBoard(boardId)
    if (b.error) setError(b.error.message)
    else if (!b.data) setError('This board could not be found.')
    else if (b.data.owner_id !== user.id) {
      setBoard(null)
      setError('Only the board owner can manage this workspace.')
      setLoading(false)
      return
    } else setBoard(b.data)
    if (b.error || !b.data || b.data.owner_id !== user.id) {
      setLoading(false)
      return
    }
    const t = await listTasks(boardId)
    if (t.error) setError(t.error.message)
    else setTasks(t.data || [])
    setLoading(false)
  }, [boardId, user.id])
  useEffect(() => {
    refresh()
    return () => {}
  }, [refresh])

  const isOwner = board?.owner_id === user.id
  const saveTask = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget),
      values = {
        title: f.get('title'),
        description: f.get('description'),
        status: f.get('status'),
        priority: f.get('priority'),
      }
    const result = modal?.task
      ? await updateTask(modal.task.id, {
          ...values,
          title: values.title.trim(),
          description: values.description.trim(),
        })
      : await createTask(boardId, values)
    if (result.error) setError(result.error.message)
    else {
      setModal(null)
      refresh()
    }
  }

  const removeTask = async (task) => {
    setError('')
    setConfirmDelete({ type: 'task', task })
  }

  const moveTask = async (task) => {
    if (task.status === 'done') return
    const next = statuses[statuses.findIndex((s) => s.id === task.status) + 1].id
    const { error } = await updateTask(task.id, { status: next })
    if (error) setError(error.message)
    else refresh()
  }

  const saveBoard = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const { error } = await updateBoard(boardId, {
      title: f.get('title'),
      description: f.get('description'),
      is_public: f.get('is_public') === 'true',
    })

    if (error) setError(error.message)
    else {
      setModal(null)
      refresh()
    }
  }

  const removeBoard = () => {
    setError('')
    setMenu(false)
    setConfirmDelete({ type: 'board' })
  }

  const confirmRemove = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    setError('')
    const result =
      confirmDelete.type === 'board'
        ? await deleteBoard(boardId)
        : await deleteTask(confirmDelete.task.id)
    setDeleting(false)
    if (result.error) setError(result.error.message)
    else if (confirmDelete.type === 'board') navigate('/dashboard')
    else {
      setConfirmDelete(null)
      refresh()
    }
  }

  if (loading) return <Loading />
  if (!board)
    return (
      <main className="page-shell">
        <Notice>{error || 'This board could not be found.'}</Notice>
      </main>
    )
  return (
    <main className="workspace-page">
      <div className="workspace-top">
        <Link className="back-link" to="/dashboard">
          <ArrowLeft size={15} /> My boards
        </Link>
        <div className="workspace-tools">
          <span className="workspace-member">
            <i>{(user.user_metadata?.full_name || user.email).slice(0, 1).toUpperCase()}</i>
            {user.user_metadata?.full_name || user.email}
          </span>
          {isOwner && (
            <div className="relative">
              <button
                className="icon-button"
                aria-label="Board menu"
                onClick={() => setMenu(!menu)}
              >
                <MoreHorizontal size={20} />
              </button>
              {menu && (
                <div className="dropdown">
                  <button
                    onClick={() => {
                      setModal({ type: 'board' })
                      setMenu(false)
                    }}
                  >
                    <Pencil size={14} /> Edit board
                  </button>
                  <button className="danger-text" onClick={removeBoard}>
                    <Trash2 size={14} /> Delete board
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="workspace-heading">
        <div>
          <span className="page-eyebrow">YOUR WORKSPACE</span>
          <h1>{board.title}</h1>
          <p>{board.description}</p>
        </div>
        <div className="board-badges">
          <span className="pill">
            <span className={`status-dot ${board.is_public ? 'green' : 'violet'}`} />{' '}
            {board.is_public ? 'Public board' : 'Private board'}
          </span>
          <button className="button button-primary" onClick={() => setModal({ type: 'task' })}>
            <Plus size={16} /> Add a task
          </button>
        </div>
      </div>
      {error && <Notice>{error}</Notice>}
      <div className="kanban">
        {statuses.map((status) => {
          const items = tasks.filter((t) => t.status === status.id)
          return (
            <section className="kanban-column" key={status.id}>
              <header>
                <div className={`status-dot ${status.color}`} />
                <h2>{status.label}</h2>
                <span className="task-count">{items.length}</span>
                <button
                  className="icon-button add-column-task"
                  aria-label={`Add task to ${status.label}`}
                  onClick={() => setModal({ type: 'task', status: status.id })}
                >
                  <Plus size={16} />
                </button>
              </header>
              <div className="task-list">
                {items.map((task) => (
                  <article
                    className={`task-card ${task.status === 'done' ? 'task-done' : ''}`}
                    key={task.id}
                  >
                    <div className="task-card-top">
                      <span className={`priority priority-${task.priority?.toLowerCase()}`}>
                        {task.priority || 'Medium'}
                      </span>
                      {task.author_id === user.id && (
                        <div className="task-actions">
                          <button
                            className="icon-button"
                            aria-label="Edit task"
                            onClick={() => setModal({ type: 'task', task })}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="icon-button"
                            aria-label="Delete task"
                            onClick={() => removeTask(task)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3>
                      <Link className="task-title-link" to={`/tasks/${task.id}`}>
                        {task.title}
                      </Link>
                    </h3>
                    {task.description && <p>{task.description}</p>}
                    <footer>
                      {task.author_id === user.id ? (
                        <button
                          className={`task-status ${task.status === 'done' ? 'task-status-done' : ''}`}
                          onClick={() => moveTask(task)}
                          disabled={task.status === 'done'}
                          title={
                            task.status === 'done' ? 'Task is complete' : 'Move to next column'
                          }
                        >
                          {task.status === 'done' ? <Check size={14} /> : <Circle size={14} />}
                          {task.status === 'done' ? 'Done' : 'Move'}
                        </button>
                      ) : (
                        <span className="task-status">{task.status.replace('_', ' ')}</span>
                      )}
                      <span className="task-author">
                        {task.author_id === user.id ? 'You' : 'Team'}
                      </span>
                    </footer>
                  </article>
                ))}
              </div>
              <button
                className="column-add"
                onClick={() => setModal({ type: 'task', status: status.id })}
              >
                <Plus size={15} /> Add a task
              </button>
            </section>
          )
        })}
      </div>
      {!tasks.length && (
        <div className="board-empty-note">
          <span>✦</span> A fresh board. Add a first task whenever you're ready.
        </div>
      )}

      {modal?.type === 'task' && (
        <Modal title={modal.task ? 'Edit task' : 'Add a task'} onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={saveTask}>
            <label>
              Task name
              <input
                name="title"
                defaultValue={modal.task?.title}
                required
                minLength="2"
                maxLength="100"
                placeholder="What needs doing?"
              />
            </label>
            <label>
              Details
              <textarea
                name="description"
                defaultValue={modal.task?.description}
                maxLength="500"
                placeholder="A few helpful details…"
              />
            </label>
            <div className="form-row">
              <label>
                Status
                <select name="status" defaultValue={modal.task?.status || modal.status || 'todo'}>
                  {statuses.map((s) => (
                    <option value={s.id} key={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select name="priority" defaultValue={modal.task?.priority || 'Medium'}>
                  {priorities.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="button button-primary button-full">
              {modal.task ? 'Save changes' : 'Add task'}
              <span>→</span>
            </button>
          </form>
        </Modal>
      )}

      {modal?.type === 'board' && (
        <Modal title="Edit board" onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={saveBoard}>
            <label>
              Board name
              <input
                name="title"
                defaultValue={board.title}
                required
                minLength="2"
                maxLength="60"
              />
            </label>
            <label>
              Description
              <textarea name="description" defaultValue={board.description} maxLength="240" />
            </label>
            <label>
              Who can see this board?
              <select name="is_public" defaultValue={board.is_public ? 'true' : 'false'}>
                <option value="true">Public — anyone can view</option>
                <option value="false">Private — only you can view</option>
              </select>
            </label>
            <button className="button button-primary button-full">Save changes</button>
          </form>
        </Modal>
      )}
      {confirmDelete && (
        <Modal
          title={confirmDelete.type === 'board' ? 'Delete this board?' : 'Delete this task?'}
          onClose={() => !deleting && setConfirmDelete(null)}
        >
          <div className="delete-confirm">
            <span className="delete-confirm-icon">
              <AlertTriangle size={22} />
            </span>
            <p>
              {confirmDelete.type === 'board' ? (
                <>
                  This will delete <strong>{board.title}</strong> and all of its tasks. This action
                  can’t be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete <strong>“{confirmDelete.task.title}”</strong>?
                  This action can’t be undone.
                </>
              )}
            </p>
            {error && <Notice>{error}</Notice>}
            <div className="delete-confirm-actions">
              <button
                className="button delete-cancel-button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="button button-danger" onClick={confirmRemove} disabled={deleting}>
                <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}
