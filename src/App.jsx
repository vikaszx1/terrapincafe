import { useEffect } from 'react'
import Navbar        from './components/Navbar/Navbar'
import Hero          from './components/Hero/Hero'
import About         from './components/About/About'
import Menu          from './components/Menu/Menu'
import Reservations  from './components/Reservations/Reservations'
import Location      from './components/Location/Location'
import Footer        from './components/Footer/Footer'
import StickyReserve from './components/StickyReserve/StickyReserve'
import './styles/global.scss'

export default function App() {
  // Scroll-reveal observer — runs once after mount
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <Reservations />
        <Location />
      </main>
      <Footer />
      <StickyReserve />
    </>
  )
}
