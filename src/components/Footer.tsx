import { profile } from '../data/resume'

function AmplifyHostedBadge() {
  return (
    <a
      href="https://aws.amazon.com/amplify/"
      target="_blank"
      rel="noreferrer"
      aria-label="Hosted on AWS Amplify"
      className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff9900]/40 hover:bg-[#ff9900]/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9900]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(255,153,0,0.35)]">
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="h-4.5 w-4.5"
          fill="none"
        >
          <path
            d="M16 3.5 27.4 10v12L16 28.5 4.6 22V10L16 3.5Z"
            className="fill-slate-950 stroke-white/25 transition-colors duration-300 group-hover:stroke-[#ff9900]/70"
            strokeWidth="1.5"
          />
          <path
            d="m16 7.3 7.6 13.3h-3.7L16 13.7l-3.9 6.9H8.4L16 7.3Z"
            fill="url(#amplifyFooterGradient)"
          />
          <path
            d="m16 18.2 2.1 3.7h-4.2l2.1-3.7Z"
            className="fill-white/90"
          />
          <defs>
            <linearGradient
              id="amplifyFooterGradient"
              x1="8.4"
              x2="24"
              y1="7.3"
              y2="21.9"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFB000" />
              <stop offset="0.55" stopColor="#FF9900" />
              <stop offset="1" stopColor="#C8511B" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.58rem] tracking-[0.32em] text-slate-500 transition-colors duration-300 group-hover:text-[#ffbf69]">
          Hosted on
        </span>
        <span className="mt-1 text-[0.68rem] tracking-[0.2em]">
          AWS Amplify
        </span>
      </span>
    </a>
  )
}

type FooterProps = {
  backToTopHref?: string
}

export default function Footer({ backToTopHref = '#top' }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center text-sm italic text-slate-500">
          “Whatever you do, work at it with all your heart.” — {profile.verse}
        </p>
        <div className="mt-6 grid items-center gap-5 text-sm text-slate-500 sm:grid-cols-[1fr_auto_1fr]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {profile.name}. Built with React, Vite
            &amp; Tailwind CSS.
          </p>
          <AmplifyHostedBadge />
          <a
            href={backToTopHref}
            className="text-center transition-colors hover:text-white sm:text-right"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
