import { useState, useEffect } from 'react'
import './StickyReserve.scss'

export default function StickyReserve() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#reserve"
      className={`sticky-reserve ${visible ? 'sticky-reserve--visible' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span>◇</span> Reserve a Table
    </a>
  )
}
