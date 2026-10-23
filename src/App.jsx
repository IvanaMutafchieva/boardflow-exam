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
import ResetPassword from './pages/ResetPassword.jsx'
import TaskDetail from './pages/TaskDetail.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Help from './pages/Help.jsx'
import Features from './pages/Features.jsx'
import Faq from './pages/Faq.jsx'
import TaskCatalog from './pages/TaskCatalog.jsx'
import PeopleCatalog from './pages/PeopleCatalog.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { isConfigured } from './lib/supabase.js'
import { Notice } from './components/Notice.jsx'
import Modal from './components/Modal.jsx'
import { createBoard } from './lib/data.js'

export default function App() {
  const { user } = useAuth()
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')
  const create = async (e) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    const { data, error: err } = await createBoard({
      title: form.get('title'),
      description: form.get('description'),
      is_public: form.get('is_public') === 'true',
    })

    if (err) setError(err.message)
    else {
      setShowCreate(false)
      window.location.href = `/workspace/${data.id}`
    }
  }
  return (
    <>
      <Topbar onCreate={() => setShowCreate(true)} />
      {!isConfigured && (
        <div className="setup-banner">
          <span>
            <b>Almost there:</b> connect Supabase in <code>.env</code> to turn on live accounts and
            boards.
          </span>
          <a href="/README.md" target="_blank">
            Setup guide
          </a>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<Catalog />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskCatalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/people"
          element={
            <ProtectedRoute>
              <PeopleCatalog />
            </ProtectedRoute>
          }
        />
        <Route path="/boards/:boardId" element={<BoardDetail />} />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:profileId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onCreate={() => setShowCreate(true)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:boardId"
          element={
            <ProtectedRoute>
              <BoardWorkspace />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
      {showCreate && (
        <Modal title="Create a board" onClose={() => setShowCreate(false)}>
          <form className="form-stack" onSubmit={create}>
            <label>
              Board name
              <input
                name="title"
                required
                minLength="2"
                maxLength="60"
                placeholder="e.g. Product launch"
              />
            </label>
            <label>
              Description
              <textarea name="description" maxLength="240" placeholder="What are you working on?" />
            </label>
            <label>
              Who can see this board?
              <select name="is_public" defaultValue="true">
                <option value="true">Public — anyone can view</option>
                <option value="false">Private — only you can view</option>
              </select>
            </label>
            {error && <Notice>{error}</Notice>}
            <button className="button button-primary button-full">
              Create board <span>→</span>
            </button>
          </form>
        </Modal>
      )}
    </>
  )
}
