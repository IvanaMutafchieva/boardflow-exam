import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, LockKeyhole, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getBoard } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Notice, Loading } from '../components/Notice.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function BoardDetail() {
  const { boardId } = useParams(),
    { user } = useAuth()
  const [board, setBoard] = useState(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getBoard(boardId).then(({ data, error }) => {
      if (!active) return
      if (error) setError(isConfigured ? error.message : 'Connect Supabase to open board details.')
      else setBoard(data)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [boardId])

  if (loading) return <Loading />
  if (error)
    return (
      <main className="page-shell">
        <Link className="back-link" to="/boards">
          <ArrowLeft size={15} /> All boards
        </Link>
        <Notice>{error}</Notice>
      </main>
    )
  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/boards">
        <ArrowLeft size={15} /> All boards
      </Link>
      <section className="detail-hero">
        <div className="detail-art">
          <div className="mini-board">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="detail-copy">
          <div className="page-eyebrow">
            {board.is_public ? 'PUBLIC' : 'PRIVATE'} BOARD · BOARD DETAILS
          </div>
          <h1>{board.title}</h1>
          <p>{board.description || 'A shared space for the next good thing.'}</p>
          <div className="detail-by">
            <span className="owner-avatar">
              <UserRound size={15} />
            </span>
            <span>
              Created by{' '}
              <Link to={`/profiles/${board.owner_id}`}>
                <b>{board.profiles?.full_name || 'Boardflow member'}</b>
              </Link>
            </span>
            <span className="catalog-sep">·</span>
            <span>{new Date(board.created_at).toLocaleDateString()}</span>
          </div>
          <div className="detail-actions">
            {!user ? (
              <Link className="button button-primary button-large" to="/login">
                Log in to manage your boards <ArrowUpRight size={16} />
              </Link>
            ) : user.id === board.owner_id ? (
              <Link className="button button-primary button-large" to={`/workspace/${board.id}`}>
                Open your workspace <ArrowUpRight size={16} />
              </Link>
            ) : (
              <Link className="button button-primary button-large" to="/dashboard">
                Go to my workspace <ArrowUpRight size={16} />
              </Link>
            )}
            <span className="detail-privacy">
              <LockKeyhole size={13} />{' '}
              {board.is_public
                ? 'Public preview · only the owner can edit'
                : 'Only the owner can view and edit this board'}
            </span>
          </div>
        </div>
      </section>
      <div className="detail-divider" />
      <div className="detail-footnote">
        <span>Thoughtful planning starts with a clear next step.</span>
        <Link to="/register">
          Make your own board
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </main>
  )
}
