import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { menuCategories, tagLabels } from '../../data/menuData'
import ImageUpload from '../components/ImageUpload'

const BLANK_ITEM = { name: '', price: '', desc: '', tags: [], image: '', id: '' }
const ALL_TAGS = ['gf', 'vg', 'v', 'sig']

function ItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ ...BLANK_ITEM, ...item })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function toggleTag(tag) {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag])
  }

  function handleSave() {
    if (!form.name.trim() || !form.price.trim()) return alert('Name and price are required.')
    onSave({ ...form, id: form.id || crypto.randomUUID() })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h3>{item.id ? 'Edit Item' : 'Add Menu Item'}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="form-row">
            <div className="form-field">
              <label>Item Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Pan-Seared Halibut" />
            </div>
            <div className="form-field">
              <label>Price *</label>
              <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. $44 or $22 / $88" />
            </div>
          </div>

          <div className="form-row form-row--full" style={{ marginBottom: '1rem' }}>
            <div className="form-field">
              <label>Description</label>
              <textarea value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Short description of the dish..." />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <ImageUpload
              label="Item Image (optional)"
              value={form.image || ''}
              onChange={v => set('image', v)}
            />
          </div>

          <div className="form-field">
            <label>Dietary Tags</label>
            <div className="tag-checks">
              {ALL_TAGS.map(tag => (
                <label key={tag}>
                  <input type="checkbox" checked={form.tags.includes(tag)} onChange={() => toggleTag(tag)} />
                  {tagLabels[tag].label} ({tag.toUpperCase()})
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>
            {item.id ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MenuEditor({ onSave }) {
  const { menu, setMenu } = useSiteData()
  const [activeTab, setActiveTab] = useState('starters')
  const [editing, setEditing]     = useState(null) // null | item object

  function saveItem(item) {
    const items = menu[activeTab] || []
    const idx   = items.findIndex(i => i.id === item.id)
    const next  = idx >= 0
      ? items.map(i => i.id === item.id ? item : i)
      : [...items, item]
    setMenu({ ...menu, [activeTab]: next })
    setEditing(null)
    onSave()
  }

  function deleteItem(id) {
    if (!confirm('Delete this menu item?')) return
    setMenu({ ...menu, [activeTab]: menu[activeTab].filter(i => i.id !== id) })
    onSave()
  }

  const items = menu[activeTab] || []

  return (
    <div>
      <div className="menu-editor__tabs">
        {menuCategories.map(({ id, label }) => (
          <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
            {label} ({(menu[id] || []).length})
          </button>
        ))}
      </div>

      <div className="menu-editor__list">
        {items.map(item => (
          <div key={item.id} className="menu-editor__item">
            <div className="menu-editor__item-img">
              {item.image
                ? <img src={item.image} alt={item.name} onError={e => { e.target.style.display='none' }} />
                : '🍽'}
            </div>
            <div className="menu-editor__item-body">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span className="menu-editor__item-name">{item.name}</span>
                <span className="menu-editor__item-price">{item.price}</span>
              </div>
              <div className="menu-editor__item-desc">{item.desc}</div>
              {item.tags?.length > 0 && (
                <div className="menu-editor__item-tags">
                  {item.tags.map(t => <span key={t}>{tagLabels[t]?.label || t}</span>)}
                </div>
              )}
            </div>
            <div className="menu-editor__item-actions">
              <button className="btn btn--outline btn--sm" onClick={() => setEditing(item)}>Edit</button>
              <button className="btn btn--danger btn--sm" onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem 0' }}>
            No items in this category yet.
          </p>
        )}
      </div>

      <div className="menu-editor__add-bar">
        <button className="btn btn--primary" onClick={() => setEditing(BLANK_ITEM)}>
          + Add Item to {menuCategories.find(c => c.id === activeTab)?.label}
        </button>
      </div>

      {editing !== null && (
        <ItemModal item={editing} onSave={saveItem} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
