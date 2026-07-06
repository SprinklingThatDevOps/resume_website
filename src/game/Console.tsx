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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-10">
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            This is a résumé website. It is also, mysteriously, a video game.
          </p>
        </header>

        <div className="card-glow overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 font-mono text-xs text-slate-400">
                {playing ? 'ship-it — arcade' : 'brian@prod: ~/résumé'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {playing ? (
                <button
                  type="button"
                  onClick={() => setPlaying(false)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5"
                >
                  <TerminalSquare className="h-3.5 w-3.5" />
                  Back to shell
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  <Gamepad2 className="h-3.5 w-3.5" />
                  Play
                </button>
              )}
              <button
                type="button"
                onClick={onClassic}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5"
              >
                <FileText className="h-3.5 w-3.5" />
                Résumé
              </button>
            </div>
          </div>

          {/* Body */}
          {playing ? (
            <div className="p-4">
              <RunnerGame />
            </div>
          ) : (
            <Terminal onPlay={() => setPlaying(true)} onClassic={onClassic} />
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
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
