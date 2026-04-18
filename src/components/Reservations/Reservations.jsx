import { useState } from 'react'
import './Reservations.scss'

const times = [
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM',
]
const guestOptions = [
  '1 Guest','2 Guests','3 Guests','4 Guests','5 Guests','6+ Guests',
]

export default function Reservations() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate]     = useState('')
  const [time, setTime]     = useState(times[2])
  const [guests, setGuests] = useState(guestOptions[1])
  const [status, setStatus] = useState(null) // null | 'success' | 'error'

  function handleSubmit(e) {
    e.preventDefault()
    if (!date) { setStatus('error'); return }
    setStatus('success')
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

        {status === 'success' ? (
          <div className="reservations__success">
            <span className="reservations__success-icon">✦</span>
            <p>
              Your request for <strong>{guests}</strong> on{' '}
              <strong>{new Date(date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong>{' '}
              at <strong>{time}</strong> has been received.
            </p>
            <p className="reservations__success-sub">
              Our team will confirm your reservation by phone or email within 24 hours.
            </p>
            <button className="reservations__reset" onClick={() => { setStatus(null); setDate('') }}>
              Make another reservation
            </button>
          </div>
        ) : (
          <form className="reservations__form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="r-date">Date</label>
              <input
                type="date"
                id="r-date"
                min={today}
                value={date}
                onChange={e => { setDate(e.target.value); setStatus(null) }}
                className={status === 'error' && !date ? 'form-group__input--error' : ''}
              />
              {status === 'error' && !date && (
                <span className="form-group__error">Please select a date.</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="r-time">Time</label>
              <select id="r-time" value={time} onChange={e => setTime(e.target.value)}>
                {times.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="r-guests">Guests</label>
              <select id="r-guests" value={guests} onChange={e => setGuests(e.target.value)}>
                {guestOptions.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <button type="submit" className="reservations__submit">
              Find a Table
            </button>
          </form>
        )}

        <p className="reservations__note">
          For parties of 7 or more, please call us at{' '}
          <a href="tel:+17078752700">(707) 875-2700</a>
        </p>
      </div>
    </section>
  )
}
