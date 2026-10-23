import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Search,
    tone: 'icon-lilac',
    title: 'Find public boards',
    text: 'Browse the public catalog and open a board page before signing in.',
  },
  {
    icon: CheckCircle2,
    tone: 'icon-mint',
    title: 'Move tasks forward',
    text: 'Organize work across To do, In progress, and Done.',
  },
  {
    icon: LockKeyhole,
    tone: 'icon-peach',
    title: 'Keep a personal workspace',
    text: 'Sign in to create boards and manage your projects.',
  },
  {
    icon: ShieldCheck,
    tone: 'icon-lilac',
    title: 'Edit your own work',
    text: 'Board owners manage their boards; task authors manage their tasks.',
  },
  {
    icon: UsersRound,
    tone: 'icon-mint',
    title: 'See member profiles',
    text: 'Open a member profile to view their shared boards.',
  },
  {
    icon: Sparkles,
    tone: 'icon-peach',
    title: 'Stay focused',
    text: 'A simple interface puts the next useful action in reach.',
  },
]

export default function Features() {
  return (
    <main className="page-shell info-page features-page">
      <div className="page-eyebrow">THE USEFUL LITTLE THINGS</div>
      <h1>
        Made for momentum<span className="brand-dot">.</span>
      </h1>
      <p className="info-intro">
        A simple set of tools to help projects feel easier to start and easier to finish.
      </p>
      <div className="features-grid">
        {features.map(({ icon: Icon, tone, title, text }) => (
          <article className="feature-card" key={title}>
            <span className={`value-icon ${tone}`}>
              <Icon size={19} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="info-cta">
        <div>
          <h2>See it in action</h2>
          <p>Browse a board or create a workspace of your own.</p>
        </div>
        <Link className="button button-primary" to="/boards">
          Explore boards <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
