import { motion } from 'motion/react'
import { Cloud, ShieldCheck, Workflow } from 'lucide-react'
import { pillars } from '../data/resume'

const icons = [Workflow, Cloud, ShieldCheck]

export default function Pillars() {
  return (
    <section id="about" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                className="card-glow rounded-2xl border border-white/10 bg-slate-900/50 p-6"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {pillar.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
