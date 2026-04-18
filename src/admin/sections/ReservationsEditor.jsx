import { useState } from 'react'
import { useSiteData, DEFAULT_RES_CONFIG } from '../../context/SiteDataContext'
import { useConfirm } from '../components/ConfirmDialog'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function statusBadge(status) {
  const base = { padding: '0.2rem 0.55rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }
  return status === 'confirmed'
    ? { ...base, background: '#d1fae5', color: '#065f46' }
    : { ...base, background: '#fee2e2', color: '#991b1b' }
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ onSave }) {
  const { resConfig, setResConfig } = useSiteData()
  const [cfg, setCfg] = useState({ ...resConfig })
  const [newSlot, setNewSlot] = useState('')

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }))

  function addSlot() {
    const s = newSlot.trim()
    if (!s || cfg.slots.includes(s)) return
    set('slots', [...cfg.slots, s])
    setNewSlot('')
  }

  function removeSlot(slot) {
    set('slots', cfg.slots.filter(s => s !== slot))
  }

  function toggleClosedDay(day) {
    set('closedDays', cfg.closedDays.includes(day)
      ? cfg.closedDays.filter(d => d !== day)
      : [...cfg.closedDays, day])
  }

  function handleSave() {
    setResConfig(cfg)
    onSave()
  }

  function handleReset() {
    const r = { ...DEFAULT_RES_CONFIG }
    setCfg(r)
    setResConfig(r)
    onSave()
  }

  return (
    <div className="res-settings">
      {/* ── Time Slots ── */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-card__title">Time Slots</div>
        <div className="res-settings__slots">
          {cfg.slots.map(slot => (
            <div key={slot} className="res-settings__slot-chip">
              <span>{slot}</span>
              <button onClick={() => removeSlot(slot)} aria-label={`Remove ${slot}`}>✕</button>
            </div>
          ))}
        </div>
        <div className="res-settings__add-slot">
          <input
            value={newSlot}
            onChange={e => setNewSlot(e.target.value)}
            placeholder="e.g. 9:00 PM"
            onKeyDown={e => e.key === 'Enter' && addSlot()}
          />
          <button className="btn btn--outline btn--sm" onClick={addSlot}>Add Slot</button>
        </div>
      </div>

      {/* ── Capacity & Rules ── */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-card__title">Capacity &amp; Rules</div>
        <div className="form-row">
          <div className="form-field">
            <label>Seats per time slot</label>
            <input
              type="number" min={1} max={500}
              value={cfg.maxSeatsPerSlot}
              onChange={e => set('maxSeatsPerSlot', Math.max(1, +e.target.value))}
            />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total covers available per slot</span>
          </div>
          <div className="form-field">
            <label>Max party size (online)</label>
            <input
              type="number" min={1} max={50}
              value={cfg.maxPartySize}
              onChange={e => set('maxPartySize', Math.max(1, +e.target.value))}
            />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Larger parties directed to call</span>
          </div>
        </div>
        <div className="form-row" style={{ marginTop: 0 }}>
          <div className="form-field">
            <label>Advance booking window (days)</label>
            <input
              type="number" min={1} max={365}
              value={cfg.advanceBookingDays}
              onChange={e => set('advanceBookingDays', Math.max(1, +e.target.value))}
            />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>How far ahead guests can book</span>
          </div>
        </div>
      </div>

      {/* ── Closed Days ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card__title">Closed Days</div>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
          Guests cannot book on these days of the week.
        </p>
        <div className="res-settings__closed-days">
          {DAY_NAMES.map((name, idx) => (
            <label key={idx} className={cfg.closedDays.includes(idx) ? 'active' : ''}>
              <input type="checkbox" checked={cfg.closedDays.includes(idx)} onChange={() => toggleClosedDay(idx)} />
              {name}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn--primary" onClick={handleSave}>Save Settings</button>
        <button className="btn btn--outline btn--sm" onClick={handleReset} style={{ alignSelf: 'center' }}>
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

// ── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab() {
  const { bookings, cancelBooking, restoreBooking, resConfig } = useSiteData()
  const confirm = useConfirm()
  const today   = new Date().toISOString().split('T')[0]

  const [filter, setFilter]   = useState('upcoming') // upcoming | past | all
  const [dateFilter, setDate] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = bookings
    .filter(b => {
      if (dateFilter) return b.date === dateFilter
      if (filter === 'upcoming') return b.date >= today
      if (filter === 'past')     return b.date < today
      return true
    })
    .sort((a, b) => a.date === b.date
      ? resConfig.slots.indexOf(a.slot) - resConfig.slots.indexOf(b.slot)
      : a.date > b.date ? (filter === 'past' ? -1 : 1) : (filter === 'past' ? 1 : -1)
    )

  // Stats
  const todayBookings   = bookings.filter(b => b.date === today && b.status === 'confirmed')
  const todayCovers     = todayBookings.reduce((s, b) => s + b.partySize, 0)
  const upcomingCount   = bookings.filter(b => b.date > today && b.status === 'confirmed').length

  async function handleCancel(id) {
    const ok = await confirm('Cancel this reservation? The guest will not be notified automatically.', { title: 'Cancel Reservation', danger: true })
    if (ok) cancelBooking(id)
  }

  async function handleRestore(id) {
    const ok = await confirm('Restore this reservation to confirmed status?', { title: 'Restore Reservation' })
    if (ok) restoreBooking(id)
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="res-stats">
        <div className="res-stats__card">
          <span className="res-stats__num">{todayCovers}</span>
          <span className="res-stats__label">Covers today</span>
        </div>
        <div className="res-stats__card">
          <span className="res-stats__num">{todayBookings.length}</span>
          <span className="res-stats__label">Bookings today</span>
        </div>
        <div className="res-stats__card">
          <span className="res-stats__num">{upcomingCount}</span>
          <span className="res-stats__label">Upcoming</span>
        </div>
        <div className="res-stats__card">
          <span className="res-stats__num">{bookings.length}</span>
          <span className="res-stats__label">Total bookings</span>
        </div>
      </div>

      {/* Filters */}
      <div className="res-filters">
        <div className="res-filters__tabs">
          {['upcoming', 'past', 'all'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => { setFilter(f); setDate('') }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="form-field" style={{ margin: 0 }}>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: 6 }}
            title="Filter by exact date"
          />
        </div>
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1.5rem 0' }}>No bookings found.</p>
      ) : (
        <div className="res-bookings">
          {filtered.map(b => (
            <div key={b.id} className={`res-booking ${b.status === 'cancelled' ? 'res-booking--cancelled' : ''}`}>
              <div className="res-booking__header" onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                <div className="res-booking__left">
                  <span className="res-booking__date">{fmt(b.date)}</span>
                  <span className="res-booking__slot">{b.slot}</span>
                  <span className="res-booking__party">{b.partySize} {b.partySize === 1 ? 'guest' : 'guests'}</span>
                </div>
                <div className="res-booking__right">
                  <span className="res-booking__name">{b.name}</span>
                  <span style={statusBadge(b.status)}>{b.status}</span>
                  <span className="res-booking__toggle">{expanded === b.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === b.id && (
                <div className="res-booking__detail">
                  <div className="res-booking__detail-grid">
                    <span>Email</span>      <span>{b.email}</span>
                    <span>Phone</span>      <span>{b.phone || '—'}</span>
                    <span>Requests</span>   <span>{b.requests || 'None'}</span>
                    <span>Booked on</span>  <span>{new Date(b.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    <span>Booking ID</span> <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{b.id}</span>
                  </div>
                  <div className="res-booking__detail-actions">
                    {b.status === 'confirmed'
                      ? <button className="btn btn--danger btn--sm" onClick={() => handleCancel(b.id)}>Cancel Reservation</button>
                      : <button className="btn btn--outline btn--sm" onClick={() => handleRestore(b.id)}>Restore</button>
                    }
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReservationsEditor({ onSave }) {
  const [tab, setTab] = useState('bookings')

  return (
    <div>
      <div className="menu-editor__tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>Settings</button>
      </div>

      {tab === 'bookings'
        ? <BookingsTab />
        : <SettingsTab onSave={onSave} />
      }
    </div>
  )
}
