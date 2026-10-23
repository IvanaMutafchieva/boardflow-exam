import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  Layers2,
  LockKeyhole,
  Plus,
  Sparkles,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { listBoards, updateBoard } from '../lib/data.js'
import { Notice, Loading } from '../components/Notice.jsx'

export default function Dashboard({ onCreate }) {
  const { user } = useAuth()
  const [boards, setBoards] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [updatingBoardId, setUpdatingBoardId] = useState(''),
    [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    listBoards({ mine: true, userId: user.id }).then(({ data, error }) => {
      if (!active) return
      if (error) setError(error.message)
      else setBoards(data || [])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [user.id])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const toggleBoardVisibility = async (board) => {
    setError('')
    setToast('')
    setUpdatingBoardId(board.id)
    const nextIsPublic = !board.is_public
    try {
      const { error: updateError } = await updateBoard(board.id, {
        title: board.title,
        description: board.description || '',
        is_public: nextIsPublic,
      })
      if (updateError) setError(updateError.message)
      else {
        setBoards((current) =>
          current.map((item) =>
            item.id === board.id ? { ...item, is_public: nextIsPublic } : item
          )
        )
        setToast(`“${board.title}” is now ${nextIsPublic ? 'public' : 'private'}.`)
      }
    } catch {
      setError('Could not change board visibility. Check your connection and try again.')
    } finally {
      setUpdatingBoardId('')
    }
  }

  return (
    <main className="page-shell dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <div className="page-eyebrow">YOUR LITTLE CORNER OF THE INTERNET</div>
          <h1>
            Good to have you,
            <br />
            <span>{user.user_metadata?.full_name?.split(' ')[0] || 'friend'}.</span>
          </h1>
          <p>Ready to make a bit of progress?</p>
        </div>
        <div className="welcome-stamp">
          <Sparkles size={22} />
          <span>
            One thing
            <br />
            at a time.
          </span>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>
            Your boards <span>{boards.length}</span>
          </h2>
          <p>Everything you're moving forward, all in one spot.</p>
        </div>
        <button className="button button-primary" onClick={onCreate}>
          <Plus size={17} /> New board
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Notice>{error}</Notice>
      ) : boards.length ? (
        <div className="catalog-grid dashboard-grid">
          {boards.map((b, i) => (
            <article className="dashboard-board-item" key={b.id}>
              <Link className="catalog-card" to={`/workspace/${b.id}`}>
                <div className={`catalog-art art-${i % 4}`}>
                  <div className="mini-board">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="catalog-art-icon">
                    <Layers2 size={18} />
                  </span>
                </div>
                <div className="catalog-card-body">
                  <div className="catalog-meta">
                    <span>YOUR BOARD</span>
                    <span
                      className={`board-visibility ${b.is_public ? 'visibility-public' : 'visibility-private'}`}
                    >
                      {b.is_public ? <Globe2 size={11} /> : <LockKeyhole size={11} />}
                      {b.is_public ? 'Public' : 'Private'}
                    </span>
                    <ArrowUpRight size={15} />
                  </div>
                  <h2>{b.title}</h2>
                  <p>{b.description || 'A space to get things moving.'}</p>
                  <div className="catalog-owner">
                    Created {new Date(b.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
              <button
                className={`board-visibility-toggle ${b.is_public ? 'toggle-private' : 'toggle-public'}`}
                onClick={() => toggleBoardVisibility(b)}
                disabled={updatingBoardId === b.id}
                aria-label={`${b.is_public ? 'Make private' : 'Make public'} ${b.title}`}
              >
                {b.is_public ? <LockKeyhole size={14} /> : <Globe2 size={14} />}
                {updatingBoardId === b.id
                  ? 'Updating…'
                  : b.is_public
                    ? 'Make private'
                    : 'Make public'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state dashboard-empty">
          <span className="empty-icon">
            <Layers2 size={23} />
          </span>
          <h2>Start with a blank board</h2>
          <p>Give your next project a little room to grow.</p>
          <button className="button button-primary" onClick={onCreate}>
            <Plus size={16} /> Create your first board
          </button>
        </div>
      )}
      <div className="dashboard-tip">
        <span>✦</span>
        <p>
          <b>A small tip</b> — Boards are easiest to keep up with when the next step is always
          visible.
        </p>
      </div>
      {toast && (
        <div className="toast-notification" role="status" aria-live="polite">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}>
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  )
}
