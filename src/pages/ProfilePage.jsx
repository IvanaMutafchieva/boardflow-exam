import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Layers2, Pencil, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getProfile, listBoards, updateProfile } from '../lib/data.js'
import { isConfigured } from '../lib/supabase.js'
import { Loading, Notice } from '../components/Notice.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Modal from '../components/Modal.jsx'

export default function ProfilePage() {
  const { profileId } = useParams()
  const { user, updateAccountName } = useAuth()
  const [profile, setProfile] = useState(null)
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([getProfile(profileId), listBoards({ ownerId: profileId })]).then(
      ([profileResult, boardResult]) => {
        if (!active) return
        if (profileResult.error)
          setError(
            isConfigured ? profileResult.error.message : 'Connect Supabase to open member profiles.'
          )
        else setProfile(profileResult.data)
        if (boardResult.error && !profileResult.error) setError(boardResult.error.message)
        else setBoards(boardResult.data || [])
        setLoading(false)
      }
    )
    return () => {
      active = false
    }
  }, [profileId])

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaveError('')
    setSaveMessage('')
    const fullName = new FormData(event.currentTarget).get('full_name').trim()
    if (fullName.length < 2) {
      setSaveError('Please enter a name with at least 2 characters.')
      return
    }
    setSaving(true)
    try {
      const { data, error: profileError } = await updateProfile(profile.id, { full_name: fullName })
      if (profileError) {
        setSaveError(profileError.message)
        return
      }
      setProfile(data)
      const { error: accountError } = await updateAccountName(fullName)
      setEditing(false)
      setSaveMessage(
        accountError
          ? 'Your profile was saved. Your account display name may refresh after signing in again.'
          : 'Your profile was updated.'
      )
    } catch {
      setSaveError('Could not save your profile. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error)
    return (
      <main className="page-shell">
        <Notice>{error}</Notice>
      </main>
    )

  return (
    <main className="page-shell profile-page">
      <section className="profile-hero">
        <div className="profile-avatar-large">
          <UserRound size={31} />
        </div>
        <div>
          <div className="page-eyebrow">BOARDFLOW MEMBER</div>
          <h1>{profile.full_name || 'Boardflow member'}</h1>
          <p>Making thoughtful progress, one task at a time.</p>
          <div className="profile-joined">
            <CalendarDays size={14} /> Member since{' '}
            {new Date(profile.created_at).toLocaleDateString()}
          </div>
        </div>
        {user?.id === profile.id && (
          <button
            className="button button-primary profile-edit-button"
            onClick={() => {
              setSaveError('')
              setSaveMessage('')
              setEditing(true)
            }}
          >
            <Pencil size={15} /> Edit profile
          </button>
        )}
      </section>
      {saveMessage && <Notice kind="success">{saveMessage}</Notice>}
      {saveError && <Notice>{saveError}</Notice>}
      <div className="section-heading profile-section-heading">
        <div>
          <h2>
            Public boards <span>{boards.length}</span>
          </h2>
          <p>Projects shared by this member.</p>
        </div>
      </div>
      {boards.length ? (
        <div className="catalog-grid">
          {boards.map((board, i) => (
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
                  <span>PUBLIC BOARD</span>
                  <ArrowUpRight size={15} />
                </div>
                <h2>{board.title}</h2>
                <p>{board.description || 'A shared space for the next good thing.'}</p>
                <div className="catalog-owner">
                  Created {new Date(board.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">
            <Layers2 size={23} />
          </span>
          <h2>No public boards yet</h2>
          <p>This member has not created a board to share.</p>
        </div>
      )}
      {editing && user?.id === profile.id && (
        <Modal title="Edit your profile" onClose={() => !saving && setEditing(false)}>
          <form className="form-stack" onSubmit={saveProfile}>
            <label>
              Your name
              <input
                name="full_name"
                defaultValue={profile.full_name}
                required
                minLength="2"
                maxLength="60"
                autoComplete="name"
              />
            </label>
            {saveError && <Notice>{saveError}</Notice>}
            <button className="button button-primary button-full" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </Modal>
      )}
    </main>
  )
}
