# resume_website

A single-page resume/portfolio website for Brian Bauer, built with Vite, React 19, TypeScript, and Tailwind CSS v4.

## Cursor Cloud specific instructions

### Stack & structure
- Build tool: **Vite 8** · UI: **React 19** · language: **TypeScript 6** · styling: **Tailwind CSS v4** (via `@tailwindcss/vite`, configured with `@theme` in `src/index.css` — there is no `tailwind.config.js`).
- Content lives in `src/data/resume.ts`. To update resume text (roles, skills, contact info, LinkedIn URL), edit that file — components render from it.
- The package manager is **pnpm** (see `pnpm-lock.yaml`). Use `pnpm`, not npm/yarn.

### Commands
Standard scripts are in `package.json`:
- Dev server: `pnpm dev` (Vite, serves on `http://localhost:5173`, host is exposed via `server.host: true`).
- Lint: `pnpm lint`
- Type-check + production build: `pnpm build` (runs `tsc -b` then `vite build`)
- Preview a production build: `pnpm preview`

### Non-obvious gotchas
- **`lucide-react` v1 removed brand icons** (LinkedIn, GitHub, etc.) for trademark reasons. The LinkedIn glyph is a local inline SVG at `src/components/icons/LinkedInIcon.tsx`. Do not `import { Linkedin } from 'lucide-react'` — it will fail the build.
- **ESLint 10 + `eslint-plugin-react-hooks` v7**: that plugin still ships a flat config whose `plugins` field is a string array, which ESLint 10 rejects. `eslint.config.js` therefore registers `react-hooks` manually and spreads only its `recommended-latest` rules. Don't switch back to `extends: [reactHooks.configs['recommended-latest']]`.
- The LinkedIn profile URL in `src/data/resume.ts` is a placeholder (`https://www.linkedin.com/`) — replace it with the real public profile URL before publishing. (Automated LinkedIn login/scraping is not done here: it violates LinkedIn's Terms of Service.)
