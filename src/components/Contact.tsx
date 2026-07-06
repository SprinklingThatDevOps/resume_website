import { motion } from 'motion/react'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import LinkedInIcon from './icons/LinkedInIcon'
import Section from './Section'
import { profile } from '../data/resume'

export default function Contact() {
  const items = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^0-9+]/g, '')}` },
    { icon: LinkedInIcon, label: 'LinkedIn', value: '/in/brianbaueralabama', href: profile.linkedin },
    { icon: Globe, label: 'Website', value: 'likejackbauer.com', href: profile.website },
    { icon: MapPin, label: 'Location', value: profile.location },
  ]

  return (
    <Section id="contact" eyebrow="Say hello" title="Let's build something secure.">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-glow rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-8 sm:p-10"
      >
        <p className="max-w-2xl text-slate-300">
          Interested in cloud platform architecture, DevSecOps enablement, or
          technical program leadership? I'd love to connect.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-brand-500/40">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-400">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wide text-slate-500">
                    {label}
                  </span>
                  <span className="block font-medium text-white">{value}</span>
                </span>
              </div>
            )
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                {content}
              </a>
            ) : (
              <div key={label}>{content}</div>
            )
          })}
        </div>
      </motion.div>
    </Section>
  )
}
