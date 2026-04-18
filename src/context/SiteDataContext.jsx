import { createContext, useContext, useState } from 'react'
import { menuItems as defaultMenu, menuCategories as defaultCategories } from '../data/menuData'

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_RES_CONFIG = {
  slots: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
  maxSeatsPerSlot: 20,
  maxPartySize: 8,
  advanceBookingDays: 30,
  closedDays: [1], // 0=Sun … 6=Sat  (1=Monday matches default hours)
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

const seedMenu = () => {
  const out = {}
  Object.entries(defaultMenu).forEach(([cat, items]) => {
    out[cat] = items.map(item => ({ ...item, image: item.image ?? null, id: crypto.randomUUID() }))
  })
  return out
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.error(`Storage quota exceeded saving "${key}". Image may not persist.`, e)
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [menu,             setMenuRaw]             = useState(() => load('tc_menu',          seedMenu()))
  const [hours,            setHoursRaw]            = useState(() => load('tc_hours',         DEFAULT_HOURS))
  const [about,            setAboutRaw]            = useState(() => load('tc_about',         DEFAULT_ABOUT))
  const [tags,             setTagsRaw]             = useState(() => load('tc_tags',          DEFAULT_TAGS))
  const [categories,       setCategoriesRaw]       = useState(() => load('tc_categories',    defaultCategories))
  const [resConfig,        setResConfigRaw]        = useState(() => load('tc_res_cfg',       DEFAULT_RES_CONFIG))
  const [bookings,         setBookingsRaw]         = useState(() => load('tc_bookings',      []))
  const [hiddenCategories, setHiddenCategoriesRaw] = useState(() => load('tc_hidden_cats',  []))

  const setMenu             = v => { setMenuRaw(v);             save('tc_menu',         v) }
  const setHours            = v => { setHoursRaw(v);            save('tc_hours',        v) }
  const setAbout            = v => { setAboutRaw(v);            save('tc_about',        v) }
  const setTags             = v => { setTagsRaw(v);             save('tc_tags',         v) }
  const setCategories       = v => { setCategoriesRaw(v);       save('tc_categories',   v) }
  const setResConfig        = v => { setResConfigRaw(v);        save('tc_res_cfg',      v) }
  const setBookings         = v => { setBookingsRaw(v);         save('tc_bookings',     v) }
  const setHiddenCategories = v => { setHiddenCategoriesRaw(v); save('tc_hidden_cats',  v) }

  function addBooking(booking) {
    const next = [...bookings, { ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'confirmed' }]
    setBookings(next)
    return next[next.length - 1]
  }

  function cancelBooking(id) {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  function restoreBooking(id) {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
  }

  // Returns seats already booked for a specific date + slot
  function bookedSeats(date, slot) {
    return bookings
      .filter(b => b.date === date && b.slot === slot && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.partySize, 0)
  }

  const resetToDefaults = () => {
    setMenu(seedMenu()); setHours(DEFAULT_HOURS)
    setAbout(DEFAULT_ABOUT); setTags(DEFAULT_TAGS)
    setCategories(defaultCategories)
    setResConfig(DEFAULT_RES_CONFIG)
    setHiddenCategories([])
    // bookings intentionally not reset
  }

  return (
    <SiteDataContext.Provider value={{
      menu, setMenu,
      hours, setHours,
      about, setAbout,
      tags, setTags,
      categories, setCategories,
      resConfig, setResConfig,
      bookings, setBookings, addBooking, cancelBooking, restoreBooking, bookedSeats,
      hiddenCategories, setHiddenCategories,
      resetToDefaults,
    }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export const useSiteData = () => useContext(SiteDataContext)
