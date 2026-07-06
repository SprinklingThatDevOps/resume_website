# resume_website

A single-page resume/portfolio website for Brian Bauer, built with Vite, React 19, TypeScript, and Tailwind CSS v4.

## Cursor Cloud specific instructions

### Stack & structure
- Build tool: **Vite 8** · UI: **React 19** · language: **TypeScript 6** · styling: **Tailwind CSS v4** (via `@tailwindcss/vite`, configured with `@theme` in `src/index.css` — there is no `tailwind.config.js`).
- Content lives in `src/data/resume.ts`. To update resume text (roles, skills, contact info, LinkedIn URL), edit that file — both the game/terminal and the classic résumé render from it.
- The default view is a **game console** (`src/game/`): an interactive fake shell (`Terminal.tsx`) that launches an arcade runner (`RunnerGame.tsx`), composed in `Console.tsx`. The **classic résumé** page (the `src/components/*` sections) is reachable via the `#resume` hash or the in-app "Résumé"/"classic" buttons; `App.tsx` switches views based on the URL hash (section anchors like `#contact` count as the résumé view).
- The downloadable résumé PDF is served from `public/brian-bauer-resume.pdf` (terminal command `resume --pdf`).
- The package manager is **pnpm** (see `pnpm-lock.yaml`). Use `pnpm`, not npm/yarn.

### Commands
Standard scripts are in `package.json`:
- Dev server: `pnpm dev` (Vite, serves on `http://localhost:5173`, host is exposed via `server.host: true`).
- Lint: `pnpm lint`
- Type-check + production build: `pnpm build` (runs `tsc -b` then `vite build`)
- Preview a production build: `pnpm preview`

### Testing the game
- `RunnerGame.tsx` runs its simulation in a single `requestAnimationFrame` loop using refs (score/obstacles/physics are NOT React state) and draws everything (including the HUD score and overlays) on the canvas; only the high-score badge and status text are React state. Automated UI testers (computer-use) generally cannot tap fast/accurately enough to demonstrate smooth real-time play and their trailing key presses can cycle restarts — verify gameplay by hand, and rely on screenshots for evidence. High score persists in `localStorage` (`ship_it_hiscore`).

### Non-obvious gotchas
- **`lucide-react` v1 removed brand icons** (LinkedIn, GitHub, etc.) for trademark reasons. The LinkedIn glyph is a local inline SVG at `src/components/icons/LinkedInIcon.tsx`. Do not `import { Linkedin } from 'lucide-react'` — it will fail the build.
- **ESLint 10 + `eslint-plugin-react-hooks` v7**: that plugin still ships a flat config whose `plugins` field is a string array, which ESLint 10 rejects. `eslint.config.js` therefore registers `react-hooks` manually and spreads only its `recommended-latest` rules. Don't switch back to `extends: [reactHooks.configs['recommended-latest']]`.
- The LinkedIn profile URL in `src/data/resume.ts` is a placeholder (`https://www.linkedin.com/`) — replace it with the real public profile URL before publishing. (Automated LinkedIn login/scraping is not done here: it violates LinkedIn's Terms of Service.)
