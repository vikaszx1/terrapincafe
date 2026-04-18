import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'

export default function HoursEditor({ onSave }) {
  const { hours, setHours } = useSiteData()
  const [rows, setRows] = useState(hours.map(h => ({ ...h })))

  function update(id, field, value) {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  function handleSave() {
    setHours(rows)
    onSave()
  }

  return (
    <div>
      <div className="hours-editor">
        {rows.map(row => (
          <div className="hours-editor__row" key={row.id}>
            <input
              value={row.days}
              onChange={e => update(row.id, 'days', e.target.value)}
              placeholder="e.g. Tuesday – Friday"
              style={{ fontWeight: 500 }}
            />
            <input
              value={row.time}
              onChange={e => update(row.id, 'time', e.target.value)}
              placeholder="e.g. 5:00 – 9:00 PM"
              disabled={row.closed}
            />
            <label className="closed-toggle">
              <input
                type="checkbox"
                checked={row.closed}
                onChange={e => update(row.id, 'closed', e.target.checked)}
              />
              Closed
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button className="btn btn--primary" onClick={handleSave}>Save Hours</button>
        <button
          className="btn btn--outline btn--sm"
          onClick={() => setRows(r => [...r, { id: crypto.randomUUID(), days: '', time: '', closed: false }])}
        >
          + Add Row
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => {
            if (rows.length <= 1) return
            setRows(r => r.slice(0, -1))
          }}
        >
          Remove Last Row
        </button>
      </div>
    </div>
  )
}
