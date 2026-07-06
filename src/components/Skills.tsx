import { motion } from 'motion/react'
import Section from './Section'
import { skillGroups } from '../data/resume'

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Toolbox" title="Technical Skill Set">
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
          >
            <h3 className="text-base font-semibold text-white">{group.category}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
