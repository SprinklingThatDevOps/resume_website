import { motion } from 'motion/react'
import { stats } from '../data/resume'

export default function Stats() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            className="py-8 text-center"
          >
            <p className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 sm:text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
