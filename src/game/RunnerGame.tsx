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

function drawRocket(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cy = y + s / 2
  const bx0 = x + s * 0.16
  const bx1 = x + s * 0.74
  const bh = s * 0.42

  // Exhaust flame (behind, to the left), with a little flicker
  const flick = 0.75 + Math.random() * 0.35
  ctx.fillStyle = '#fb923c'
  ctx.beginPath()
  ctx.moveTo(bx0, cy - bh * 0.32)
  ctx.lineTo(x - s * 0.26 * flick, cy)
  ctx.lineTo(bx0, cy + bh * 0.32)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#fde68a'
  ctx.beginPath()
  ctx.moveTo(bx0, cy - bh * 0.18)
  ctx.lineTo(x - s * 0.12 * flick, cy)
  ctx.lineTo(bx0, cy + bh * 0.18)
  ctx.closePath()
  ctx.fill()

  // Fins
  ctx.fillStyle = '#0369a1'
  ctx.beginPath()
  ctx.moveTo(bx0 + s * 0.14, cy - bh * 0.4)
  ctx.lineTo(bx0 - s * 0.02, cy - bh * 0.9)
  ctx.lineTo(bx0 + s * 0.3, cy - bh * 0.4)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(bx0 + s * 0.14, cy + bh * 0.4)
  ctx.lineTo(bx0 - s * 0.02, cy + bh * 0.9)
  ctx.lineTo(bx0 + s * 0.3, cy + bh * 0.4)
  ctx.closePath()
  ctx.fill()

  // Body
  ctx.fillStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.ellipse((bx0 + bx1) / 2, cy, (bx1 - bx0) / 2, bh / 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // Nose cone
  ctx.fillStyle = '#0ea5e9'
  ctx.beginPath()
  ctx.moveTo(bx1 - s * 0.02, cy - bh * 0.5)
  ctx.lineTo(x + s * 0.98, cy)
  ctx.lineTo(bx1 - s * 0.02, cy + bh * 0.5)
  ctx.closePath()
  ctx.fill()

  // Window
  ctx.fillStyle = '#0c4a6e'
  ctx.beginPath()
  ctx.arc(x + s * 0.52, cy, s * 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#7dd3fc'
  ctx.beginPath()
  ctx.arc(x + s * 0.52, cy, s * 0.06, 0, Math.PI * 2)
  ctx.fill()
}

function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cx = x + s * 0.52
  const cy = y + s * 0.54
  const rx = s * 0.36
  const ry = s * 0.3

  // Legs
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = Math.max(1, s * 0.05)
  ctx.lineCap = 'round'
  for (const dx of [-0.5, 0, 0.5]) {
    ctx.beginPath()
    ctx.moveTo(cx + rx * dx * 0.7, cy)
    ctx.lineTo(cx + rx * dx * 0.7 - s * 0.12, cy + s * 0.28)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + rx * dx * 0.7, cy)
    ctx.lineTo(cx + rx * dx * 0.7 + s * 0.12, cy + s * 0.28)
    ctx.stroke()
  }

  // Shell
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()

  // Center line
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = Math.max(1, s * 0.045)
  ctx.beginPath()
  ctx.moveTo(cx, cy - ry)
  ctx.lineTo(cx, cy + ry)
  ctx.stroke()

  // Spots
  ctx.fillStyle = '#1f2937'
  for (const [sx, sy] of [
    [-0.42, -0.25],
    [0.42, -0.25],
    [-0.42, 0.3],
    [0.42, 0.3],
  ] as const) {
    ctx.beginPath()
    ctx.arc(cx + rx * sx, cy + ry * sy, s * 0.06, 0, Math.PI * 2)
    ctx.fill()
  }

  // Head (front, facing left toward the player)
  ctx.fillStyle = '#111827'
  ctx.beginPath()
  ctx.arc(x + s * 0.14, cy, s * 0.15, 0, Math.PI * 2)
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

      // Player (rocket shipping code)
      const bob = s.grounded && s.status === 'running' ? Math.sin(Date.now() / 90) * 1.5 : 0
      drawRocket(ctx, PLAYER_X, s.playerY + bob, PLAYER_W)

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
        ctx.fillText('Jump the bugs. Ship the commits.', WIDTH / 2, HEIGHT / 2 + 2)
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
