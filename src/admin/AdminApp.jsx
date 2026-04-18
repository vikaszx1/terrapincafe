import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import Login      from './Login'
import MenuEditor from './sections/MenuEditor'
import HoursEditor from './sections/HoursEditor'
import AboutEditor from './sections/AboutEditor'
import './admin.scss'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null
  return <div className="toast toast--success">✓ {msg}</div>
}

// ── Sidebar Nav ───────────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  const navItems = [
    { to: '/admin/menu',  icon: '🍽', label: 'Menu Items' },
    { to: '/admin/hours', icon: '🕐', label: 'Hours' },
    { to: '/admin/about', icon: '📸', label: 'About Section' },
  ]

  return (
    <aside className="admin__sidebar">
      <div className="admin__brand">
        <h1>Terrapin Creek</h1>
        <span>Admin Panel</span>
      </div>

      <nav className="admin__nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">{icon}</span> {label}
          </NavLink>
        ))}
      </nav>

      <div className="admin__sidebar-footer">
        <a href="#/" target="_blank" rel="noopener noreferrer">↗ View Live Site</a>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <>
      <div className="admin__topbar">
        <h2>{title}</h2>
      </div>
      <div className="admin__content">{children}</div>
    </>
  )
}

// ── Main Admin App ─────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('tc_admin') === '1')
  const [toast, setToast]   = useState('')
  const { resetToDefaults } = useSiteData()
  const navigate            = useNavigate()

  function handleLogin() { setAuthed(true); navigate('/admin/menu') }

  function handleLogout() {
    sessionStorage.removeItem('tc_admin')
    setAuthed(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleReset() {
    if (!confirm('Reset ALL content to factory defaults? This cannot be undone.')) return
    resetToDefaults()
    showToast('Reset to defaults')
  }

  if (!authed) return <Login onLogin={handleLogin} />

  return (
    <div className="admin">
      <Sidebar onLogout={handleLogout} />

      <main className="admin__main">
        <Routes>
          <Route index element={<Navigate to="/admin/menu" replace />} />

          <Route path="menu" element={
            <Section title="Menu Items">
              <div className="admin-card">
                <div className="admin-card__title">Manage Menu Items</div>
                <MenuEditor onSave={() => showToast('Menu saved')} />
              </div>
            </Section>
          } />

          <Route path="hours" element={
            <Section title="Opening Hours">
              <div className="admin-card">
                <div className="admin-card__title">Edit Hours</div>
                <HoursEditor onSave={() => showToast('Hours saved')} />
              </div>
            </Section>
          } />

          <Route path="about" element={
            <Section title="About Section">
              <AboutEditor onSave={() => showToast('About section saved')} />
            </Section>
          } />
        </Routes>

        {/* Danger zone */}
        <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid #e2e8f0', marginTop: '1rem' }}>
          <details style={{ marginTop: '1.5rem' }}>
            <summary style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>Danger Zone</summary>
            <div style={{ marginTop: '0.75rem' }}>
              <button className="btn btn--danger btn--sm" onClick={handleReset}>
                Reset all content to defaults
              </button>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                This will restore the original menu, hours, and about text.
              </p>
            </div>
          </details>
        </div>
      </main>

      <Toast msg={toast} />
    </div>
  )
}
