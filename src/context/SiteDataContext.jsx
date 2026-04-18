import { createContext, useContext, useState, useEffect } from 'react'
import { menuItems as defaultMenu } from '../data/menuData'

// ── Defaults ──────────────────────────────────────────────────────────────────
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

// Add image:null to each default menu item
const seedMenu = () => {
  const out = {}
  Object.entries(defaultMenu).forEach(([cat, items]) => {
    out[cat] = items.map(item => ({ ...item, image: item.image ?? null, id: crypto.randomUUID() }))
  })
  return out
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

const save = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// ── Context ───────────────────────────────────────────────────────────────────
const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [menu,  setMenuRaw]  = useState(() => load('tc_menu',  seedMenu()))
  const [hours, setHoursRaw] = useState(() => load('tc_hours', DEFAULT_HOURS))
  const [about, setAboutRaw] = useState(() => load('tc_about', DEFAULT_ABOUT))

  // Wrap setters to persist automatically
  const setMenu  = v => { setMenuRaw(v);  save('tc_menu',  v) }
  const setHours = v => { setHoursRaw(v); save('tc_hours', v) }
  const setAbout = v => { setAboutRaw(v); save('tc_about', v) }

  const resetToDefaults = () => {
    const fresh = seedMenu()
    setMenu(fresh); setHours(DEFAULT_HOURS); setAbout(DEFAULT_ABOUT)
  }

  return (
    <SiteDataContext.Provider value={{ menu, setMenu, hours, setHours, about, setAbout, resetToDefaults }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export const useSiteData = () => useContext(SiteDataContext)
