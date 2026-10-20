import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Topbar from './components/Topbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import BoardDetail from './pages/BoardDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BoardWorkspace from './pages/BoardWorkspace.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { isConfigured } from './lib/supabase.js'
import { Notice } from './components/Notice.jsx'
import Modal from './components/Modal.jsx'
import { createBoard } from './lib/data.js'

export default function App() {
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('')
  const create = async e => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const { data, error: err } = await createBoard({ title: form.get('title'), description: form.get('description') });
    if (err) setError(err.message);
    else {
      setShowCreate(false);
      window.location.href = `/workspace/${data.id}`
    }
  }
  return <>
    <Topbar onCreate={() => setShowCreate(true)} />
    {!isConfigured && <div className="setup-banner">
      <span><b>Almost there:</b> connect Supabase in <code>.env</code> to turn on live accounts and boards.</span>
      <a href="/README.md" target="_blank">Setup guide</a>
      </div>}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boards" element={<Catalog />} />
      <Route path="/boards/:boardId" element={<BoardDetail />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/dashboard" element={<ProtectedRoute>
        <Dashboard onCreate={() => setShowCreate(true)} /></ProtectedRoute>} />
      <Route path="/workspace/:boardId" element={<ProtectedRoute><BoardWorkspace /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {showCreate && <Modal title="Create a board" onClose={() => setShowCreate(false)}>
      <form className="form-stack" onSubmit={create}>
      <label>Board name<input name="title" required minLength="2" maxLength="60" placeholder="e.g. Product launch" /></label>
      <label>Description<textarea name="description" maxLength="240" placeholder="What are you working on?" /></label>
      {error && <Notice>{error}</Notice>}
      <button className="button button-primary button-full">Create board <span>→</span></button>
      </form>
      </Modal>}
  </>
}
