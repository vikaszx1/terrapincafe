import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { menuItems as defaultMenuItems, menuCategories as defaultCategories } from '../data/menuData'

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_RES_CONFIG = {
  slots: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
  maxSeatsPerSlot: 20,
  maxPartySize: 8,
  advanceBookingDays: 30,
  closedDays: [1],
}

const DEFAULT_HOURS = [
  { id: 1, days: 'Tuesday – Friday',  time: '5:00 – 9:00 PM',  closed: false },
  { id: 2, days: 'Saturday – Sunday', time: '4:30 – 9:30 PM',  closed: false },
  { id: 3, days: 'Monday',            time: '',                 closed: true  },
]

const DEFAULT_ABOUT = {
  para1: 'TERRAPIN CREEK opened in 2008, envisioned as a casual neighborhood spot where friends and neighbors could enjoy the best ingredients our seasons have to offer.',
  para2: 'Most importantly, the kitchen is committed to using the highest quality local produce and meats in all of its dishes. Through a working friendship with Bay Area farmers, TERRAPIN CREEK is expanding the notion of comfort food to include dining that is casual, affordable, and responsible.',
  para3: 'TERRAPIN CREEK showcases both local and global cuisines using seasonal and locally sourced ingredients. Guests can select from a menu of raw treatments, such as oysters on a half shell and carpaccio from the raw bar, to a range of appetizers and entree plates as well as an assortment of artisan cheese and desserts.',
  image: '/images/about_us_img.jpg',
}

export const DEFAULT_TAGS = [
  { id: 'gf',  shortLabel: 'GF',        fullLabel: 'Gluten-Free',  bg: '#e8f0f4', color: '#2c4a5e' },
  { id: 'vg',  shortLabel: 'VG',        fullLabel: 'Vegan',        bg: '#e8f4ee', color: '#2a6048' },
  { id: 'v',   shortLabel: 'V',         fullLabel: 'Vegetarian',   bg: '#f0ece8', color: '#6a4828' },
  { id: 'sig', shortLabel: 'Signature', fullLabel: 'Signature',    bg: '#e8f0f4', color: '#2c4a5e' },
]

// ── DB ↔ App format helpers ───────────────────────────────────────────────────
function dbRowsToMenu(rows) {
  const out = {}
  ;(rows || []).forEach((r, idx) => {
    if (!out[r.category_id]) out[r.category_id] = []
    out[r.category_id].push({
      id: r.id, name: r.name, price: r.price,
      desc: r.description || '', tags: r.tags || [], image: r.image || null,
    })
  })
  return out
}

function menuToDbRows(menu) {
  const rows = []
  Object.entries(menu).forEach(([categoryId, items]) => {
    ;(items || []).forEach((item, idx) => {
      rows.push({
        id: item.id,
        category_id: categoryId,
        name: item.name,
        price: item.price,
        description: item.desc || '',
        tags: item.tags || [],
        image: item.image || null,
        sort_order: idx,
      })
    })
  })
  return rows
}

function dbRowsToTags(rows) {
  return (rows || []).map(r => ({
    id: r.id, shortLabel: r.short_label, fullLabel: r.full_label, bg: r.bg, color: r.color,
  }))
}

function tagsToDbRows(tags) {
  return tags.map((t, i) => ({
    id: t.id, short_label: t.shortLabel, full_label: t.fullLabel,
    bg: t.bg, color: t.color, sort_order: i,
  }))
}

function dbRowsToBookings(rows) {
  return (rows || []).map(r => ({
    id: r.id, date: r.date, slot: r.slot,
    name: r.name, email: r.email, phone: r.phone || '',
    partySize: r.party_size, requests: r.requests || '',
    status: r.status, createdAt: r.created_at,
  }))
}

