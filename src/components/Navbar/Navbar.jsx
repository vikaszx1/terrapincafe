import { useState, useEffect } from 'react'
import './Navbar.scss'

const navLinks = [
  { href: '#about',   label: 'Our Story' },
  { href: '#menu',    label: 'Menu' },
  { href: '#reserve', label: 'Reserve' },
  { href: '#location',label: 'Visit' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#hero" className="navbar__logo">
        Terrapin <span>Creek</span>
      </a>

      <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={handleNavClick}>{label}</a>
          </li>
        ))}
      </ul>

      <a href="#reserve" className="navbar__reserve" onClick={handleNavClick}>
        Book a Table
      </a>

      <button
        className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  )
}
