import { motion } from 'motion/react'
import { ArrowDown, Globe, Mail, MapPin } from 'lucide-react'
import LinkedInIcon from './icons/LinkedInIcon'
import { profile, topSkills } from '../data/resume'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.06)_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            U.S. Army Program Leader · Open to platform & program leadership roles
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-3xl bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-xl font-semibold text-transparent sm:text-3xl">
            {profile.headline}
          </p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
            {profile.title}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {profile.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {topSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-200"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              View experience
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <LinkedInIcon className="h-4 w-4" />
              Connect on LinkedIn
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" />
              {profile.location}
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-brand-400" />
              {profile.email}
            </a>
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Globe className="h-4 w-4 text-brand-400" />
              likejackbauer.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
