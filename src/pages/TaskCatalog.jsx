import { useEffect, useState } from 'react'
import { ArrowUpRight, ClipboardList, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listTasks } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Loading, Notice } from '../components/Notice.jsx'

const labels = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export default function TaskCatalog() {
  const [tasks, setTasks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listTasks()
      .then(({ data, error: requestError }) => {
        if (!active) return
        if (requestError)
          setError(
            isConfigured ? requestError.message : 'Connect Supabase to load the task directory.'
          )
        else setTasks(data || [])
        setLoading(false)
      })
      .catch(() => {
        if (active) {
          setError('Could not load tasks. Check your connection and try again.')
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = tasks.filter((task) =>
    `${task.title} ${task.description || ''} ${task.boards?.title || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <main className="page-shell directory-page">
      <div className="page-eyebrow">SMALL STEPS, BIG PROGRESS</div>
      <div className="catalog-heading">
        <div>
          <h1>
            Task directory<span className="brand-dot">.</span>
          </h1>
          <p>See what people are working on across Boardflow.</p>
        </div>
        <label className="catalog-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a task"
          />
        </label>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Notice>{error}</Notice>
      ) : (
        <>
          <div className="catalog-count">
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </div>
          {!filtered.length ? (
            <div className="empty-state">
              <span className="empty-icon">
                <ClipboardList size={23} />
              </span>
              <h2>{tasks.length ? 'No matching tasks' : 'No tasks to show yet'}</h2>
              <p>
                {tasks.length
                  ? 'Try a different search.'
                  : 'Tasks added to public boards will appear here.'}
              </p>
            </div>
          ) : (
            <div className="directory-grid">
              {filtered.map((task) => (
                <Link className="directory-card" to={`/tasks/${task.id}`} key={task.id}>
                  <div className="directory-card-top">
                    <span className={`priority priority-${task.priority?.toLowerCase()}`}>
                      {task.priority || 'Medium'} priority
                    </span>
                    <ArrowUpRight size={16} />
                  </div>
                  <h2>{task.title}</h2>
                  <p>{task.description || 'Open this task to see its details.'}</p>
                  <div className="directory-card-foot">
                    <span>{task.boards?.title || 'Board'}</span>
                    <span>{labels[task.status] || task.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
