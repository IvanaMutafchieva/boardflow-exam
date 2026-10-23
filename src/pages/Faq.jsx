import { ArrowUpRight, CircleHelp } from 'lucide-react'
import { Link } from 'react-router-dom'

const questions = [
  [
    'Can I browse without an account?',
    'Without an account, you can only view the home page, public board catalog, and board details. Sign in is required to use a workspace.',
  ],
  [
    'How do I create a board?',
    'Create an account or sign in, open My workspace, then choose New board. Your board is saved to the connected Supabase database.',
  ],
  [
    'Can I edit or delete any task?',
    'You can edit or delete tasks you authored. Board editing and deletion are limited to the board owner. Database policies enforce these permissions.',
  ],
  [
    'Where is my project data stored?',
    'Boardflow uses the Supabase project configured for the app. Boards and tasks persist there between visits.',
  ],
  [
    'Why can’t I see boards in the catalog?',
    'The catalog can be empty until someone creates a board. It also needs the app’s Supabase URL and public key configured correctly.',
  ],
  [
    'Does the contact page send a message?',
    'No. This exam-project version shows where to direct questions, but it does not have a message-sending service connected.',
  ],
]

export default function Faq() {
  return (
    <main className="page-shell info-page faq-page">
      <div className="faq-heading">
        <span className="value-icon icon-lilac">
          <CircleHelp size={20} />
        </span>
        <div>
          <div className="page-eyebrow">A FEW QUICK ANSWERS</div>
          <h1>
            Frequently asked questions<span className="brand-dot">.</span>
          </h1>
        </div>
      </div>
      <div className="faq-list">
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span>+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <div className="faq-contact">
        <span>Still curious?</span>
        <Link to="/help">
          Ask us a question <ArrowUpRight size={14} />
        </Link>
      </div>
    </main>
  )
}
