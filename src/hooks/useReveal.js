import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to animate elements with the
 * class "reveal" into view when they enter the viewport.
 */
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}
