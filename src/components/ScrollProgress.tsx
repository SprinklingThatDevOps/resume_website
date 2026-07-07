import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [scaleX, setScaleX] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      frame = 0
      const scrollRange =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0
      setScaleX(Math.min(Math.max(progress, 0), 1))
    }

    const requestUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <div
      style={{ transform: `scaleX(${scaleX})` }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-400 via-brand-500 to-brand-300"
    />
  )
}
