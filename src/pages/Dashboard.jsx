import { useEffect, useState } from 'react'
import { ArrowUpRight, Layers2, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { listBoards } from '../lib/data.js'
import { Notice, Loading } from '../components/Notice.jsx'

export default function Dashboard({ onCreate }) {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')

  useEffect(() => {
    let active = true; listBoards(
      { mine: true, userId: user.id }).then(({ data, error }) => {
        if (!active)
          return;
        if (error) setError(error.message);
        else setBoards(data || []);
        setLoading(false)
      });
    return () => { active = false }
  }, [user.id])

  return <main className="page-shell dashboard-page">
    <div className="dashboard-welcome"><div>
      <div className="page-eyebrow">YOUR LITTLE CORNER OF THE INTERNET</div>
      <h1>Good to have you,<br /><span>{user.user_metadata?.full_name?.split(' ')[0] || 'friend'}.</span></h1>
      <p>Ready to make a bit of progress?</p>
    </div
    ><div className="welcome-stamp">
        <Sparkles size={22} />
        <span>One thing<br />at a time.</span></div>
    </div>
    <div className="section-heading"><div>
      <h2>Your boards <span>{boards.length}</span></h2>
      <p>Everything you're moving forward, all in one spot.</p>
    </div>
      <button className="button button-primary" onClick={onCreate}>
        <Plus size={17} /> New board</button></div>
    {loading ? <Loading /> : error ?
      <Notice>{error}</Notice> : boards.length ?
        <div className="catalog-grid dashboard-grid">{boards.map((b, i) =>
          <Link className="catalog-card" to={`/workspace/${b.id}`} key={b.id}>
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
                <span>YOUR BOARD</span>
                <ArrowUpRight size={15} />
              </div>
              <h2>{b.title}</h2>
              <p>{b.description || 'A space to get things moving.'}</p>
              <div className="catalog-owner">Created {new Date(b.created_at).toLocaleDateString()}</div>
            </div>
          </Link>)}
        </div> : <div className="empty-state dashboard-empty">
          <span className="empty-icon">
            <Layers2 size={23} /></span>
          <h2>Start with a blank board</h2>
          <p>Give your next project a little room to grow.</p>
          <button className="button button-primary" onClick={onCreate}>
            <Plus size={16} /> Create your first board</button>
        </div>}
    <div className="dashboard-tip">
      <span>✦</span>
      <p><b>A small tip</b> — Boards are easiest to keep up with when the next step is always visible.</p>
    </div>
  </main>
}
