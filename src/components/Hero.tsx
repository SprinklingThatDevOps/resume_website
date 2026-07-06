import { motion } from 'motion/react'
import { ArrowDown, Mail, MapPin } from 'lucide-react'
import LinkedInIcon from './icons/LinkedInIcon'
import { profile } from '../data/resume'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Open to platform & program leadership roles
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-2xl bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
            {profile.title}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              View experience
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" />
              {profile.location}
            </span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <LinkedInIcon className="h-4 w-4 text-brand-400" />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
