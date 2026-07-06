import { motion } from 'motion/react'
import { Briefcase } from 'lucide-react'
import Section from './Section'
import { experience } from '../data/resume'

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Career" title="Professional Experience">
      <div className="relative border-l border-white/10 pl-6 sm:pl-8">
        {experience.map((job, i) => (
          <motion.article
            key={`${job.company}-${job.period}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2), ease: 'easeOut' }}
            className="relative mb-12 last:mb-0"
          >
            <span className="absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full border border-brand-500/40 bg-slate-950 text-brand-400 sm:-left-[41px]">
              <Briefcase className="h-3 w-3" />
            </span>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-semibold text-white">{job.role}</h3>
              <span className="text-sm font-medium text-brand-400">{job.period}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {job.company} · {job.location}
            </p>

            <ul className="mt-4 space-y-2">
              {job.highlights.map((point, idx) => (
                <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
