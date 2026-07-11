import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * "Ship It!" — a Chrome-dino-style endless runner themed around shipping code
 * to production. Jump the bugs, rack up commits, don't get rolled back.
 *
 * The whole simulation runs inside a single requestAnimationFrame loop using
 * refs (so we don't re-render React 60x/sec). React state is only used for the
 * high score badge and the current status, updated on discrete events.
 */

const WIDTH = 800
const HEIGHT = 260
const GROUND_Y = HEIGHT - 42
const GRAVITY = 2600 // px/s^2
const JUMP_V = -900 // px/s
const START_SPEED = 300 // px/s
const MAX_SPEED = 740
const SPEED_RAMP = 12 // px/s added per second survived
const RESTART_COOLDOWN = 700 // ms; prevents an accidental instant restart on death
const HISCORE_KEY = 'ship_it_hiscore'

type Obstacle = { x: number; count: number; w: number }

type Status = 'idle' | 'running' | 'over'

type GameRefs = {
  status: Status
  playerY: number
  playerVy: number
  grounded: boolean
  obstacles: Obstacle[]
  speed: number
  score: number
  spawnTimer: number
  groundOffset: number
  clouds: { x: number; y: number; s: number }[]
  last: number
  overAt: number
}

const PLAYER_X = 66
const PLAYER_W = 32
const PLAYER_H = 34
const OBST_UNIT = 26

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function readHiScore(): number {
  const stored = Number(localStorage.getItem(HISCORE_KEY) || 0)
  return Number.isNaN(stored) ? 0 : stored
}

// --- Vector sprites (drawn with canvas primitives so they render on every
// device; emoji drawn to <canvas> are unreliable, especially on mobile). ---

// "DevOps" the cat, brandishing a wrench. Drawn facing right within [x, y, s].
function drawDevOpsCat(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const gray = '#cbd5e1'
  const dark = '#64748b'
  const headCx = x + s * 0.6
  const headCy = y + s * 0.4
  const headR = s * 0.24

  // Tail (behind, sweeping up-left)
  ctx.strokeStyle = gray
  ctx.lineWidth = s * 0.12
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + s * 0.18, y + s * 0.72)
  ctx.quadraticCurveTo(x - s * 0.04, y + s * 0.56, x + s * 0.06, y + s * 0.32)
  ctx.stroke()

  // Body + paws
  ctx.fillStyle = gray
  ctx.beginPath()
  ctx.ellipse(x + s * 0.44, y + s * 0.68, s * 0.3, s * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + s * 0.36, y + s * 0.92, s * 0.09, s * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + s * 0.58, y + s * 0.92, s * 0.09, s * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  // Ears (outer)
  ctx.fillStyle = gray
  ctx.beginPath()
  ctx.moveTo(headCx - s * 0.2, headCy - s * 0.12)
  ctx.lineTo(headCx - s * 0.28, headCy - s * 0.4)
  ctx.lineTo(headCx - s * 0.02, headCy - s * 0.24)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(headCx + s * 0.2, headCy - s * 0.12)
  ctx.lineTo(headCx + s * 0.28, headCy - s * 0.4)
  ctx.lineTo(headCx + s * 0.02, headCy - s * 0.24)
  ctx.closePath()
  ctx.fill()
  // Ears (inner pink)
  ctx.fillStyle = '#f9a8d4'
  ctx.beginPath()
  ctx.moveTo(headCx - s * 0.17, headCy - s * 0.16)
  ctx.lineTo(headCx - s * 0.22, headCy - s * 0.33)
  ctx.lineTo(headCx - s * 0.07, headCy - s * 0.22)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(headCx + s * 0.17, headCy - s * 0.16)
  ctx.lineTo(headCx + s * 0.22, headCy - s * 0.33)
  ctx.lineTo(headCx + s * 0.07, headCy - s * 0.22)
  ctx.closePath()
  ctx.fill()

  // Head
  ctx.fillStyle = gray
  ctx.beginPath()
  ctx.arc(headCx, headCy, headR, 0, Math.PI * 2)
  ctx.fill()

  // Tabby stripes
  ctx.strokeStyle = dark
  ctx.lineWidth = s * 0.04
  ctx.beginPath()
  ctx.moveTo(headCx, headCy - headR)
  ctx.lineTo(headCx, headCy - headR * 0.35)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(headCx + s * 0.1, headCy - headR * 0.95)
  ctx.lineTo(headCx + s * 0.08, headCy - headR * 0.35)
  ctx.stroke()

  // Eyes + nose
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(headCx - s * 0.07, headCy - s * 0.01, s * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(headCx + s * 0.09, headCy - s * 0.01, s * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f472b6'
  ctx.beginPath()
  ctx.arc(headCx + s * 0.01, headCy + s * 0.07, s * 0.03, 0, Math.PI * 2)
  ctx.fill()

  // Whiskers
  ctx.strokeStyle = 'rgba(226,232,240,0.85)'
  ctx.lineWidth = Math.max(1, s * 0.02)
  for (const dy of [-0.01, 0.05]) {
    ctx.beginPath()
    ctx.moveTo(headCx + s * 0.06, headCy + s * dy)
    ctx.lineTo(headCx + s * 0.3, headCy + s * (dy - 0.03))
    ctx.stroke()
  }

  // Raised paw holding the wrench
  ctx.fillStyle = gray
  ctx.beginPath()
  ctx.arc(x + s * 0.3, y + s * 0.44, s * 0.08, 0, Math.PI * 2)
  ctx.fill()

  // Wrench (brand blue): handle + open-jaw head
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = s * 0.08
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + s * 0.3, y + s * 0.44)
  ctx.lineTo(x + s * 0.14, y + s * 0.16)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x + s * 0.1, y + s * 0.1, s * 0.08, Math.PI * 0.35, Math.PI * 2)
  ctx.stroke()
}

// A menacing "software bug" — a beetle (the original bug!) with antennae,
// segmented carapace, six legs and angry red eyes. Faces left, toward the cat.
function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cy = y + s * 0.54

  // Legs (three per side, angled)
  ctx.strokeStyle = '#0b1220'
  ctx.lineWidth = Math.max(1, s * 0.06)
  ctx.lineCap = 'round'
  for (const lx of [0.34, 0.56, 0.78]) {
    const bx = x + s * lx
    ctx.beginPath()
    ctx.moveTo(bx, cy)
    ctx.lineTo(bx - s * 0.12, cy + s * 0.3)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(bx, cy)
    ctx.lineTo(bx + s * 0.12, cy + s * 0.3)
    ctx.stroke()
  }

  // Antennae
  ctx.lineWidth = Math.max(1, s * 0.045)
  ctx.beginPath()
  ctx.moveTo(x + s * 0.2, cy - s * 0.1)
  ctx.quadraticCurveTo(x + s * 0.02, cy - s * 0.36, x - s * 0.04, cy - s * 0.22)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + s * 0.26, cy - s * 0.12)
  ctx.quadraticCurveTo(x + s * 0.12, cy - s * 0.44, x + s * 0.04, cy - s * 0.32)
  ctx.stroke()

  // Carapace (shell) with shading
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.ellipse(x + s * 0.58, cy, s * 0.34, s * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#16a34a'
  ctx.beginPath()
  ctx.ellipse(x + s * 0.58, cy + s * 0.07, s * 0.34, s * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()

  // Wing seam + highlights
  ctx.strokeStyle = '#0f5132'
  ctx.lineWidth = Math.max(1, s * 0.05)
  ctx.beginPath()
  ctx.moveTo(x + s * 0.58, cy - s * 0.28)
  ctx.lineTo(x + s * 0.58, cy + s * 0.28)
  ctx.stroke()
  ctx.fillStyle = 'rgba(220,252,231,0.7)'
  ctx.beginPath()
  ctx.arc(x + s * 0.48, cy - s * 0.1, s * 0.04, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + s * 0.7, cy - s * 0.08, s * 0.04, 0, Math.PI * 2)
  ctx.fill()

  // Head (front-left) + angry eyes
  ctx.fillStyle = '#15803d'
  ctx.beginPath()
  ctx.arc(x + s * 0.22, cy, s * 0.17, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f87171'
  ctx.beginPath()
  ctx.arc(x + s * 0.17, cy - s * 0.04, s * 0.05, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + s * 0.3, cy - s * 0.04, s * 0.05, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#450a0a'
  ctx.beginPath()
  ctx.arc(x + s * 0.17, cy - s * 0.04, s * 0.02, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + s * 0.3, cy - s * 0.04, s * 0.02, 0, Math.PI * 2)
  ctx.fill()
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = 'rgba(148,163,184,0.35)'
  ctx.beginPath()
  ctx.arc(x + s * 0.3, y + s * 0.6, s * 0.3, 0, Math.PI * 2)
  ctx.arc(x + s * 0.6, y + s * 0.45, s * 0.38, 0, Math.PI * 2)
  ctx.arc(x + s * 0.9, y + s * 0.62, s * 0.28, 0, Math.PI * 2)
  ctx.rect(x + s * 0.3, y + s * 0.62, s * 0.6, s * 0.3)
  ctx.fill()
}

function drawWarning(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = '#f87171'
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.lineTo(cx + r, cy + r * 0.8)
  ctx.lineTo(cx - r, cy + r * 0.8)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(cx - r * 0.09, cy - r * 0.42, r * 0.18, r * 0.72)
  ctx.beginPath()
  ctx.arc(cx, cy + r * 0.56, r * 0.12, 0, Math.PI * 2)
  ctx.fill()
}

export default function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)
  const [status, setStatus] = useState<Status>('idle')
  const [hiScore, setHiScore] = useState(readHiScore)
  const hiScoreRef = useRef(hiScore)
  const [lastScore, setLastScore] = useState(0)

  const g = useRef<GameRefs>({
    status: 'idle',
    playerY: GROUND_Y - PLAYER_H,
    playerVy: 0,
    grounded: true,
    obstacles: [],
    speed: START_SPEED,
    score: 0,
    spawnTimer: 0.8,
    groundOffset: 0,
    clouds: [
      { x: 200, y: 50, s: 0.4 },
      { x: 520, y: 80, s: 0.25 },
      { x: 700, y: 40, s: 0.55 },
    ],
    last: 0,
    overAt: 0,
  })

  useEffect(() => {
    hiScoreRef.current = hiScore
  }, [hiScore])

  const reset = useCallback(() => {
    const s = g.current
    s.playerY = GROUND_Y - PLAYER_H
    s.playerVy = 0
    s.grounded = true
    s.obstacles = []
    s.speed = START_SPEED
    s.score = 0
    s.spawnTimer = 1.3
  }, [])

  const start = useCallback(() => {
    if (g.current.status === 'running') return
    reset()
    g.current.status = 'running'
    setStatus('running')
  }, [reset])

  const jump = useCallback(() => {
    const s = g.current
    if (s.status === 'idle') {
      start()
      return
    }
    if (s.status === 'over') {
      if (performance.now() - s.overAt >= RESTART_COOLDOWN) start()
      return
    }
    if (s.grounded) {
      s.playerVy = JUMP_V
      s.grounded = false
    }
  }, [start])

  // Input handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.key === 'w' ||
        e.key === 'W'
      ) {
        e.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.scale(dpr, dpr)

    const endGame = () => {
      const s = g.current
      s.status = 'over'
      s.overAt = performance.now()
      const final = Math.floor(s.score)
      setLastScore(final)
      setStatus('over')
      setHiScore((prev) => {
        const next = Math.max(prev, final)
        localStorage.setItem(HISCORE_KEY, String(next))
        return next
      })
    }

    const spawn = () => {
      const s = g.current
      const count = Math.random() < 0.28 ? 2 : 1
      s.obstacles.push({ x: WIDTH + 10, count, w: count * OBST_UNIT })
    }

    const update = (dt: number) => {
      const s = g.current
      if (s.status !== 'running') return

      s.speed = Math.min(MAX_SPEED, s.speed + SPEED_RAMP * dt)
      s.score += dt * (s.speed / 12)

      // Player physics
      s.playerVy += GRAVITY * dt
      s.playerY += s.playerVy * dt
      const floor = GROUND_Y - PLAYER_H
      if (s.playerY >= floor) {
        s.playerY = floor
        s.playerVy = 0
        s.grounded = true
      }

      // Obstacles
      s.spawnTimer -= dt
      if (s.spawnTimer <= 0) {
        spawn()
        // Fair gap that stays reactable as speed increases.
        const base = randBetween(0.95, 1.5)
        s.spawnTimer = base * (START_SPEED / s.speed) + 0.45
      }
      for (const o of s.obstacles) o.x -= s.speed * dt
      s.obstacles = s.obstacles.filter((o) => o.x + o.w > -10)

      // Collision (AABB with a little forgiveness)
      const px = PLAYER_X + 5
      const py = s.playerY + 4
      const pw = PLAYER_W - 12
      const ph = PLAYER_H - 8
      const obH = 22
      for (const o of s.obstacles) {
        const ox = o.x + 3
        const oy = GROUND_Y - obH
        const ow = o.w - 6
        if (
          px < ox + ow &&
          px + pw > ox &&
          py < oy + obH &&
          py + ph > oy
        ) {
          endGame()
          break
        }
      }

      // Scenery
      s.groundOffset = (s.groundOffset + s.speed * dt) % 40
      for (const c of s.clouds) {
        c.x -= s.speed * dt * c.s * 0.25
        if (c.x < -60) {
          c.x = WIDTH + randBetween(20, 120)
          c.y = randBetween(28, 96)
          c.s = randBetween(0.2, 0.6)
        }
      }
    }

    const render = () => {
      const s = g.current

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
      grad.addColorStop(0, '#0b1220')
      grad.addColorStop(1, '#020617')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      // Clouds (parallax)
      for (const c of s.clouds) drawCloud(ctx, c.x, c.y, 34)

      // Ground line + moving dashes
      ctx.strokeStyle = 'rgba(148,163,184,0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y + 2)
      ctx.lineTo(WIDTH, GROUND_Y + 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(14,165,233,0.5)'
      ctx.lineWidth = 3
      for (let x = -40 + s.groundOffset; x < WIDTH; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, GROUND_Y + 14)
        ctx.lineTo(x + 18, GROUND_Y + 14)
        ctx.stroke()
      }

      // Obstacles (bugs)
      for (const o of s.obstacles) {
        for (let i = 0; i < o.count; i++) {
          drawBug(ctx, o.x + i * OBST_UNIT, GROUND_Y - 24, 24)
        }
      }

      // Player: "DevOps" the cat with a wrench
      const bob = s.grounded && s.status === 'running' ? Math.sin(Date.now() / 90) * 1.5 : 0
      drawDevOpsCat(ctx, PLAYER_X, s.playerY + bob, PLAYER_W)

      // HUD score
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'top'
      ctx.fillText(`commits ${String(Math.floor(s.score)).padStart(5, '0')}`, WIDTH - 16, 14)
      ctx.fillStyle = 'rgba(148,163,184,0.8)'
      ctx.fillText(`best ${String(hiScoreRef.current).padStart(5, '0')}`, WIDTH - 16, 34)

      // Overlays
      ctx.textAlign = 'center'
      if (s.status === 'idle') {
        ctx.fillStyle = '#38bdf8'
        ctx.font = '800 30px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('SHIP IT!', WIDTH / 2, HEIGHT / 2 - 34)
        ctx.fillStyle = '#cbd5e1'
        ctx.font = '500 15px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('Play as DevOps the cat — jump the bugs, ship commits.', WIDTH / 2, HEIGHT / 2 + 2)
        ctx.fillStyle = 'rgba(148,163,184,0.9)'
        ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('press SPACE / ↑  ·  or tap  ·  to deploy', WIDTH / 2, HEIGHT / 2 + 26)
      } else if (s.status === 'over') {
        ctx.fillStyle = 'rgba(2,6,23,0.55)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        drawWarning(ctx, WIDTH / 2, HEIGHT / 2 - 62, 15)
        ctx.fillStyle = '#f87171'
        ctx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('ROLLBACK! Deploy failed.', WIDTH / 2, HEIGHT / 2 - 30)
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText(`${Math.floor(s.score)} commits shipped`, WIDTH / 2, HEIGHT / 2 + 2)
        ctx.fillStyle = 'rgba(148,163,184,0.9)'
        ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('press SPACE / ↑ or tap to redeploy', WIDTH / 2, HEIGHT / 2 + 28)
      }
    }

    const frame = (t: number) => {
      const s = g.current
      if (!s.last) s.last = t
      let dt = (t - s.last) / 1000
      s.last = t
      if (dt > 0.05) dt = 0.05 // clamp to avoid tunneling on tab switch
      update(dt)
      render()
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          e.preventDefault()
          jump()
        }}
        role="img"
        aria-label="Ship It! runner game"
        className="w-full cursor-pointer touch-none rounded-xl border border-white/10"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>
          {status === 'running'
            ? 'Deploying… mind the bugs.'
            : status === 'over'
              ? `Last run: ${lastScore} commits.`
              : 'Idle. Awaiting deployment.'}
        </span>
        <span className="font-mono">
          <span className="text-brand-400">best</span> {hiScore} commits
        </span>
      </div>
    </div>
  )
}
