import { motion } from 'motion/react'
import { Award, GraduationCap, Sparkles } from 'lucide-react'
import Section from './Section'
import { certifications, education, professionalDevelopment } from '../data/resume'

export default function Education() {
  return (
    <Section id="education" eyebrow="Credentials" title="Education & Certifications">
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Education</h3>
          <ul className="mt-4 space-y-3">
            {education.map((item) => (
              <li key={item.credential} className="text-sm text-slate-300">
                <p className="font-medium text-white">{item.credential}</p>
                <p className="text-slate-400">{item.institution}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Certifications</h3>
          <ul className="mt-4 space-y-2">
            {certifications.map((cert) => (
              <li key={cert} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {cert}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Professional Development</h3>
          <ul className="mt-4 space-y-2">
            {professionalDevelopment.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  )
}
