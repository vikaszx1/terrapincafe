import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'

export default function AboutEditor({ onSave }) {
  const { about, setAbout } = useSiteData()
  const [form, setForm] = useState({ ...about })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    setAbout(form)
    onSave()
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card__title">About Image</div>
        <div className="about-editor">
          {form.image && (
            <img
              src={form.image}
              alt="About preview"
              className="about-editor__preview"
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
          <div className="form-field">
            <label>Image URL or path</label>
            <input
              value={form.image || ''}
              onChange={e => set('image', e.target.value)}
              placeholder="https://... or /images/about_us_img.jpg"
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__title">About Text</div>

        <div className="form-row form-row--full" style={{ marginBottom: '1rem' }}>
          <div className="form-field">
            <label>Paragraph 1</label>
            <textarea
              value={form.para1}
              onChange={e => set('para1', e.target.value)}
              style={{ minHeight: 100 }}
            />
          </div>
        </div>
        <div className="form-row form-row--full" style={{ marginBottom: '1rem' }}>
          <div className="form-field">
            <label>Paragraph 2</label>
            <textarea
              value={form.para2}
              onChange={e => set('para2', e.target.value)}
              style={{ minHeight: 100 }}
            />
          </div>
        </div>
        <div className="form-row form-row--full" style={{ marginBottom: '1rem' }}>
          <div className="form-field">
            <label>Paragraph 3</label>
            <textarea
              value={form.para3}
              onChange={e => set('para3', e.target.value)}
              style={{ minHeight: 100 }}
            />
          </div>
        </div>
      </div>

      <button className="btn btn--primary" onClick={handleSave}>Save About Section</button>
    </div>
  )
}
