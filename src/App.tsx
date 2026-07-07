import { useCallback, useEffect, useState } from 'react'
import Console from './game/Console'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Pillars from './components/Pillars'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

type View = 'game' | 'resume'

// Section anchors live inside the résumé view; treat them (and #resume) as
// "resume", and an empty hash as the default game view.
const RESUME_HASHES = new Set([
  '#resume',
  '#top',
  '#about',
  '#experience',
  '#skills',
  '#education',
  '#contact',
])

function viewFromHash(hash: string): View {
  return RESUME_HASHES.has(hash) ? 'resume' : 'game'
}

function ResumePage({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <ScrollProgress />
      <Navbar onExit={onExit} />
      <main>
        <Hero />
        <Stats />
        <Pillars />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function GamePage({ onClassic }: { onClassic: () => void }) {
  return (
    <div id="game-top" className="min-h-screen bg-slate-950">
      <Console onClassic={onClassic} />
      <Footer backToTopHref="#game-top" />
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>(() => viewFromHash(window.location.hash))

  const go = useCallback((next: View) => {
    setView(next)
    if (next === 'resume') {
      window.location.hash = 'resume'
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const onHash = () => setView(viewFromHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return view === 'resume' ? (
    <ResumePage onExit={() => go('game')} />
  ) : (
    <GamePage onClassic={() => go('resume')} />
  )
}
