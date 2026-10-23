import { useState } from 'react'
import { ArrowLeft, ArrowRight, Layers2, Sparkles } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isConfigured } from '../lib/supabase.js'
import { Notice } from '../components/Notice.jsx'

export default function AuthPage({ mode }) {
  const registering = mode === 'register',
    { user, signIn, signUp, resetPassword } = useAuth(),
    navigate = useNavigate()
  const [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [forgotPassword, setForgotPassword] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!isConfigured) {
      setError('Connect Supabase first. See the setup guide in README.md.')
      return
    }
    setBusy(true)
    const f = new FormData(e.currentTarget)
    const res = registering
      ? await signUp(f.get('email'), f.get('password'), f.get('name'))
      : await signIn(f.get('email'), f.get('password'))
    setBusy(false)

    if (res.error) setError(res.error.message)
    else if (registering && !res.data.session)
      setMessage('Check your email to confirm your account, then come back to sign in.')
    else navigate('/dashboard')
  }
  const sendResetLink = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!isConfigured) {
      setError('Connect Supabase first. See the setup guide in README.md.')
      return
    }
    const email = new FormData(e.currentTarget).get('email').trim()
    setBusy(true)
    const res = await resetPassword(email, `${window.location.origin}/reset-password`)
    setBusy(false)
    if (res.error) setError(res.error.message)
    else
      setMessage(
        'If an account exists for that email, a password reset link has been sent. Check your inbox.'
      )
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
        <div className="page-eyebrow">
          {forgotPassword
            ? 'ACCOUNT RECOVERY'
            : registering
              ? 'MAKE A LITTLE SPACE'
              : 'WELCOME BACK'}
        </div>
        <h1>
          {forgotPassword
            ? 'Reset your password.'
            : registering
              ? 'Let’s get started.'
              : 'Good to see you.'}
        </h1>
        <p>
          {forgotPassword
            ? 'Enter your account email and we’ll send you a secure reset link.'
            : registering
              ? 'Your next project deserves a nice place to land.'
              : 'Your projects missed you. Pick up where you left off.'}
        </p>
        {forgotPassword ? (
          <form className="form-stack auth-form" onSubmit={sendResetLink}>
            <label>
              Email address
              <input
                type="email"
                name="email"
                required
                maxLength="254"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            {error && <Notice>{error}</Notice>}
            {message && <Notice kind="success">{message}</Notice>}
            <button className="button button-primary button-full" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
              <ArrowRight size={16} />
            </button>
            <button
              className="auth-text-button"
              type="button"
              onClick={() => {
                setForgotPassword(false)
                setError('')
                setMessage('')
              }}
            >
              Back to log in
            </button>
          </form>
        ) : (
          <form className="form-stack auth-form" onSubmit={submit}>
            {registering && (
              <label>
                Your name
                <input
                  name="name"
                  required
                  minLength="2"
                  maxLength="60"
                  placeholder="How should we call you?"
                  autoComplete="name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                name="email"
                required
                maxLength="254"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                required
                minLength="6"
                maxLength="72"
                placeholder={registering ? 'At least 6 characters' : 'Your password'}
                autoComplete={registering ? 'new-password' : 'current-password'}
              />
            </label>
            {!registering && (
              <button
                className="auth-text-button auth-forgot-link"
                type="button"
                onClick={() => {
                  setForgotPassword(true)
                  setError('')
                  setMessage('')
                }}
              >
                Forgot password?
              </button>
            )}
            {error && <Notice>{error}</Notice>}
            {message && <Notice kind="success">{message}</Notice>}
            <button className="button button-primary button-full" disabled={busy}>
              {busy ? 'One moment…' : registering ? 'Create your account' : 'Log in'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
        {!forgotPassword && (
          <div className="auth-switch">
            {registering ? 'Already have an account?' : 'New around here?'}
            <Link to={registering ? '/login' : '/register'}>
              {registering ? 'Log in' : 'Create an account'}
            </Link>
          </div>
        )}
        <div className="auth-foot">
          <Sparkles size={13} /> A calm place to make good things happen.
        </div>
      </div>
    </main>
  )
}
