import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Layers2, LogOut, Menu, Plus, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ onCreate }) {
  const { user, signOut } = useAuth(); const navigate = useNavigate()
  const logout = async () => { await signOut(); navigate('/') }
  return <header className="topbar">
    <Link to="/" className="brand">
      <span className="brand-mark">
        <Layers2 size={19} />
      </span><span>boardflow<span className="brand-dot">.</span></span></Link>

    <nav className="main-nav">
      <NavLink to="/boards">Explore</NavLink>{user && <NavLink to="/dashboard">My workspace</NavLink>}</nav>

    <div className="top-actions"><button className="search-shortcut" onClick={() => navigate('/boards')}>
      <Search size={15} /> <span>Find a board</span><kbd>⌘ K</kbd></button>
      {user ? <><button className="button button-primary button-small" onClick={onCreate}><Plus size={16} /> New board</button>
        <button className="avatar" title={user.email}>{(user.user_metadata?.full_name || user.email || 'U').slice(0, 1).toUpperCase()}</button>
        <button className="icon-button" aria-label="Log out" onClick={logout}><LogOut size={17} /></button></> : <>
        <Link className="login-link" to="/login">Log in</Link>
        <Link className="button button-primary button-small" to="/register">Get started <ArrowUpRight size={15} /></Link></>}
      <button className="mobile-menu icon-button" aria-label="Open menu"><Menu size={19} /></button>
    </div>
  </header>
}
