import { useEffect, useState } from 'react'
import { ArrowUpRight, Layers2, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { listBoards } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Notice } from '../components/Notice.jsx'

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [boards, setBoards] = useState([]),
    [query, setQuery] = useState(searchParams.get('search') || ''),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  useEffect(() => {
    let active = true
    listBoards().then(({ data, error }) => {
      if (!active) return
      if (error)
        setError(isConfigured ? error.message : 'Connect Supabase to load the live board catalog.')
      else setBoards(data || [])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const filtered = boards.filter((b) =>
    `${b.title} ${b.description || ''}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="page-shell">
      <div className="page-eyebrow">THE COMMUNITY SHELF</div>
      <div className="catalog-heading">
        <div>
          <h1>
            Explore boards<span className="brand-dot">.</span>
          </h1>
          <p>A peek at what people are making progress on.</p>
        </div>
        <label className="catalog-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a board"
          />
        </label>
      </div>
      <div className="catalog-count">
        {loading
          ? 'Loading boards…'
          : `${filtered.length} ${filtered.length === 1 ? 'board' : 'boards'}`}
      </div>
      {error && <Notice>{error}</Notice>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">
            <Layers2 size={23} />
          </span>
          <h2>{boards.length ? 'No matches yet' : 'A fresh page'}</h2>
          <p>
            {boards.length
              ? 'Try another search term.'
              : 'Public boards will show up here when their creators connect a workspace.'}
          </p>
        </div>
      )}
      <div className="catalog-grid">
        {filtered.map((board, i) => (
          <Link className="catalog-card" to={`/boards/${board.id}`} key={board.id}>
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
                <span>{board.is_public ? 'PUBLIC BOARD' : 'YOUR PRIVATE BOARD'}</span>
                <ArrowUpRight size={15} />
              </div>
              <h2>{board.title}</h2>
              <p>{board.description || 'A shared space for the next good thing.'}</p>
              <div className="catalog-owner">
                <span className="owner-avatar">
                  {(board.profiles?.full_name || 'B').slice(0, 1).toUpperCase()}
                </span>
                <span>{board.profiles?.full_name || 'Boardflow member'}</span>
                <span className="catalog-sep">·</span>
                <span>{new Date(board.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="guest-note">
        Browsing is open to everyone. <Link to="/register">Create an account</Link> to make your own
        workspace.
      </div>
    </main>
  )
}
