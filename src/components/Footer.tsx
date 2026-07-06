import { profile } from '../data/resume'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, Vite &amp;
          Tailwind CSS.
        </p>
        <a href="#top" className="transition-colors hover:text-white">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
