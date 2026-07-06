import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  eyebrow?: string
  title: string
  children: ReactNode
}

export default function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12"
        >
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
        </motion.div>
        {children}
      </div>
    </section>
  )
}
