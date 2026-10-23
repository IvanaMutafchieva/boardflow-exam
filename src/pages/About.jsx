import { ArrowRight, Heart, Layers2, Sparkles, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="page-shell info-page">
      <div className="info-hero">
        <div className="page-eyebrow">A LITTLE ABOUT US</div>
        <h1>
          Good work deserves
          <br />
          <span>a good place.</span>
        </h1>
        <p>
          Boardflow is a friendly project planning space built to make teamwork feel clear, calm,
          and a little more human.
        </p>
        <span className="info-hero-sparkle">
          <Sparkles size={25} />
        </span>
      </div>
      <section className="info-story">
        <div className="page-eyebrow">WHY BOARDFLOW</div>
        <h2>Less chasing. More making.</h2>
        <p>
          Projects can get complicated quickly. Boardflow keeps the next step visible with a simple
          board, clear task statuses, and a shared place for the details. It is designed for
          students, small teams, and anyone who wants to move an idea forward without a heavyweight
          process.
        </p>
        <p>
          This project was created as a React regular exam project. It brings together client-side
          routing, Supabase authentication and data storage, reusable components, and responsive
          styling.
        </p>
      </section>
      <div className="about-values">
        <article>
          <span className="value-icon icon-lilac">
            <Layers2 size={19} />
          </span>
          <h3>Clarity first</h3>
          <p>See what is coming up, what is in progress, and what is already done.</p>
        </article>
        <article>
          <span className="value-icon icon-peach">
            <Heart size={19} />
          </span>
          <h3>Keep it human</h3>
          <p>Small, understandable steps help a team make steady progress.</p>
        </article>
        <article>
          <span className="value-icon icon-mint">
            <UsersRound size={19} />
          </span>
          <h3>Work together</h3>
          <p>Projects and tasks have a shared home that is easy to revisit.</p>
        </article>
      </div>
      <div className="info-cta">
        <div>
          <h2>Ready to make a little progress?</h2>
          <p>Start a board for your next idea.</p>
        </div>
        <Link className="button button-primary" to="/register">
          Get started <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
