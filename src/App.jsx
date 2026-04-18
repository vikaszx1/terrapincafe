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
  // Scroll-reveal observer
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => observer.observe(el))
      return observer
    }

    // Small delay so React StrictMode double-invoke settles
    const timer = setTimeout(() => { observe() }, 50)
    return () => clearTimeout(timer)
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
