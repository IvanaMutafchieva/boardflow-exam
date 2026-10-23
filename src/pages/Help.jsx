import { useState } from 'react'
import { ArrowLeft, ArrowRight, CircleHelp, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Notice } from '../components/Notice.jsx'
import { submitHelpQuestion } from '../lib/data.js'

const emptyForm = { name: '', email: '', question: '' }

export default function Help() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setBusy(true)
    const result = await submitHelpQuestion(form)
    setBusy(false)
    if (result.error) setError(result.error.message)
    else {
      setForm(emptyForm)
      setSuccess(true)
    }
  }

  return (
    <main className="page-shell info-page help-page">
      <Link className="back-link" to="/contact">
        <ArrowLeft size={15} /> Back to Contact
      </Link>
      <section className="help-layout">
        <div className="help-intro">
          <span className="value-icon icon-lilac">
            <CircleHelp size={21} />
          </span>
          <div className="page-eyebrow">BOARDFLOW HELP</div>
          <h1>
            What can we help with<span className="brand-dot">?</span>
          </h1>
          <p>
            Send a question about your account, boards, or tasks. Your name, email, and question are
            saved in this project’s Supabase database for the project owner to review. This demo
            does not send email replies automatically.
          </p>
          <div className="help-note">
            <b>A quick note</b>
            <span>
              Please don’t include passwords or private account credentials in your message.
            </span>
          </div>
          <Link className="help-faq-link" to="/faq">
            You can also browse common questions <ArrowRight size={14} />
          </Link>
        </div>
        <form className="help-form-card form-stack" onSubmit={submit}>
          <h2>Ask a question</h2>
          <p>All fields are required so we can understand and respond to your question.</p>
          <label>
            Your name
            <input
              name="name"
              value={form.name}
              onChange={update}
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Your name"
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Your question
            <textarea
              name="question"
              value={form.question}
              onChange={update}
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder="Tell us what you need help with…"
            />
          </label>
          {error && <Notice>{error}</Notice>}
          {success && (
            <Notice kind="success">Your question was sent. Thanks for reaching out!</Notice>
          )}
          <button className="button button-primary button-full" disabled={busy}>
            {busy ? 'Sending…' : 'Send question'} <Send size={15} />
          </button>
        </form>
      </section>
    </main>
  )
}
