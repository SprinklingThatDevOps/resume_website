import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  certifications,
  education,
  experience,
  profile,
  skillGroups,
  topSkills,
} from '../data/resume'

type Line = { id: number; node: ReactNode }

const PROMPT = 'brian@prod:~$'

let idSeq = 0
const line = (node: ReactNode): Line => ({ id: idSeq++, node })

const BOOT: string[] = [
  'booting brianOS v16.0.4 …',
  'mounting /dev/experience … ok',
  'starting zero-trust-daemon … ok',
  'establishing coffee supply chain … ok',
  '',
  "You expected a résumé. You got a shell. (Engineers, right?)",
  "Type `help` for commands, or `play` to ship some code.",
  '',
]

type TerminalProps = {
  onPlay: () => void
  onClassic: () => void
}

export default function Terminal({ onPlay, onClassic }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number>(-1)
  const [booted, setBooted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Boot sequence
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setLines((prev) => [...prev, line(<span className="text-slate-500">{BOOT[i]}</span>)])
      i++
      if (i >= BOOT.length) {
        clearInterval(timer)
        setBooted(true)
      }
    }, 130)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  useEffect(() => {
    if (booted) inputRef.current?.focus()
  }, [booted])

  const print = (nodes: ReactNode[]) =>
    setLines((prev) => [...prev, ...nodes.map((n) => line(n))])

  const openUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

  const run = (raw: string) => {
    const cmd = raw.trim()
    const [name, ...args] = cmd.split(/\s+/)
    const key = name?.toLowerCase() ?? ''

    // Echo the command
    setLines((prev) => [
      ...prev,
      line(
        <span>
          <span className="text-emerald-400">{PROMPT}</span>{' '}
          <span className="text-slate-200">{cmd}</span>
        </span>,
      ),
    ])

    if (cmd === '') return

    switch (key) {
      case 'help':
        print([
          <span className="text-slate-300">Available commands:</span>,
          <CmdList />,
        ])
        break
      case 'whoami':
      case 'about':
        print([
          <span className="text-brand-300 font-semibold">{profile.name}</span>,
          <span className="text-slate-300">{profile.headline}</span>,
          <span className="text-slate-500">{profile.title}</span>,
          <span className="text-slate-400">{profile.location}</span>,
          <span />,
          <span className="text-slate-300 max-w-2xl block">{profile.summary}</span>,
        ])
        break
      case 'experience':
      case 'work':
      case 'ls': {
        const nodes: ReactNode[] = []
        for (const job of experience) {
          nodes.push(
            <span>
              <span className="text-brand-300 font-semibold">{job.company}</span>{' '}
              <span className="text-slate-500">— {job.totalPeriod}</span>
            </span>,
          )
          for (const p of job.positions) {
            nodes.push(
              <span className="text-slate-400 pl-4">
                • {p.role} <span className="text-slate-600">({p.period})</span>
              </span>,
            )
          }
          nodes.push(<span />)
        }
        nodes.push(
          <span className="text-slate-500">
            tip: run `resume --classic` for the full write-up.
          </span>,
        )
        print(nodes)
        break
      }
      case 'skills': {
        const nodes: ReactNode[] = [
          <span className="text-slate-300">Top skills: {topSkills.join(' · ')}</span>,
          <span />,
        ]
        for (const grp of skillGroups) {
          nodes.push(
            <span>
              <span className="text-brand-300">{grp.category}:</span>{' '}
              <span className="text-slate-400">{grp.skills.join(', ')}</span>
            </span>,
          )
        }
        print(nodes)
        break
      }
      case 'education':
      case 'edu':
        print([
          ...education.map((e) => (
            <span className="text-slate-300">
              {e.credential} — <span className="text-slate-400">{e.institution}</span>{' '}
              <span className="text-slate-600">({e.period})</span>
            </span>
          )),
          <span className="text-slate-300">
            Certs: <span className="text-slate-400">{certifications.join(' · ')}</span>
          </span>,
        ])
        break
      case 'contact':
        print([
          <span className="text-slate-300">email: <a className="text-brand-400 underline" href={`mailto:${profile.email}`}>{profile.email}</a></span>,
          <span className="text-slate-300">phone: <span className="text-slate-400">{profile.phone}</span></span>,
          <span className="text-slate-300">linkedin: <a className="text-brand-400 underline" href={profile.linkedin} target="_blank" rel="noreferrer noopener">/in/brianbaueralabama</a></span>,
          <span className="text-slate-300">web: <a className="text-brand-400 underline" href={profile.website} target="_blank" rel="noreferrer noopener">likejackbauer.com</a></span>,
        ])
        break
      case 'linkedin':
        print([<span className="text-slate-400">opening LinkedIn…</span>])
        openUrl(profile.linkedin)
        break
      case 'website':
      case 'web':
        print([<span className="text-slate-400">opening likejackbauer.com…</span>])
        openUrl(profile.website)
        break
      case 'resume':
      case 'cv':
        if (args.includes('--classic') || args.includes('classic')) {
          print([<span className="text-slate-400">rendering the boring version…</span>])
          onClassic()
        } else if (args.includes('--pdf') || args.includes('pdf')) {
          print([<span className="text-slate-400">downloading brian-bauer-resume.pdf…</span>])
          openUrl('/brian-bauer-resume.pdf')
        } else {
          print([
            <span className="text-slate-300">Options:</span>,
            <span className="text-slate-400 pl-4">• `resume --pdf` — download the actual PDF résumé</span>,
            <span className="text-slate-400 pl-4">• `resume --classic` — open the full web résumé</span>,
          ])
        }
        break
      case 'play':
      case 'game':
      case 'start':
        print([<span className="text-slate-400">launching Ship It!… good luck 🚀</span>])
        onPlay()
        break
      case 'classic':
        print([<span className="text-slate-400">rendering the boring version…</span>])
        onClassic()
        break
      case 'clear':
      case 'cls':
        setLines([])
        return
      case 'sudo':
        if (args.join(' ').toLowerCase().includes('hire brian')) {
          print([
            <span className="text-emerald-400">[sudo] access granted. Excellent decision. ✅</span>,
            <span className="text-slate-400">Reach out: <a className="text-brand-400 underline" href={`mailto:${profile.email}`}>{profile.email}</a></span>,
          ])
        } else {
          print([<span className="text-slate-400">brian is not in the sudoers file. This incident will be reported. 🫡</span>])
        }
        break
      case 'coffee':
      case 'make':
        print([
          <pre className="text-brand-300 leading-tight">{'    ( (\n     ) )\n  ........\n  |      |]\n  \\      /\n   `----\u2019'}</pre>,
          <span className="text-slate-400">☕ brewing… deploys now 40% more caffeinated.</span>,
        ])
        break
      case 'cat':
        print([<span className="text-slate-400">meow. (try `experience`, `skills`, or `contact`)</span>])
        break
      case 'vim':
      case 'vi':
        print([<span className="text-slate-400">You're now stuck in vim. Type `:q!`… just kidding, you're free.</span>])
        break
      case 'rm':
        print([<span className="text-red-400">Nice try. Production is protected by Zero Trust. 🛡️</span>])
        break
      case 'exit':
      case 'quit':
        print([<span className="text-slate-400">There is no escape from a good résumé. Type `help`.</span>])
        break
      case 'echo':
        print([<span className="text-slate-300">{args.join(' ')}</span>])
        break
      case 'date':
        print([<span className="text-slate-400">{new Date().toString()}</span>])
        break
      default:
        print([
          <span className="text-red-400">
            command not found: {name}
          </span>,
          <span className="text-slate-500">Type `help` for the list. (Or `play` — you know you want to.)</span>,
        ])
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = input
    run(value)
    if (value.trim()) {
      setHistory((prev) => [...prev, value])
    }
    setHistIdx(-1)
    setInput('')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(nextIdx)
      setInput(history[nextIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const nextIdx = histIdx + 1
      if (nextIdx >= history.length) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(nextIdx)
        setInput(history[nextIdx])
      }
    }
  }

  return (
    <div
      className="flex h-[52vh] min-h-[320px] flex-col bg-slate-950/70 p-4 font-mono text-sm sm:text-[15px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
        {lines.map((l) => (
          <div key={l.id} className="whitespace-pre-wrap break-words leading-relaxed">
            {l.node}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
        <span className="shrink-0 text-emerald-400">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="terminal input"
          className="w-full flex-1 bg-transparent text-slate-100 caret-brand-400 outline-none"
        />
      </form>
    </div>
  )
}

function CmdList() {
  const cmds: [string, string][] = [
    ['play', 'launch the Ship It! runner game 🚀'],
    ['whoami', 'who is this guy'],
    ['experience', 'career history'],
    ['skills', 'the toolbox'],
    ['education', 'schooling & certs'],
    ['contact', 'how to reach me'],
    ['resume --pdf', 'download the actual résumé'],
    ['resume --classic', 'open the full web résumé'],
    ['linkedin', 'open LinkedIn profile'],
    ['sudo hire brian', 'the correct command'],
    ['coffee', '☕'],
    ['clear', 'wipe the screen'],
  ]
  return (
    <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
      {cmds.map(([c, d]) => (
        <div key={c} className="flex gap-3">
          <span className="w-36 shrink-0 text-brand-300">{c}</span>
          <span className="text-slate-500">{d}</span>
        </div>
      ))}
    </div>
  )
}
