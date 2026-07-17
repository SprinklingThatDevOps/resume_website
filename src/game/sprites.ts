/**
 * Canvas vector sprites for Ship It!
 *
 * Emoji drawn via fillText are unreliable on many mobile browsers (blank/tofu).
 * These primitives render consistently across desktop and mobile.
 */

export function drawRocket(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
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

export function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
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

export function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = 'rgba(148,163,184,0.35)'
  ctx.beginPath()
  ctx.arc(x + s * 0.3, y + s * 0.6, s * 0.3, 0, Math.PI * 2)
  ctx.arc(x + s * 0.6, y + s * 0.45, s * 0.38, 0, Math.PI * 2)
  ctx.arc(x + s * 0.9, y + s * 0.62, s * 0.28, 0, Math.PI * 2)
  ctx.rect(x + s * 0.3, y + s * 0.62, s * 0.6, s * 0.3)
  ctx.fill()
}

export function drawWarning(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
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

/** Flying incident: siren beacon (🚨 stand-in). */
export function drawSiren(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cx = x + s * 0.5
  const cy = y + s * 0.55

  // Glow
  ctx.fillStyle = 'rgba(248,113,113,0.22)'
  ctx.beginPath()
  ctx.arc(cx, cy - s * 0.05, s * 0.42, 0, Math.PI * 2)
  ctx.fill()

  // Dome
  ctx.fillStyle = '#f87171'
  ctx.beginPath()
  ctx.ellipse(cx, cy - s * 0.08, s * 0.28, s * 0.26, 0, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = '#fecaca'
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.08, cy - s * 0.16, s * 0.1, s * 0.08, -0.4, 0, Math.PI * 2)
  ctx.fill()

  // Base
  ctx.fillStyle = '#334155'
  ctx.fillRect(cx - s * 0.32, cy + s * 0.02, s * 0.64, s * 0.16)
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(cx - s * 0.36, cy + s * 0.16, s * 0.72, s * 0.1)
}

/** Flying incident: pager (📟 stand-in). */
export function drawPager(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const left = x + s * 0.12
  const top = y + s * 0.18
  const w = s * 0.76
  const h = s * 0.64

  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.roundRect(left, top, w, h, s * 0.08)
  ctx.fill()

  ctx.fillStyle = '#86efac'
  ctx.fillRect(left + s * 0.1, top + s * 0.1, w - s * 0.2, h * 0.42)

  ctx.fillStyle = '#1e293b'
  ctx.font = `700 ${Math.max(8, s * 0.22)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('PAGE', left + w / 2, top + h * 0.3)

  // Buttons
  ctx.fillStyle = '#94a3b8'
  ctx.beginPath()
  ctx.arc(left + w * 0.3, top + h * 0.72, s * 0.06, 0, Math.PI * 2)
  ctx.arc(left + w * 0.7, top + h * 0.72, s * 0.06, 0, Math.PI * 2)
  ctx.fill()
}

export function drawCat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  dark = false,
) {
  const cx = x + s * 0.5
  const cy = y + s * 0.55
  const body = dark ? '#1e293b' : '#f8fafc'
  const accent = dark ? '#fbbf24' : '#94a3b8'
  const eye = dark ? '#fde68a' : '#0f172a'

  // Ears
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.28, cy - s * 0.18)
  ctx.lineTo(cx - s * 0.38, cy - s * 0.48)
  ctx.lineTo(cx - s * 0.08, cy - s * 0.28)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.28, cy - s * 0.18)
  ctx.lineTo(cx + s * 0.38, cy - s * 0.48)
  ctx.lineTo(cx + s * 0.08, cy - s * 0.28)
  ctx.closePath()
  ctx.fill()

  // Head / body
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.ellipse(cx, cy, s * 0.34, s * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  ctx.fillStyle = eye
  ctx.beginPath()
  ctx.arc(cx - s * 0.12, cy - s * 0.04, s * 0.05, 0, Math.PI * 2)
  ctx.arc(cx + s * 0.12, cy - s * 0.04, s * 0.05, 0, Math.PI * 2)
  ctx.fill()

  // Nose
  ctx.fillStyle = '#fb7185'
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 0.04)
  ctx.lineTo(cx - s * 0.05, cy + s * 0.1)
  ctx.lineTo(cx + s * 0.05, cy + s * 0.1)
  ctx.closePath()
  ctx.fill()

  // Whiskers
  ctx.strokeStyle = accent
  ctx.lineWidth = Math.max(1, s * 0.04)
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.08, cy + s * 0.08)
  ctx.lineTo(cx - s * 0.38, cy + s * 0.02)
  ctx.moveTo(cx - s * 0.08, cy + s * 0.12)
  ctx.lineTo(cx - s * 0.38, cy + s * 0.14)
  ctx.moveTo(cx + s * 0.08, cy + s * 0.08)
  ctx.lineTo(cx + s * 0.38, cy + s * 0.02)
  ctx.moveTo(cx + s * 0.08, cy + s * 0.12)
  ctx.lineTo(cx + s * 0.38, cy + s * 0.14)
  ctx.stroke()
}

/** Critical CVE / vuln scanner hit. */
export function drawCve(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const left = x + s * 0.1
  const top = y + s * 0.18
  const w = s * 0.8
  const h = s * 0.64

  ctx.fillStyle = '#7f1d1d'
  ctx.beginPath()
  ctx.roundRect(left, top, w, h, s * 0.08)
  ctx.fill()

  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = Math.max(1.5, s * 0.06)
  ctx.stroke()

  ctx.fillStyle = '#fecaca'
  ctx.font = `800 ${Math.max(9, s * 0.28)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('CVE', left + w / 2, top + h * 0.38)

  ctx.fillStyle = '#fca5a5'
  ctx.font = `700 ${Math.max(7, s * 0.18)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillText('CRIT', left + w / 2, top + h * 0.72)
}

/** Zero-trust / policy deny shield. */
export function drawPolicyDeny(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cx = x + s * 0.5
  const top = y + s * 0.12

  ctx.fillStyle = '#1d4ed8'
  ctx.beginPath()
  ctx.moveTo(cx, top)
  ctx.lineTo(cx + s * 0.34, top + s * 0.16)
  ctx.lineTo(cx + s * 0.28, top + s * 0.55)
  ctx.quadraticCurveTo(cx, top + s * 0.78, cx - s * 0.28, top + s * 0.55)
  ctx.lineTo(cx - s * 0.34, top + s * 0.16)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = Math.max(1.5, s * 0.05)
  ctx.stroke()

  // Deny slash
  ctx.strokeStyle = '#f87171'
  ctx.lineWidth = Math.max(2, s * 0.09)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.16, top + s * 0.22)
  ctx.lineTo(cx + s * 0.16, top + s * 0.58)
  ctx.stroke()

  ctx.fillStyle = '#fee2e2'
  ctx.font = `800 ${Math.max(8, s * 0.2)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('DENY', cx, top + s * 0.42)
}

/** Expired TLS certificate. */
export function drawExpiredCert(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const left = x + s * 0.18
  const top = y + s * 0.12
  const w = s * 0.64
  const h = s * 0.72

  ctx.fillStyle = '#fef3c7'
  ctx.beginPath()
  ctx.moveTo(left, top)
  ctx.lineTo(left + w * 0.7, top)
  ctx.lineTo(left + w, top + h * 0.22)
  ctx.lineTo(left + w, top + h)
  ctx.lineTo(left, top + h)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#fde68a'
  ctx.beginPath()
  ctx.moveTo(left + w * 0.7, top)
  ctx.lineTo(left + w, top + h * 0.22)
  ctx.lineTo(left + w * 0.7, top + h * 0.22)
  ctx.closePath()
  ctx.fill()

  // Lock body
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = Math.max(1.5, s * 0.06)
  ctx.beginPath()
  ctx.arc(left + w * 0.5, top + h * 0.38, s * 0.1, Math.PI, 0)
  ctx.stroke()
  ctx.fillStyle = '#d97706'
  ctx.fillRect(left + w * 0.32, top + h * 0.4, w * 0.36, h * 0.22)

  ctx.fillStyle = '#92400e'
  ctx.font = `800 ${Math.max(7, s * 0.16)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TLS', left + w * 0.5, top + h * 0.78)
}

/** Leaked secret / API key badge. */
export function drawLeakedSecret(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const cx = x + s * 0.5
  const cy = y + s * 0.5

  // Key head
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(cx - s * 0.18, cy, s * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(cx - s * 0.18, cy, s * 0.08, 0, Math.PI * 2)
  ctx.fill()

  // Shaft + teeth
  ctx.fillStyle = '#fbbf24'
  ctx.fillRect(cx - s * 0.02, cy - s * 0.06, s * 0.42, s * 0.12)
  ctx.fillRect(cx + s * 0.22, cy + s * 0.06, s * 0.08, s * 0.14)
  ctx.fillRect(cx + s * 0.34, cy + s * 0.06, s * 0.08, s * 0.1)

  // Alert pip
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(cx + s * 0.28, cy - s * 0.22, s * 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = `800 ${Math.max(7, s * 0.16)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('!', cx + s * 0.28, cy - s * 0.22)
}

export type FlyerKind = 'siren' | 'pager' | 'cve' | 'policy' | 'cert' | 'secret'

export function drawFlyer(
  ctx: CanvasRenderingContext2D,
  kind: FlyerKind,
  x: number,
  y: number,
  s: number,
) {
  switch (kind) {
    case 'pager':
      drawPager(ctx, x, y, s)
      break
    case 'cve':
      drawCve(ctx, x, y, s)
      break
    case 'policy':
      drawPolicyDeny(ctx, x, y, s)
      break
    case 'cert':
      drawExpiredCert(ctx, x, y, s)
      break
    case 'secret':
      drawLeakedSecret(ctx, x, y, s)
      break
    case 'siren':
    default:
      drawSiren(ctx, x, y, s)
      break
  }
}