// ── Context ───────────────────────────────────────────────────────────────────
const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [loading,          setLoading]          = useState(true)
  const [menu,             setMenuState]         = useState({})
  const [hours,            setHoursState]        = useState(DEFAULT_HOURS)
  const [about,            setAboutState]        = useState(DEFAULT_ABOUT)
  const [tags,             setTagsState]         = useState(DEFAULT_TAGS)
  const [categories,       setCategoriesState]   = useState(defaultCategories)
  const [hiddenCategories, setHiddenCatsState]   = useState([])
  const [resConfig,        setResConfigState]    = useState(DEFAULT_RES_CONFIG)
  const [bookings,         setBookingsState]     = useState([])

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        const [
          { data: catRows,     error: catErr     },
          { data: itemRows,    error: itemErr     },
          { data: tagRows,     error: tagErr      },
          { data: configRows,  error: cfgErr      },
          { data: bookingRows, error: bookingErr  },
        ] = await Promise.all([
          supabase.from('menu_categories').select('*').order('sort_order'),
          supabase.from('menu_items').select('*').order('category_id').order('sort_order'),
          supabase.from('dietary_tags').select('*').order('sort_order'),
          supabase.from('site_config').select('*'),
          supabase.from('bookings').select('*').order('date').order('created_at'),
        ])

        if (catErr || itemErr || tagErr || cfgErr || bookingErr) {
          console.error('Supabase load errors:', { catErr, itemErr, tagErr, cfgErr, bookingErr })
        }

        // ── Categories & hidden ──
        if (catRows?.length) {
          setCategoriesState(catRows.map(r => ({ id: r.id, label: r.label })))
          setHiddenCatsState(catRows.filter(r => r.hidden).map(r => r.id))
        } else {
          await seedDefaults()
          return
        }

        // ── Menu items ──
        if (itemRows?.length) setMenuState(dbRowsToMenu(itemRows))

        // ── Tags ──
        if (tagRows?.length) setTagsState(dbRowsToTags(tagRows))

        // ── Site config ──
        if (configRows?.length) {
          const cfg = Object.fromEntries(configRows.map(r => [r.key, r.value]))
          if (cfg.hours)      setHoursState(cfg.hours)
          if (cfg.about)      setAboutState(cfg.about)
          if (cfg.res_config) setResConfigState(cfg.res_config)
        }

        // ── Bookings ──
        if (bookingRows?.length) setBookingsState(dbRowsToBookings(bookingRows))

      } catch (err) {
        console.error('Failed to load from Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  // ── Seed DB on first run ─────────────────────────────────────────────────────
  async function seedDefaults() {
    try {
      // Categories
      await supabase.from('menu_categories').insert(
        defaultCategories.map((c, i) => ({ id: c.id, label: c.label, sort_order: i, hidden: false }))
      )
      setCategoriesState(defaultCategories)
      setHiddenCatsState([])

      // Tags
      await supabase.from('dietary_tags').insert(tagsToDbRows(DEFAULT_TAGS))
      setTagsState(DEFAULT_TAGS)

      // Menu items — seed with UUIDs
      const seeded = {}
      Object.entries(defaultMenuItems).forEach(([cat, items]) => {
        seeded[cat] = items.map(item => ({ ...item, id: crypto.randomUUID(), image: item.image ?? null }))
      })
      const rows = menuToDbRows(seeded)
      if (rows.length) await supabase.from('menu_items').insert(rows)
      setMenuState(seeded)

      // Config
      await supabase.from('site_config').insert([
        { key: 'hours',      value: DEFAULT_HOURS      },
        { key: 'about',      value: DEFAULT_ABOUT      },
        { key: 'res_config', value: DEFAULT_RES_CONFIG },
      ])
    } catch (err) {
      console.error('Seed failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Setters ──────────────────────────────────────────────────────────────────
  async function setMenu(newMenu) {
    setMenuState(newMenu)
    const rows = menuToDbRows(newMenu)
    // Clear and replace (simple, correct for small menus)
    await supabase.from('menu_items').delete().gte('sort_order', 0)
    if (rows.length) await supabase.from('menu_items').insert(rows)
  }

  async function setHours(newHours) {
    setHoursState(newHours)
    await supabase.from('site_config').upsert({ key: 'hours', value: newHours })
  }

  async function setAbout(newAbout) {
    setAboutState(newAbout)
    await supabase.from('site_config').upsert({ key: 'about', value: newAbout })
  }

  async function setTags(newTags) {
    setTagsState(newTags)
    const rows = tagsToDbRows(newTags)
    const keepIds = newTags.map(t => t.id)
    // Delete removed tags, upsert existing/new
    await supabase.from('dietary_tags').delete().not('id', 'in', `(${keepIds.map(id => `"${id}"`).join(',')})`)
    if (rows.length) await supabase.from('dietary_tags').upsert(rows)
  }

  async function setCategories(newCats) {
    setCategoriesState(newCats)
    const keepIds = newCats.map(c => c.id)
    // Delete removed categories (cascade deletes their items)
    await supabase.from('menu_categories').delete().not('id', 'in', `(${keepIds.map(id => `"${id}"`).join(',')})`)
    // Upsert all
    if (newCats.length) {
      await supabase.from('menu_categories').upsert(
        newCats.map((c, i) => ({
          id: c.id, label: c.label, sort_order: i,
          hidden: hiddenCategories.includes(c.id),
        }))
      )
    }
  }

  async function setHiddenCategories(hiddenIds) {
    setHiddenCatsState(hiddenIds)
    // Update hidden flag for all categories
    const updates = categories.map(c => ({
      id: c.id, label: c.label,
      hidden: hiddenIds.includes(c.id),
    }))
    if (updates.length) await supabase.from('menu_categories').upsert(updates)
  }

  async function setResConfig(newConfig) {
    setResConfigState(newConfig)
    await supabase.from('site_config').upsert({ key: 'res_config', value: newConfig })
  }

  // ── Booking helpers ──────────────────────────────────────────────────────────
  async function addBooking(booking) {
    const row = {
      date: booking.date, slot: booking.slot,
      name: booking.name, email: booking.email,
      phone: booking.phone || '', party_size: booking.partySize,
      requests: booking.requests || '', status: 'confirmed',
    }
    const { data, error } = await supabase.from('bookings').insert(row).select().single()
    if (error) { console.error('addBooking failed:', error); return null }
    const saved = { ...booking, id: data.id, createdAt: data.created_at, status: 'confirmed' }
    setBookingsState(prev => [...prev, saved])
    return saved
  }

  async function cancelBooking(id) {
    setBookingsState(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
  }

  async function restoreBooking(id) {
    setBookingsState(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id)
  }

  function bookedSeats(date, slot) {
    return bookings
      .filter(b => b.date === date && b.slot === slot && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.partySize, 0)
  }

  // ── Reset to defaults ────────────────────────────────────────────────────────
  async function resetToDefaults() {
    setLoading(true)
    await Promise.all([
      supabase.from('menu_items').delete().gte('sort_order', 0),
      supabase.from('menu_categories').delete().neq('id', ''),
      supabase.from('dietary_tags').delete().neq('id', ''),
      supabase.from('site_config').delete().neq('key', ''),
    ])
    await seedDefaults()
  }

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', gap: '1rem',
        fontFamily: 'system-ui, sans-serif', color: '#64748b',
      }}>
        <div style={{
          width: 36, height: 36, border: '3px solid #e2e8f0',
          borderTopColor: '#2c4a5e', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Loading…</span>
      </div>
    )
  }

  return (
    <SiteDataContext.Provider value={{
      menu, setMenu,
      hours, setHours,
      about, setAbout,
      tags, setTags,
      categories, setCategories,
      hiddenCategories, setHiddenCategories,
      resConfig, setResConfig,
      bookings, addBooking, cancelBooking, restoreBooking, bookedSeats,
      resetToDefaults,
    }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export const useSiteData = () => useContext(SiteDataContext)
