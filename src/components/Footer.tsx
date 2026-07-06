import { profile } from '../data/resume'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center text-sm italic text-slate-500">
          “Whatever you do, work at it with all your heart.” — {profile.verse}
        </p>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with React, Vite
            &amp; Tailwind CSS.
          </p>
          <a href="#top" className="transition-colors hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
