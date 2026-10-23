import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Layers2, LogOut, Menu, Plus, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { searchPublicBoards } from '../lib/data.js'

export default function Topbar({ onCreate }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    const handleSearchKeys = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleSearchKeys)
    return () => window.removeEventListener('keydown', handleSearchKeys)
  }, [])

  useEffect(() => {
    if (!searchOpen || searchTerm.trim().length < 2) {
      setSearchResults([])
      setSearchError('')
      setSearchLoading(false)
      return
    }
    let active = true
    const timeout = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const { data, error } = await searchPublicBoards(searchTerm)
        if (!active) return
        setSearchResults(data || [])
        setSearchError(error?.message || '')
      } catch {
        if (active)
          setSearchError('Could not search right now. Check your connection and try again.')
      } finally {
        if (active) setSearchLoading(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [searchOpen, searchTerm])

  const logout = async () => {
    await signOut()
    navigate('/')
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const term = searchTerm.trim()
    navigate(term ? `/boards?search=${encodeURIComponent(term)}` : '/boards')
    setSearchOpen(false)
  }
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Layers2 size={19} />
        </span>
        <span>
          boardflow<span className="brand-dot">.</span>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/boards">Explore</NavLink>
        {user && (
          <>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/people">People</NavLink>
            <NavLink to="/dashboard">My workspace</NavLink>
          </>
        )}
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/help">Help</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </nav>

      <div className="top-actions">
        <div className="header-search-wrap">
          <button
            className="search-shortcut"
            aria-expanded={searchOpen}
            aria-label="Find a public board"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search size={15} /> <span>Find a board</span>
            <kbd>⌘ K</kbd>
          </button>
          {searchOpen && (
            <div className="header-search-panel">
              <form className="header-search-form" onSubmit={submitSearch}>
                <Search size={16} />
                <input
                  autoFocus
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search public boards"
                  aria-label="Search public boards"
                />
                <button type="submit" aria-label="Show all matching boards">
                  <ArrowUpRight size={15} />
                </button>
              </form>
              <div className="header-search-results" aria-live="polite">
                {searchTerm.trim().length < 2 ? (
                  <p>Type at least 2 characters to search public boards.</p>
                ) : searchLoading ? (
                  <p>Searching public boards…</p>
                ) : searchError ? (
                  <p className="header-search-error">{searchError}</p>
                ) : searchResults.length ? (
                  <>
                    {searchResults.map((board) => (
                      <Link
                        className="header-search-result"
                        to={`/boards/${board.id}`}
                        key={board.id}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="header-search-result-icon">
                          <Layers2 size={15} />
                        </span>
                        <span>
                          <b>{board.title}</b>
                          <small>{board.description || 'Public board'}</small>
                        </span>
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                    <button className="header-search-all" onClick={submitSearch}>
                      See all public board results
                    </button>
                  </>
                ) : (
                  <p>No public boards matched that search.</p>
                )}
              </div>
            </div>
          )}
        </div>
        {user ? (
          <>
            <button className="button button-primary button-small" onClick={onCreate}>
              <Plus size={16} /> New board
            </button>
            <Link
              className="avatar"
              to={`/profiles/${user.id}`}
              title="View your profile"
              aria-label="View your profile"
            >
              {(user.user_metadata?.full_name || user.email || 'U').slice(0, 1).toUpperCase()}
            </Link>
            <button className="icon-button" aria-label="Log out" onClick={logout}>
              <LogOut size={17} />
            </button>
          </>
        ) : (
          <>
            <Link className="login-link" to="/login">
              Log in
            </Link>
            <Link className="button button-primary button-small" to="/register">
              Get started <ArrowUpRight size={15} />
            </Link>
          </>
        )}
        <button className="mobile-menu icon-button" aria-label="Open menu">
          <Menu size={19} />
        </button>
      </div>
    </header>
  )
}
