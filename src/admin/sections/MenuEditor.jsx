import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import ImageUpload from '../components/ImageUpload'
import { useConfirm } from '../components/ConfirmDialog'

const BLANK_ITEM = { name: '', price: '', desc: '', tags: [], image: '', id: '' }

function ItemModal({ item, onSave, onClose, allTags }) {
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
              {allTags.map(tag => (
                <label key={tag.id}>
                  <input type="checkbox" checked={form.tags.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                  <span style={{ background: tag.bg, color: tag.color, padding: '0.1rem 0.45rem', borderRadius: 3, fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    {tag.shortLabel}
                  </span>
                  {tag.fullLabel}
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
  const { menu, setMenu, tags: allTags, categories, setCategories, hiddenCategories, setHiddenCategories } = useSiteData()
  const [activeTab, setActiveTab] = useState(() => categories[0]?.id || 'starters')
  const [editing, setEditing]     = useState(null)
  const [newCatName, setNewCatName] = useState('')
  const confirm = useConfirm()

  function toggleCategory(id) {
    const next = hiddenCategories.includes(id)
      ? hiddenCategories.filter(c => c !== id)
      : [...hiddenCategories, id]
    setHiddenCategories(next)
    onSave()
  }

  function addCategory() {
    const label = newCatName.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    if (categories.find(c => c.id === id)) return alert(`A category with key "${id}" already exists.`)
    setCategories([...categories, { id, label }])
    setNewCatName('')
    onSave()
  }

  async function deleteCategory(id) {
    const count = (menu[id] || []).length
    const ok = await confirm(
      `Delete "${categories.find(c => c.id === id)?.label}"?${count > 0 ? ` This will also remove all ${count} item(s) inside it.` : ''}`,
      { title: 'Delete Category', danger: true }
    )
    if (!ok) return
    setCategories(categories.filter(c => c.id !== id))
    const next = { ...menu }; delete next[id]
    setMenu(next)
    if (activeTab === id) setActiveTab(categories.find(c => c.id !== id)?.id || '')
    onSave()
  }

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

  async function deleteItem(id) {
    const ok = await confirm('Delete this menu item? This action cannot be undone.', { danger: true })
    if (!ok) return
    setMenu({ ...menu, [activeTab]: menu[activeTab].filter(i => i.id !== id) })
    onSave()
  }

  const items = menu[activeTab] || []

  return (
    <div>
      {/* ── Category Visibility + Add ── */}
      <div className="cat-visibility">
        <div className="cat-visibility__title">Category Visibility</div>
        <div className="cat-visibility__list">
          {categories.map(({ id, label }) => {
            const visible = !hiddenCategories.includes(id)
            return (
              <div key={id} className={`cat-visibility__row ${!visible ? 'cat-visibility__row--hidden' : ''}`}>
                <div className="cat-visibility__info">
                  <span className="cat-visibility__name">{label}</span>
                  <span className="cat-visibility__count">{(menu[id] || []).length} items</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    className={`cat-toggle ${visible ? 'cat-toggle--on' : 'cat-toggle--off'}`}
                    onClick={() => toggleCategory(id)}
                    title={visible ? 'Hide on live site' : 'Show on live site'}
                  >
                    <span className="cat-toggle__track">
                      <span className="cat-toggle__thumb" />
                    </span>
                    <span className="cat-toggle__label">{visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => deleteCategory(id)}
                    title="Delete category"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add new category */}
        <div className="cat-visibility__add">
          <input
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            placeholder="New category name (e.g. Raw Bar)"
            onKeyDown={e => e.key === 'Enter' && addCategory()}
          />
          <button className="btn btn--primary btn--sm" onClick={addCategory}>+ Add Category</button>
        </div>
      </div>

      <div className="menu-editor__tabs">
        {categories.map(({ id, label }) => (
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
                  {item.tags.map(tid => {
                    const t = allTags.find(x => x.id === tid)
                    return t
                      ? <span key={tid} style={{ background: t.bg, color: t.color }}>{t.shortLabel}</span>
                      : <span key={tid}>{tid}</span>
                  })}
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
          + Add Item to {categories.find(c => c.id === activeTab)?.label}
        </button>
      </div>

      {editing !== null && (
        <ItemModal item={editing} onSave={saveItem} onClose={() => setEditing(null)} allTags={allTags} />
      )}
    </div>
  )
}
