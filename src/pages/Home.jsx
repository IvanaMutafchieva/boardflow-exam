import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleHelp,
  Clock3,
  Command,
  Layers2,
  MessageCircle,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const preview = [
  {
    name: 'To do',
    color: 'coral',
    cards: [
      {
        tag: 'DESIGN',
        title: 'Map the onboarding flow',
        avatars: 'AL',
        due: 'Today',
      },
      {
        tag: 'RESEARCH',
        title: 'Review interview notes',
        avatars: 'MK',
      },
      {
        tag: 'CONTENT',
        title: 'Write welcome email',
        avatars: 'JS',
      },
    ],
  },
  {
    name: 'In progress',
    color: 'violet',
    cards: [
      {
        tag: 'PRODUCT',
        title: 'Build the first-run checklist',
        avatars: 'AL · MK',
        due: 'Oct 24',
      },
      {
        tag: 'DESIGN',
        title: 'Polish mobile layouts',
        avatars: 'MK',
      },
    ],
  },
  {
    name: 'Done',
    color: 'green',
    cards: [
      {
        tag: 'KICKOFF',
        title: 'Align on launch goals',
        avatars: 'AL · JS',
        done: true,
      },
      {
        tag: 'RESEARCH',
        title: 'Define our first audience',
        avatars: 'MK',
        done: true,
      },
    ],
  },
]
function PreviewBoard() {
  return (
    <div className="preview-window">
      <div className="preview-bar">
        <span className="traffic">
          <i />
          <i />
          <i />
        </span>
        <span className="preview-url">boardflow.app / workspace</span>
        <span className="preview-menu">•••</span>
      </div>
      <div className="preview-board-head">
        <div>
          <small>TEAM WORKSPACE</small>
          <h3>
            Product launch <span>✦</span>
          </h3>
        </div>
        <div className="avatar-stack">
          <i>AL</i>
          <i>MK</i>
          <i>JS</i>
          <b>+2</b>
        </div>
      </div>
      <div className="preview-columns">
        {preview.map((col) => (
          <div className="preview-column" key={col.name}>
            <div className="preview-column-title">
              <span className={`status-dot ${col.color}`} />
              {col.name}
              <b>{col.cards.length}</b>
            </div>
            {col.cards.map((card) => (
              <div className="preview-card" key={card.title}>
                <small className={`tag tag-${card.tag.toLowerCase()}`}>{card.tag}</small>
                <p>{card.title}</p>
                <footer>
                  <span className="mini-avatar">{card.avatars}</span>
                  {card.due && (
                    <small>
                      <Clock3 size={11} /> {card.due}
                    </small>
                  )}
                  {card.done && <Check size={14} className="check-green" />}
                </footer>
              </div>
            ))}
            <div className="add-card">＋ Add a task</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default function Home() {
  const { user } = useAuth()
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-sparkle">
              <Sparkles size={13} />
            </span>
            A little more flow, a lot less chaos
          </div>
          <h1>
            Make space for
            <br />
            <span>great work.</span>
          </h1>
          <p className="hero-text">
            The friendly project board that helps your team turn big ideas into small, satisfying
            checkmarks.
          </p>
          <div className="hero-actions">
            <Link
              className="button button-primary button-large"
              to={user ? '/dashboard' : '/register'}
            >
              {user ? 'Go to your workspace' : 'Start your first board'}
              <ArrowRight size={17} />
            </Link>
            <Link className="button button-quiet button-large" to="/boards">
              Explore public boards
            </Link>
          </div>
          <div className="hero-note">
            <span className="tiny-avatars">
              <i>A</i>
              <i>M</i>
              <i>J</i>
            </span>
            <span>Made for teams that care about the details</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <span className="floating-note note-top">
            <span>✦</span> Nice work, team!
          </span>
          <PreviewBoard />
          <span className="floating-note note-bottom">
            <span className="note-check">
              <Check size={13} />
            </span>{' '}
            3 tasks done today
          </span>
          <span className="sparkle-decoration sparkle-one">✳</span>
          <span className="sparkle-decoration sparkle-two">✦</span>
        </div>
      </section>
      <section className="value-strip">
        <div>
          <span className="value-icon icon-lilac">
            <Layers2 size={18} />
          </span>
          <strong>Everything in one place</strong>
          <span>Projects, tasks, and the little details</span>
        </div>
        <div>
          <span className="value-icon icon-peach">
            <Zap size={18} />
          </span>
          <strong>Easy to pick up</strong>
          <span>Clear next steps, no learning curve</span>
        </div>
        <div>
          <span className="value-icon icon-mint">
            <MessageCircle size={18} />
          </span>
          <strong>Made for teamwork</strong>
          <span>Keep everyone happily in the loop</span>
        </div>
      </section>
      <section className="bottom-cta">
        <div>
          <div className="eyebrow">GOOD THINGS START SMALL</div>
          <h2>
            Your next favorite workspace
            <br />
            is one click away.
          </h2>
        </div>
        <Link className="button button-dark button-large" to={user ? '/dashboard' : '/register'}>
          Let's make it happen
          <ArrowUpRight size={16} />
        </Link>
        <span className="cta-flower">✳</span>
      </section>
    </main>
  )
}
