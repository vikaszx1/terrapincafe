import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { ConfirmProvider, useConfirm } from './components/ConfirmDialog'
import Login                from './Login'
import MenuEditor           from './sections/MenuEditor'
import HoursEditor          from './sections/HoursEditor'
import AboutEditor          from './sections/AboutEditor'
import TagsEditor           from './sections/TagsEditor'
import ReservationsEditor   from './sections/ReservationsEditor'
import './admin.scss'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null
  return <div className="toast toast--success">✓ {msg}</div>
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const navItems = [
  { to: '/admin/menu',         icon: '🍽', label: 'Menu Items'    },
  { to: '/admin/hours',        icon: '🕐', label: 'Hours'         },
  { to: '/admin/about',        icon: '📸', label: 'About Section' },
  { to: '/admin/tags',         icon: '🏷', label: 'Dietary Tags'  },
  { to: '/admin/reservations', icon: '📅', label: 'Reservations'  },
]

function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="admin__overlay" onClick={onClose} />}

      <aside className={`admin__sidebar ${open ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__brand">
          <h1>Terrapin Creek</h1>
          <span>Admin Panel</span>
        </div>

        <nav className="admin__nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={onClose}
            >
              <span className="nav-icon">{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <a href="#/" target="_blank" rel="noopener noreferrer">↗ View Live Site</a>
          <button
            onClick={() => { onLogout(); onClose() }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, onMenuOpen, children }) {
  return (
    <>
      <div className="admin__topbar">
        <button className="admin__hamburger" onClick={onMenuOpen} aria-label="Open menu">
          <span /><span /><span />
        </button>
        <h2>{title}</h2>
        <span />
      </div>
      <div className="admin__content">{children}</div>
    </>
  )
}

// ── Main Admin App ─────────────────────────────────────────────────────────────
function AdminInner() {
  const [authed,      setAuthed]      = useState(() => sessionStorage.getItem('tc_admin') === '1')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast,       setToast]       = useState('')
  const { resetToDefaults }           = useSiteData()
  const navigate                      = useNavigate()
  const confirm                       = useConfirm()

  function handleLogin()  { setAuthed(true); navigate('/admin/menu') }
  function handleLogout() { sessionStorage.removeItem('tc_admin'); setAuthed(false) }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function handleReset() {
    const ok = await confirm(
      'Reset ALL content to factory defaults? This cannot be undone.',
      { title: 'Reset to Defaults', danger: true }
    )
    if (!ok) return
    resetToDefaults()
    showToast('Reset to defaults')
  }

  if (!authed) return <Login onLogin={handleLogin} />

  const sectionProps = { onMenuOpen: () => setSidebarOpen(true) }

  return (
    <div className="admin">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="admin__main">
        <Routes>
          <Route index element={<Navigate to="/admin/menu" replace />} />

          <Route path="menu" element={
            <Section title="Menu Items" {...sectionProps}>
              <div className="admin-card">
                <div className="admin-card__title">Manage Menu Items</div>
                <MenuEditor onSave={() => showToast('Menu saved')} />
              </div>
            </Section>
          } />

          <Route path="hours" element={
            <Section title="Opening Hours" {...sectionProps}>
              <div className="admin-card">
                <div className="admin-card__title">Edit Hours</div>
                <HoursEditor onSave={() => showToast('Hours saved')} />
              </div>
            </Section>
          } />

          <Route path="about" element={
            <Section title="About Section" {...sectionProps}>
              <AboutEditor onSave={() => showToast('About section saved')} />
            </Section>
          } />

          <Route path="tags" element={
            <Section title="Dietary Tags" {...sectionProps}>
              <div className="admin-card">
                <div className="admin-card__title">Manage Dietary Tags</div>
                <TagsEditor onSave={() => showToast('Tags saved')} />
              </div>
            </Section>
          } />

          <Route path="reservations" element={
            <Section title="Reservations" {...sectionProps}>
              <div className="admin-card">
                <div className="admin-card__title">Manage Reservations</div>
                <ReservationsEditor onSave={() => showToast('Settings saved')} />
              </div>
            </Section>
          } />
        </Routes>

        {/* Danger zone */}
        <div style={{ padding: '0 2rem 2rem' }}>
          <details>
            <summary style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>Danger Zone</summary>
            <div style={{ marginTop: '0.75rem' }}>
              <button className="btn btn--danger btn--sm" onClick={handleReset}>
                Reset all content to defaults
              </button>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                Restores original menu, hours, about text, and tags.
              </p>
            </div>
          </details>
        </div>
      </main>

      <Toast msg={toast} />
    </div>
  )
}

export default function AdminApp() {
  return (
    <ConfirmProvider>
      <AdminInner />
    </ConfirmProvider>
  )
}
