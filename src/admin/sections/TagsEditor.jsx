import { useState } from 'react'
import { useSiteData, DEFAULT_TAGS } from '../../context/SiteDataContext'
import { useConfirm } from '../components/ConfirmDialog'

const BLANK = { id: '', shortLabel: '', fullLabel: '', bg: '#e8f0f4', color: '#2c4a5e' }

function TagRow({ tag, onEdit, onDelete, isDefault }) {
  return (
    <div className="tags-editor__row">
      <span
        className="tags-editor__badge"
        style={{ background: tag.bg, color: tag.color }}
      >
        {tag.shortLabel}
      </span>
      <div className="tags-editor__meta">
        <span className="tags-editor__full">{tag.fullLabel}</span>
        <span className="tags-editor__id">key: <code>{tag.id}</code></span>
      </div>
      <div className="tags-editor__actions">
        <button className="btn btn--outline btn--sm" onClick={() => onEdit(tag)}>Edit</button>
        {!isDefault && (
          <button className="btn btn--danger btn--sm" onClick={() => onDelete(tag.id)}>Delete</button>
        )}
      </div>
    </div>
  )
}

function TagModal({ tag, onSave, onClose, existingIds }) {
  const isNew = !tag.id
  const [form, setForm] = useState({ ...BLANK, ...tag })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.shortLabel.trim()) return alert('Short label is required (e.g. GF, DF).')
    if (!form.fullLabel.trim())  return alert('Full label is required (e.g. Gluten-Free).')

    const id = isNew
      ? form.shortLabel.toLowerCase().replace(/[^a-z0-9]/g, '') || crypto.randomUUID()
      : form.id

    if (isNew && existingIds.includes(id)) return alert(`Tag key "${id}" already exists.`)
    onSave({ ...form, id })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h3>{isNew ? 'Add Dietary Tag' : 'Edit Tag'}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">
          <div className="form-row">
            <div className="form-field">
              <label>Short Label *</label>
              <input value={form.shortLabel} onChange={e => set('shortLabel', e.target.value)} placeholder="e.g. GF, DF, Sp" maxLength={10} />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Shown on the tag badge</span>
            </div>
            <div className="form-field">
              <label>Full Label *</label>
              <input value={form.fullLabel} onChange={e => set('fullLabel', e.target.value)} placeholder="e.g. Gluten-Free, Dairy-Free" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Shown in the menu legend</span>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-field">
              <label>Badge Background</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="color" value={form.bg} onChange={e => set('bg', e.target.value)} style={{ width: 40, height: 36, padding: 2, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }} />
                <input value={form.bg} onChange={e => set('bg', e.target.value)} style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.85rem', fontFamily: 'monospace' }} />
              </div>
            </div>
            <div className="form-field">
              <label>Badge Text Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 40, height: 36, padding: 2, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }} />
                <input value={form.color} onChange={e => set('color', e.target.value)} style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.85rem', fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Preview</label>
            <div style={{ marginTop: '0.4rem' }}>
              <span style={{
                background: form.bg, color: form.color,
                padding: '0.2rem 0.6rem', borderRadius: 3,
                fontSize: '0.72rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontWeight: 600,
              }}>
                {form.shortLabel || 'TAG'}
              </span>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>
            {isNew ? 'Add Tag' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TagsEditor({ onSave }) {
  const { tags, setTags } = useSiteData()
  const [editing, setEditing] = useState(null)
  const defaultIds = DEFAULT_TAGS.map(t => t.id)
  const confirm    = useConfirm()

  function saveTag(tag) {
    const idx = tags.findIndex(t => t.id === tag.id)
    const next = idx >= 0 ? tags.map(t => t.id === tag.id ? tag : t) : [...tags, tag]
    setTags(next)
    setEditing(null)
    onSave()
  }

  async function deleteTag(id) {
    const ok = await confirm(
      'Delete this tag? It will be removed from all menu items that use it.',
      { title: 'Delete Tag', danger: true }
    )
    if (!ok) return
    setTags(tags.filter(t => t.id !== id))
    onSave()
  }

  return (
    <div>
      <div className="tags-editor__list">
        {tags.map(tag => (
          <TagRow
            key={tag.id}
            tag={tag}
            onEdit={t => setEditing(t)}
            onDelete={deleteTag}
            isDefault={defaultIds.includes(tag.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: '1.25rem', borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
        <button className="btn btn--primary" onClick={() => setEditing(BLANK)}>+ Add Dietary Tag</button>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Built-in tags (GF, VG, V, Signature) can be edited but not deleted.
        </p>
      </div>

      {editing !== null && (
        <TagModal
          tag={editing}
          onSave={saveTag}
          onClose={() => setEditing(null)}
          existingIds={tags.map(t => t.id)}
        />
      )}
    </div>
  )
}
