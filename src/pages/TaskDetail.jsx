import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CircleUserRound,
  ClipboardList,
  LockKeyhole,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getTask } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Loading, Notice } from '../components/Notice.jsx'

const labels = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export default function TaskDetail() {
  const { taskId } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getTask(taskId).then(({ data, error }) => {
      if (!active) return
      if (error) setError(isConfigured ? error.message : 'Connect Supabase to open task details.')
      else setTask(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [taskId])

  if (loading) return <Loading />
  if (error)
    return (
      <main className="page-shell">
        <Link className="back-link" to="/boards">
          <ArrowLeft size={15} /> Browse boards
        </Link>
        <Notice>{error}</Notice>
      </main>
    )

  return (
    <main className="page-shell task-detail-page">
      <Link className="back-link" to={`/boards/${task.board_id}`}>
        <ArrowLeft size={15} /> Back to board details
      </Link>
      <section className="task-detail-card">
        <div className="task-detail-top">
          <span className={`priority priority-${task.priority?.toLowerCase()}`}>
            {task.priority || 'Medium'} priority
          </span>
          <span className="task-detail-status">
            <span
              className={`status-dot ${task.status === 'done' ? 'green' : task.status === 'in_progress' ? 'violet' : 'coral'}`}
            />
            {labels[task.status] || task.status}
          </span>
        </div>
        <div className="page-eyebrow">TASK DETAILS</div>
        <h1>{task.title}</h1>
        <p className="task-detail-description">
          {task.description || 'No extra details have been added to this task yet.'}
        </p>
        <div className="task-detail-meta">
          <div>
            <ClipboardList size={16} />
            <span>Board</span>
            <Link to={`/boards/${task.board_id}`}>
              {task.boards?.title || 'View board'} <ArrowUpRight size={13} />
            </Link>
          </div>
          <div>
            <CircleUserRound size={16} />
            <span>Created by</span>
            <Link to={`/profiles/${task.author_id}`}>
              View member profile <ArrowUpRight size={13} />
            </Link>
          </div>
          <div>
            <CalendarDays size={16} />
            <span>Created</span>
            <b>{new Date(task.created_at).toLocaleDateString()}</b>
          </div>
        </div>
        <div className="task-detail-foot">
          <LockKeyhole size={14} /> Only the board owner can manage this task and its workspace.
        </div>
      </section>
    </main>
  )
}
