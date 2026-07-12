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

type Obstacle = {
  x: number
  count: number
  w: number
  kind: 'ground' | 'air'
  emoji: string
  bob: number
}
type CatPickup = { x: number; y: number; emoji: string; phase: number }
type CatPounce = { x: number; y: number; t: number }

type Status = 'idle' | 'running' | 'over'

type GameRefs = {
  status: Status
  playerY: number
  playerVy: number
  grounded: boolean
  obstacles: Obstacle[]
  catPickups: CatPickup[]
  catCharges: number
  catSpawnTimer: number
  catMessage: string
  catMessageTimer: number
  catPounce: CatPounce | null
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

// Flying "incident" obstacles: on-call sirens/pagers that cruise at head
// height, so you dodge them by staying grounded (jumping into one ends the
// run). They unlock partway into a run to keep the opening gentle.
const AIR_UNLOCK = 150 // commits before flyers start appearing
const AIR_TOP = GROUND_Y - 74
const AIR_H = 22
const BUG_EMOJI = '\uD83D\uDC1B' // 🐛
const FLYER_EMOJIS = ['\uD83D\uDEA8', '\uD83D\uDCDF'] // 🚨 incident siren, 📟 pager

const CAT_W = 30
const CAT_H = 26
const MAX_CAT_CHARGES = 3

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function intersects(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function readHiScore(): number {
  const stored = Number(localStorage.getItem(HISCORE_KEY) || 0)
  return Number.isNaN(stored) ? 0 : stored
}

export default function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)
  const audioRef = useRef<AudioContext | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [hiScore, setHiScore] = useState(readHiScore)
  const hiScoreRef = useRef(hiScore)
  const [lastScore, setLastScore] = useState(0)
  const [catCharges, setCatCharges] = useState(0)
  const [catNote, setCatNote] = useState('CatOps may join mid-run. Cats swat bugs; rockets ship code.')

  const getAudioContext = useCallback(() => {
    const AudioContextCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) return null

    const audio = audioRef.current ?? new AudioContextCtor()
    audioRef.current = audio
    return audio
  }, [])

  const primeCatOpsAudio = useCallback(() => {
    const audio = getAudioContext()
    if (audio?.state === 'suspended') void audio.resume()
  }, [getAudioContext])

  const playCatOpsMeow = useCallback(() => {
    const audio = getAudioContext()
    if (!audio) return

    if (audio.state === 'suspended') void audio.resume()

    const now = audio.currentTime
    const voice = audio.createOscillator()
    const trill = audio.createOscillator()
    const gain = audio.createGain()
    const filter = audio.createBiquadFilter()

    voice.type = 'sine'
    trill.type = 'triangle'
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(940, now)
    filter.Q.setValueAtTime(4.5, now)

    voice.frequency.setValueAtTime(760, now)
    voice.frequency.exponentialRampToValueAtTime(520, now + 0.12)
    voice.frequency.exponentialRampToValueAtTime(360, now + 0.28)
    trill.frequency.setValueAtTime(1140, now)
    trill.frequency.exponentialRampToValueAtTime(780, now + 0.2)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.16)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34)

    voice.connect(filter)
    trill.connect(filter)
    filter.connect(gain)
    gain.connect(audio.destination)
    voice.start(now)
    trill.start(now + 0.025)
    voice.stop(now + 0.35)
    trill.stop(now + 0.29)
  }, [getAudioContext])

  useEffect(() => {
    return () => {
      void audioRef.current?.close()
    }
  }, [])

  const g = useRef<GameRefs>({
    status: 'idle',
    playerY: GROUND_Y - PLAYER_H,
    playerVy: 0,
    grounded: true,
    obstacles: [],
    catPickups: [],
    catCharges: 0,
    catSpawnTimer: 5.5,
    catMessage: '',
    catMessageTimer: 0,
    catPounce: null,
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
    s.catPickups = []
    s.catCharges = 0
    s.catSpawnTimer = 5.5
    s.catMessage = ''
    s.catMessageTimer = 0
    s.catPounce = null
    s.speed = START_SPEED
    s.score = 0
    s.spawnTimer = 1.3
    setCatCharges(0)
    setCatNote('CatOps may join mid-run. Cats swat bugs; rockets ship code.')
  }, [])

  const start = useCallback(() => {
    if (g.current.status === 'running') return
    reset()
    g.current.status = 'running'
    setStatus('running')
  }, [reset])

  const jump = useCallback(() => {
    primeCatOpsAudio()

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
  }, [primeCatOpsAudio, start])

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
      const flyer = s.score >= AIR_UNLOCK && Math.random() < 0.4
      if (flyer) {
        const emoji = FLYER_EMOJIS[Math.floor(Math.random() * FLYER_EMOJIS.length)]
        s.obstacles.push({
          x: WIDTH + 10,
          count: 1,
          w: OBST_UNIT,
          kind: 'air',
          emoji,
          bob: Math.random() * Math.PI * 2,
        })
      } else {
        const count = Math.random() < 0.28 ? 2 : 1
        s.obstacles.push({
          x: WIDTH + 10,
          count,
          w: count * OBST_UNIT,
          kind: 'ground',
          emoji: BUG_EMOJI,
          bob: 0,
        })
      }
    }

    const spawnCat = () => {
      const s = g.current
      if (s.catCharges >= MAX_CAT_CHARGES || s.catPickups.length > 0) return
      s.catPickups.push({
        x: WIDTH + randBetween(20, 70),
        y: GROUND_Y - CAT_H - 4,
        emoji: Math.random() < 0.55 ? '\uD83D\uDC08\u200D\u2B1B' : '\uD83D\uDC08',
        phase: Math.random() * Math.PI * 2,
      })
    }

    const setCatMessage = (message: string) => {
      const s = g.current
      s.catMessage = message
      s.catMessageTimer = 1.75
      setCatNote(message)
    }

    const drawEmoji = (emoji: string, x: number, y: number, size: number) => {
      ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(emoji, x, y)
    }

    const update = (dt: number) => {
      const s = g.current
      if (s.status !== 'running') return

      s.speed = Math.min(MAX_SPEED, s.speed + SPEED_RAMP * dt)
      s.score += dt * (s.speed / 12)
      s.catMessageTimer = Math.max(0, s.catMessageTimer - dt)
      if (s.catPounce) {
        s.catPounce.t -= dt
        s.catPounce.x -= s.speed * dt
        if (s.catPounce.t <= 0) s.catPounce = null
      }

      // Player physics
      s.playerVy += GRAVITY * dt
      s.playerY += s.playerVy * dt
      const floor = GROUND_Y - PLAYER_H
      if (s.playerY >= floor) {
        s.playerY = floor
        s.playerVy = 0
        s.grounded = true
      }

      const playerBox = {
        x: PLAYER_X + 5,
        y: s.playerY + 4,
        w: PLAYER_W - 12,
        h: PLAYER_H - 8,
      }

      // CatOps pickups: collect a helper cat that can swat one production bug.
      s.catSpawnTimer -= dt
      if (s.catSpawnTimer <= 0) {
        spawnCat()
        s.catSpawnTimer = randBetween(8, 13) * (START_SPEED / Math.min(s.speed, MAX_SPEED))
      }
      for (const cat of s.catPickups) cat.x -= s.speed * dt * 0.92
      const remainingCats: CatPickup[] = []
      for (const cat of s.catPickups) {
        const catBox = { x: cat.x + 2, y: cat.y + 3, w: CAT_W, h: CAT_H }
        if (intersects(playerBox, catBox)) {
          s.catCharges = Math.min(MAX_CAT_CHARGES, s.catCharges + 1)
          setCatCharges(s.catCharges)
          setCatMessage('CatOps joined the release. Rollback shield armed.')
          playCatOpsMeow()
        } else if (cat.x > -50) {
          remainingCats.push(cat)
        }
      }
      s.catPickups = remainingCats

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

      // Collision (AABB with a little forgiveness). Ground bugs sit on the
      // floor; flying incidents occupy a head-height band.
      for (const o of s.obstacles) {
        const obstacleBox = {
          x: o.x + 3,
          y: o.kind === 'air' ? AIR_TOP : GROUND_Y - 22,
          w: o.w - 6,
          h: o.kind === 'air' ? AIR_H : 22,
        }
        if (intersects(playerBox, obstacleBox)) {
          if (s.catCharges > 0) {
            s.catCharges -= 1
            s.score += 25
            s.catPounce = { x: o.x - 6, y: (o.kind === 'air' ? AIR_TOP : GROUND_Y - 46), t: 0.55 }
            setCatCharges(s.catCharges)
            setCatMessage(
              o.kind === 'air'
                ? 'CatOps paged back the incident. +25 commits.'
                : 'CatOps swatted a production bug. +25 commits.',
            )
            s.obstacles = s.obstacles.filter((item) => item !== o)
            break
          }
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
      ctx.globalAlpha = 0.5
      for (const c of s.clouds) drawEmoji('\u2601\uFE0F', c.x, c.y, 22)
      ctx.globalAlpha = 1

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

      // Obstacles: ground bugs (jump over) + flying incidents (don't jump into)
      for (const o of s.obstacles) {
        if (o.kind === 'air') {
          const fb = Math.sin(Date.now() / 180 + o.bob) * 4
          drawEmoji(o.emoji, o.x, AIR_TOP - 2 + fb, 24)
        } else {
          for (let i = 0; i < o.count; i++) {
            drawEmoji(o.emoji, o.x + i * OBST_UNIT, GROUND_Y - 24, 24)
          }
        }
      }

      // CatOps pickups and pounce effect
      for (const cat of s.catPickups) {
        const trot = Math.sin(Date.now() / 140 + cat.phase) * 1.5
        drawEmoji(cat.emoji, cat.x, cat.y + trot, 24)
        ctx.fillStyle = 'rgba(251,191,36,0.82)'
        ctx.font = '700 10px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('catops', cat.x + 14, cat.y - 12 + trot)
      }
      if (s.catPounce) {
        const lift = Math.sin((1 - s.catPounce.t / 0.55) * Math.PI) * 18
        drawEmoji('\uD83D\uDC08\u200D\u2B1B', s.catPounce.x, s.catPounce.y - lift, 28)
        ctx.fillStyle = 'rgba(251,191,36,0.95)'
        ctx.font = '800 12px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('MEOW-OPS', s.catPounce.x + 20, s.catPounce.y - lift - 16)
      }

      // Player (rocket shipping code)
      const bob = s.grounded && s.status === 'running' ? Math.sin(Date.now() / 90) * 1.5 : 0
      drawEmoji('\uD83D\uDE80', PLAYER_X, s.playerY + bob, 32)

      // HUD score
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'top'
      ctx.fillText(`commits ${String(Math.floor(s.score)).padStart(5, '0')}`, WIDTH - 16, 14)
      ctx.fillStyle = 'rgba(148,163,184,0.8)'
      ctx.fillText(`best ${String(hiScoreRef.current).padStart(5, '0')}`, WIDTH - 16, 34)
      ctx.textAlign = 'left'
      ctx.fillStyle = s.catCharges > 0 ? '#fbbf24' : 'rgba(148,163,184,0.72)'
      ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillText(`catops ${s.catCharges > 0 ? '\uD83D\uDC08\u200D\u2B1B'.repeat(s.catCharges) : 'standby'}`, 16, 14)
      if (s.catMessageTimer > 0 && s.catMessage) {
        ctx.globalAlpha = Math.min(1, s.catMessageTimer)
        ctx.fillStyle = 'rgba(15,23,42,0.82)'
        const msgWidth = Math.min(440, ctx.measureText(s.catMessage).width + 28)
        ctx.fillRect(WIDTH / 2 - msgWidth / 2, 50, msgWidth, 28)
        ctx.strokeStyle = 'rgba(251,191,36,0.35)'
        ctx.strokeRect(WIDTH / 2 - msgWidth / 2, 50, msgWidth, 28)
        ctx.fillStyle = '#fde68a'
        ctx.textAlign = 'center'
        ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText(s.catMessage, WIDTH / 2, 58)
        ctx.globalAlpha = 1
      }

      // Overlays
      ctx.textAlign = 'center'
      if (s.status === 'idle') {
        ctx.fillStyle = '#38bdf8'
        ctx.font = '800 30px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('SHIP IT!', WIDTH / 2, HEIGHT / 2 - 34)
        ctx.fillStyle = '#cbd5e1'
        ctx.font = '500 15px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('Jump the bugs. Recruit CatOps. Ship the commits.', WIDTH / 2, HEIGHT / 2 - 6)
        ctx.fillStyle = 'rgba(148,163,184,0.9)'
        ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('flying incidents come in high — stay grounded, don\u2019t jump into them', WIDTH / 2, HEIGHT / 2 + 16)
        ctx.fillText('collect cats for one emergency bug swat', WIDTH / 2, HEIGHT / 2 + 34)
        ctx.fillText('press SPACE / ↑  ·  or tap  ·  to deploy', WIDTH / 2, HEIGHT / 2 + 52)
      } else if (s.status === 'over') {
        ctx.fillStyle = 'rgba(2,6,23,0.55)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.fillStyle = '#f87171'
        ctx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('\uD83D\uDEA8 ROLLBACK! Deploy failed.', WIDTH / 2, HEIGHT / 2 - 30)
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
  }, [playCatOpsMeow])

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
            ? catCharges > 0
              ? `Deploying… CatOps has ${catCharges} rollback shield${catCharges === 1 ? '' : 's'} ready.`
              : catNote
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
