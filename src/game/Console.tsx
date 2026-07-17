import { useEffect, useState } from 'react'
import { Gamepad2, FileText, TerminalSquare } from 'lucide-react'
import RunnerGame from './RunnerGame'
import Terminal from './Terminal'
import { profile } from '../data/resume'

type ConsoleProps = {
  onClassic: () => void
}

export default function Console({ onClassic }: ConsoleProps) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // While playing, keep the page from rubber-banding under the canvas on iOS.
  useEffect(() => {
    if (!playing) return
    const prev = document.documentElement.style.overscrollBehavior
    document.documentElement.style.overscrollBehavior = 'none'
    return () => {
      document.documentElement.style.overscrollBehavior = prev
    }
  }, [playing])

  return (
    <div className="relative min-h-dvh bg-slate-950 text-slate-200">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:32px_32px]" />

      <div
        className={[
          'relative mx-auto flex min-h-dvh max-w-4xl flex-col px-3 sm:px-4',
          playing ? 'justify-start py-4 sm:py-8' : 'justify-center py-6 sm:py-10',
        ].join(' ')}
      >
        <header className="mb-4 text-center sm:mb-5">
          <h1 className="text-xl font-black tracking-tight text-white sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            This is a résumé website. It is also, mysteriously, a video game.
          </p>
        </header>

        <div className="card-glow overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur">
          {/* Window chrome */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-900/80 px-3 py-2.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-400/80" />
              <span className="ml-2 truncate font-mono text-[11px] text-slate-400 sm:ml-3 sm:text-xs">
                {playing ? 'ship-it — arcade' : 'brian@prod: ~/résumé'}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {playing ? (
                <button
                  type="button"
                  onClick={() => setPlaying(false)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 sm:px-2.5 sm:py-1"
                >
                  <TerminalSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Back to shell</span>
                  <span className="sm:hidden">Shell</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-400 sm:py-1"
                >
                  <Gamepad2 className="h-3.5 w-3.5" />
                  Play
                </button>
              )}
              <button
                type="button"
                onClick={onClassic}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 sm:px-2.5 sm:py-1"
              >
                <FileText className="h-3.5 w-3.5" />
                Résumé
              </button>
            </div>
          </div>

          {/* Body */}
          {playing ? (
            <div className="p-3 sm:p-4">
              <RunnerGame />
            </div>
          ) : (
            <Terminal onPlay={() => setPlaying(true)} onClassic={onClassic} />
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 sm:mt-5">
          Prefer the boring version?{' '}
          <button
            type="button"
            onClick={onClassic}
            className="font-medium text-brand-400 underline underline-offset-2 hover:text-brand-300"
          >
            View the classic résumé →
          </button>
        </p>
      </div>
    </div>
  )
}
