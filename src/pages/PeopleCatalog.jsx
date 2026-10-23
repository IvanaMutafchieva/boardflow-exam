import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Search, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listProfiles } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Loading, Notice } from '../components/Notice.jsx'

export default function PeopleCatalog() {
  const [people, setPeople] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listProfiles()
      .then(({ data, error: requestError }) => {
        if (!active) return
        if (requestError)
          setError(
            isConfigured ? requestError.message : 'Connect Supabase to load the member directory.'
          )
        else setPeople(data || [])
        setLoading(false)
      })
      .catch(() => {
        if (active) {
          setError('Could not load members. Check your connection and try again.')
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = people.filter((person) =>
    (person.full_name || 'Boardflow member').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="page-shell directory-page">
      <div className="page-eyebrow">GOOD WORK HAPPENS TOGETHER</div>
      <div className="catalog-heading">
        <div>
          <h1>
            People<span className="brand-dot">.</span>
          </h1>
          <p>Meet the members making progress in Boardflow.</p>
        </div>
        <label className="catalog-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a member"
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
            {filtered.length} {filtered.length === 1 ? 'member' : 'members'}
          </div>
          {!filtered.length ? (
            <div className="empty-state">
              <span className="empty-icon">
                <UserRound size={23} />
              </span>
              <h2>{people.length ? 'No matching members' : 'No members to show yet'}</h2>
              <p>
                {people.length
                  ? 'Try a different search.'
                  : 'New members will appear here after they create an account.'}
              </p>
            </div>
          ) : (
            <div className="directory-grid people-grid">
              {filtered.map((person) => (
                <Link
                  className="directory-card person-card"
                  to={`/profiles/${person.id}`}
                  key={person.id}
                >
                  <div className="person-avatar">
                    <UserRound size={23} />
                  </div>
                  <div className="directory-card-top">
                    <span>BOARDFLOW MEMBER</span>
                    <ArrowUpRight size={16} />
                  </div>
                  <h2>{person.full_name || 'Boardflow member'}</h2>
                  <p>Making thoughtful progress, one task at a time.</p>
                  <div className="directory-card-foot">
                    <span>
                      <CalendarDays size={14} /> Joined{' '}
                      {new Date(person.created_at).toLocaleDateString()}
                    </span>
                    <span>View profile</span>
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
