import { useState } from 'react'
import { ArrowLeft, ArrowRight, Layers2, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Notice } from '../components/Notice.jsx'

export default function ResetPassword() {
  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ password: '', confirmPassword: '' })

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setBusy(true)
    const { error: updateError } = await updatePassword(form.password)
    setBusy(false)
    if (updateError) setError(updateError.message)
    else navigate('/dashboard', { replace: true })
  }

  return (
    <main className="auth-page">
      <div className="auth-decor decor-a" />
      <div className="auth-decor decor-b" />
      <Link className="back-link auth-back" to="/">
        <ArrowLeft size={15} /> Back home
      </Link>
      <div className="auth-card">
        <div className="auth-mark">
          <Layers2 size={21} />
        </div>
        <div className="page-eyebrow">ACCOUNT RECOVERY</div>
        <h1>Choose a new password.</h1>
        {loading ? (
          <p>Checking your reset link…</p>
        ) : !user ? (
          <>
            <p>This reset link is invalid or has expired. Request a new one from the login page.</p>
            <Link className="button button-primary button-full" to="/login">
              Back to log in <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <p>Use at least 6 characters for your new password.</p>
            <form className="form-stack auth-form" onSubmit={submit}>
              <label>
                New password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                  minLength="6"
                  maxLength="72"
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  required
                  minLength="6"
                  maxLength="72"
                  autoComplete="new-password"
                />
              </label>
              {error && <Notice>{error}</Notice>}
              <button className="button button-primary button-full" disabled={busy}>
                {busy ? 'Saving…' : 'Save new password'}
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}
        <div className="auth-foot">
          <Sparkles size={13} /> A calm place to make good things happen.
        </div>
      </div>
    </main>
  )
}
