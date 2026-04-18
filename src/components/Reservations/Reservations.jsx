import { useState, useMemo } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import './Reservations.scss'

// ── Helpers ───────────────────────────────────────────────────────────────────
function toDateStr(date) { return date.toISOString().split('T')[0] }

function addDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d
}

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function fmtDate(str) {
  return parseLocalDate(str).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

// ── Step indicators ───────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Date & Party', 'Choose Time', 'Your Details', 'Confirmed']
  return (
    <div className="res-steps">
      {steps.map((label, i) => (
        <div key={i} className={`res-steps__step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
          <div className="res-steps__dot">{i < current ? '✓' : i + 1}</div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Date + Party ──────────────────────────────────────────────────────
function StepDateParty({ resConfig, onNext }) {
  const today   = toDateStr(new Date())
  const maxDate = toDateStr(addDays(new Date(), resConfig.advanceBookingDays))
  const [date, setDate]           = useState('')
  const [partySize, setPartySize] = useState(2)
  const [error, setError]         = useState('')

  const dayOfWeek = date ? parseLocalDate(date).getDay() : null
  const isClosed  = dayOfWeek !== null && resConfig.closedDays.includes(dayOfWeek)

  function handleNext() {
    if (!date) { setError('Please select a date.'); return }
    if (isClosed) { setError('We are closed on that day. Please choose another date.'); return }
    if (partySize > resConfig.maxPartySize) {
      setError(`For parties over ${resConfig.maxPartySize}, please call us at (707) 875-2700.`); return
    }
    setError('')
    onNext(date, partySize)
  }

  return (
    <div className="res-step-panel">
      <div className="res-form-grid">
        <div className="form-group">
          <label htmlFor="r-date">Date</label>
          <input
            type="date"
            id="r-date"
            min={today}
            max={maxDate}
            value={date}
            onChange={e => { setDate(e.target.value); setError('') }}
            className={isClosed || (error && !date) ? 'form-group__input--error' : ''}
          />
          {isClosed && (
            <span className="form-group__error">We're closed that day — please pick another date.</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="r-party">Party Size</label>
          <select id="r-party" value={partySize} onChange={e => setPartySize(+e.target.value)}>
            {Array.from({ length: resConfig.maxPartySize + 1 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
            <option value={resConfig.maxPartySize + 1}>{resConfig.maxPartySize + 1}+ Guests</option>
          </select>
        </div>
      </div>

      {error && <p className="res-error">{error}</p>}

      <button className="reservations__submit" onClick={handleNext} disabled={isClosed}>
        See Available Times →
      </button>
    </div>
  )
}

// ── Step 2: Slot Selection ────────────────────────────────────────────────────
function StepSlot({ date, partySize, resConfig, bookedSeats, onNext, onBack }) {
  const [selected, setSelected] = useState(null)

  const slots = useMemo(() => resConfig.slots.map(slot => {
    const taken     = bookedSeats(date, slot)
    const available = resConfig.maxSeatsPerSlot - taken
    const fits      = available >= partySize
    return { slot, available, fits }
  }), [date, partySize, resConfig, bookedSeats])

  function slotClass({ fits, available }) {
    if (!fits) return 'res-slot res-slot--full'
    if (available <= 4) return 'res-slot res-slot--few'
    return 'res-slot'
  }

  function slotLabel({ fits, available }) {
    if (!fits) return 'Full'
    if (available <= 4) return `${available} left`
    return 'Available'
  }

  return (
    <div className="res-step-panel">
      <p className="res-step-panel__hint">
        Showing times for <strong>{fmtDate(date)}</strong> · {partySize} {partySize === 1 ? 'guest' : 'guests'}
      </p>

      <div className="res-slots-grid">
        {slots.map(s => (
          <button
            key={s.slot}
            disabled={!s.fits}
            onClick={() => setSelected(s.slot)}
            className={`${slotClass(s)} ${selected === s.slot ? 'res-slot--selected' : ''}`}
          >
            <span className="res-slot__time">{s.slot}</span>
            <span className="res-slot__avail">{slotLabel(s)}</span>
          </button>
        ))}
      </div>

      <div className="res-nav">
        <button className="reservations__reset" onClick={onBack}>← Back</button>
        <button
          className="reservations__submit"
          disabled={!selected}
          onClick={() => onNext(selected)}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Guest Details ─────────────────────────────────────────────────────
function StepDetails({ date, slot, partySize, onNext, onBack }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', requests: '' })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext(form)
  }

  return (
    <div className="res-step-panel">
      <p className="res-step-panel__hint">
        <strong>{fmtDate(date)}</strong> at <strong>{slot}</strong> · {partySize} {partySize === 1 ? 'guest' : 'guests'}
      </p>

      <div className="res-form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            value={form.name}
            onChange={e => { set('name', e.target.value); setErrors(ev => ({ ...ev, name: '' })) }}
            placeholder="Jane Smith"
            className={errors.name ? 'form-group__input--error' : ''}
          />
          {errors.name && <span className="form-group__error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => { set('email', e.target.value); setErrors(ev => ({ ...ev, email: '' })) }}
            placeholder="jane@example.com"
            className={errors.email ? 'form-group__input--error' : ''}
          />
          {errors.email && <span className="form-group__error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="(707) 555-0100"
          />
        </div>
        <div className="form-group form-group--full">
          <label>Special Requests (optional)</label>
          <textarea
            value={form.requests}
            onChange={e => set('requests', e.target.value)}
            placeholder="Dietary needs, occasions, seating preferences…"
            rows={3}
          />
        </div>
      </div>

      <div className="res-nav">
        <button className="reservations__reset" onClick={onBack}>← Back</button>
        <button className="reservations__submit" onClick={handleNext}>Confirm Reservation →</button>
      </div>
    </div>
  )
}

// ── Step 4: Success ───────────────────────────────────────────────────────────
function StepSuccess({ booking, onReset }) {
  return (
    <div className="reservations__success">
      <span className="reservations__success-icon">✦</span>
      <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>You're all set!</h3>
      <p>
        <strong>{booking.name}</strong>, your table for{' '}
        <strong>{booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}</strong> is confirmed for{' '}
        <strong>{fmtDate(booking.date)}</strong> at <strong>{booking.slot}</strong>.
      </p>
      {booking.requests && (
        <p className="reservations__success-sub">Special request noted: {booking.requests}</p>
      )}
      <p className="reservations__success-sub">
        A confirmation has been noted. See you soon!
      </p>
      <button className="reservations__reset" onClick={onReset} style={{ marginTop: '1.5rem' }}>
        Make another reservation
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Reservations() {
  const { resConfig, addBooking, bookedSeats } = useSiteData()
  const [step,      setStep]      = useState(0)
  const [booking,   setBooking]   = useState({})
  const [confirmed, setConfirmed] = useState(null)

  function handleDateParty(date, partySize) {
    setBooking(b => ({ ...b, date, partySize }))
    setStep(1)
  }

  function handleSlot(slot) {
    setBooking(b => ({ ...b, slot }))
    setStep(2)
  }

  async function handleDetails(details) {
    const full = { ...booking, ...details }
    const saved = await addBooking(full)
    if (!saved) return // DB error — stay on step 2
    setConfirmed(saved)
    setStep(3)
  }

  function handleReset() {
    setStep(0); setBooking({}); setConfirmed(null)
  }

  return (
    <section id="reserve" className="reservations">
      <div className="reservations__container">
        <p className="reservations__label">Reservations</p>
        <h2 className="reservations__title">
          Secure Your <em>Place at the Table</em>
        </h2>
        <p className="reservations__desc">
          We recommend reserving ahead, especially on weekends. Walk-ins welcome based on availability.
        </p>

        {step < 3 && <Steps current={step} />}

        {step === 0 && (
          <StepDateParty resConfig={resConfig} onNext={handleDateParty} />
        )}
        {step === 1 && (
          <StepSlot
            date={booking.date}
            partySize={booking.partySize}
            resConfig={resConfig}
            bookedSeats={bookedSeats}
            onNext={handleSlot}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepDetails
            date={booking.date}
            slot={booking.slot}
            partySize={booking.partySize}
            onNext={handleDetails}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && confirmed && (
          <StepSuccess booking={confirmed} onReset={handleReset} />
        )}

        <p className="reservations__note">
          For parties of {resConfig.maxPartySize + 1} or more, please call us at{' '}
          <a href="tel:+17078752700">(707) 875-2700</a>
        </p>
      </div>
    </section>
  )
}
