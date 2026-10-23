import { ArrowUpRight, Bug, Compass, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <main className="page-shell info-page contact-page">
      <div className="page-eyebrow">WE’RE EASY TO FIND</div>
      <h1>
        Let’s stay in touch<span className="brand-dot">.</span>
      </h1>
      <p className="info-intro">
        Have a question, spotted a bug, or want to share feedback? Here are a few ways to get help
        with Boardflow.
      </p>
      <div className="contact-grid">
        <article>
          <span className="value-icon icon-lilac">
            <Compass size={19} />
          </span>
          <div className="page-eyebrow">GETTING STARTED</div>
          <h2>Need a hand?</h2>
          <p>
            Ask a question about accounts, boards, or tasks. Your message is saved for the project
            owner to review.
          </p>
          <Link to="/help" className="text-link">
            Ask a question <ArrowUpRight size={14} />
          </Link>
        </article>
        <article>
          <span className="value-icon icon-peach">
            <Bug size={19} />
          </span>
          <div className="page-eyebrow">BUG REPORTS</div>
          <h2>Found something odd?</h2>
          <p>
            Note what you were doing, what you expected, and what happened. Share those details with
            the project author.
          </p>
          <Link to="/faq" className="text-link">
            Read common questions <ArrowUpRight size={14} />
          </Link>
        </article>
        <article>
          <span className="value-icon icon-mint">
            <MessageCircle size={19} />
          </span>
          <div className="page-eyebrow">IDEAS & FEEDBACK</div>
          <h2>Tell us what you think</h2>
          <p>
            Feedback about the board layout, task flow, or accessibility is always useful for
            improving the project.
          </p>
          <Link to="/features" className="text-link">
            See what Boardflow does <ArrowUpRight size={14} />
          </Link>
        </article>
      </div>
      <div className="contact-note">
        This demo does not send messages from this page. It keeps contact details honest until a
        real support inbox is configured.
      </div>
    </main>
  )
}
