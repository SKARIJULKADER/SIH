// src/components/certificates/CertificateTemplate.tsx
//
// Faithful CSS/SVG recreation of the official DigiSpark "Certificate of
// Completion" design (navy & gold, guilloche paper, laurel seal, ribbon
// medal, script signature). The certificate is intentionally rendered with
// fixed "paper" colours in BOTH themes — like a real printed document — while
// the modal chrome around it stays theme-aware.
//
// The design is laid out on a fixed 1120x775 canvas and auto-scaled to fit
// its container via `CertificatePreview` (ResizeObserver + transform scale).
import { useLayoutEffect, useId, useRef, useState } from 'react'
import type { CertificateInfo } from '@/api/types'
import { cn } from '@/lib/utils'

export const CERT_DESIGN_W = 1120
export const CERT_DESIGN_H = 775

// Fixed paper palette (independent of app theme)
const NAVY = '#0e2a52'
const NAVY_2 = '#16386b'
const NAVY_DARK = '#0a1f3d'
const GOLD = '#d3a431'
const GOLD_DARK = '#b8892e'
const GOLD_LIGHT = '#ecd28a'
const PAPER = '#f8f6f0'
const INK = '#414a5c'
const MUTED = '#7d8598'

/* ------------------------------ decorations ------------------------------ */

/** Four-point spark star used in the DigiSpark logo mark */
const SparkMark = ({ size = 46 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill={GOLD} />
    <path d="M12 4.4 L13.4 10.6 L19.6 12 L13.4 13.4 L12 19.6 L10.6 13.4 L4.4 12 L10.6 10.6 Z" fill={GOLD_LIGHT} />
  </svg>
)

/** Navy corner sweep with gold arcs (top-left; mirrored via rotate-180 elsewhere) */
const CornerArt = ({ className }: { className?: string }) => (
  <svg width="290" height="290" viewBox="0 0 290 290" fill="none" className={className} aria-hidden>
    <path d="M0 0 H198 C128 50 64 126 0 226 Z" fill={NAVY} />
    <path d="M0 0 H116 C76 32 38 78 0 136 Z" fill={NAVY_DARK} />
    <path d="M220 0 C146 58 74 140 6 258" stroke={GOLD} strokeWidth="13" fill="none" strokeLinecap="round" />
    <path d="M252 6 C180 68 104 156 28 286" stroke={GOLD_DARK} strokeWidth="4" fill="none" />
    <path d="M118 0 C80 34 42 82 0 142" stroke={GOLD_LIGHT} strokeWidth="2.5" opacity="0.85" fill="none" />
  </svg>
)

/** Fine guilloche waves + rosettes printed on the paper */
const Guilloche = () => {
  const rows = Array.from({ length: 15 }, (_, i) => 55 + i * 45)
  const wave = (y: number) => {
    let d = `M-24 ${y}`
    for (let x = -24; x < CERT_DESIGN_W + 48; x += 88) d += ` q 22 -7 44 0 q 22 7 44 0`
    return d
  }
  return (
    <svg className="absolute inset-0 pointer-events-none" width={CERT_DESIGN_W} height={CERT_DESIGN_H} fill="none" aria-hidden>
      {rows.map((y) => (
        <path key={y} d={wave(y)} stroke={NAVY} strokeOpacity="0.045" strokeWidth="1" />
      ))}
      <g stroke={NAVY} strokeOpacity="0.05">
        {[215, 185, 155, 125, 95].map((r) => (
          <circle key={`tr-${r}`} cx={1020} cy={105} r={r} />
        ))}
        {[185, 155, 125, 95].map((r) => (
          <circle key={`bl-${r}`} cx={85} cy={700} r={r} />
        ))}
      </g>
    </svg>
  )
}

/** Gold corner diamond ornament for the inner frame */
const FrameCorner = ({ className }: { className?: string }) => (
  <span className={cn('absolute w-[9px] h-[9px] rotate-45 border-2', className)} style={{ borderColor: GOLD_DARK, background: PAPER }} />
)

/** Navy "DigiSpark CERTIFIED" medal with ribbon tails (upper-left) */
const Medal = () => {
  const scallops = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2
    return { x: 64 + Math.cos(a) * 57, y: 64 + Math.sin(a) * 57 }
  })
  return (
    <div className="absolute left-[84px] top-[148px] w-[128px] h-[128px]" aria-hidden>
      {/* ribbon tails */}
      <div
        className="absolute left-[20px] top-[88px] w-[36px] h-[96px]"
        style={{ background: NAVY_2, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)', transform: 'rotate(13deg)' }}
      />
      <div
        className="absolute left-[72px] top-[88px] w-[36px] h-[96px]"
        style={{ background: NAVY, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)', transform: 'rotate(-13deg)' }}
      />
      {/* medal */}
      <svg width="128" height="128" viewBox="0 0 128 128" className="absolute inset-0">
        {scallops.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5.4} fill={GOLD} />
        ))}
        <circle cx="64" cy="64" r="58" fill={GOLD} />
        <circle cx="64" cy="64" r="50" fill={NAVY} />
        <circle cx="64" cy="64" r="46" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.1" strokeDasharray="3 3" opacity="0.65" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        <span className="text-white font-bold text-[15px] font-cert">DigiSpark</span>
        <span className="text-[10.5px] tracking-[0.2em] font-semibold font-cert mt-0.5" style={{ color: GOLD_LIGHT }}>
          CERTIFIED
        </span>
        <span className="text-[10px] mt-1 tracking-[0.3em]" style={{ color: GOLD }}>
          ★★★
        </span>
      </div>
    </div>
  )
}

/* ------------------------------ seals ------------------------------------ */

/** Icon inside the laurel seal */
const SealIcon = ({ variant }: { variant: CertificateInfo['seal'] }) => {
  const clipId = useId()
  if (variant === 'python') {
    // Two-tone Python logo (halves split horizontally, like the real mark)
    const pyPath =
      'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.22.02.26.05.3.07.33.1.35.14.35.19.33.25.3.31.26.38.21.46.13.55.05.63z'
    return (
      <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <clipPath id={`${clipId}-top`}>
            <rect x="0" y="0" width="24" height="12.6" />
          </clipPath>
          <clipPath id={`${clipId}-bot`}>
            <rect x="0" y="12.6" width="24" height="11.4" />
          </clipPath>
        </defs>
        <path d={pyPath} fill="#3776ab" clipPath={`url(#${clipId}-top)`} />
        <path d={pyPath} fill="#ffd43b" clipPath={`url(#${clipId}-bot)`} />
      </svg>
    )
  }
  if (variant === 'code') {
    return (
      <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden>
        <rect x="6" y="7" width="36" height="26" rx="3" fill={NAVY} />
        <rect x="9.5" y="10.5" width="29" height="19" rx="1.5" fill="#fdfbf6" />
        <text x="24" y="24.5" textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY} fontFamily="monospace">
          {'</>'}
        </text>
        <rect x="20" y="33" width="8" height="4.5" fill={NAVY} />
        <rect x="13" y="37.5" width="22" height="3.5" rx="1.75" fill={NAVY} />
      </svg>
    )
  }
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={GOLD_DARK} aria-hidden>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
    </svg>
  )
}

/** Gold laurel wreath seal (bottom-centre) with the seal icon inside */
const LaurelSeal = ({ variant }: { variant: CertificateInfo['seal'] }) => {
  const C = 75
  const R = 57
  const angles: number[] = []
  for (let deg = -76; deg <= 76; deg += 12) angles.push(deg)
  for (let deg = 104; deg <= 256; deg += 12) angles.push(deg)
  return (
    <div className="relative w-[150px] h-[150px]" aria-hidden>
      <svg width="150" height="150" viewBox="0 0 150 150">
        {/* stems */}
        <path d={`M ${C} ${C - R} A ${R} ${R} 0 0 1 ${C} ${C + R}`} stroke={GOLD_DARK} strokeWidth="2" fill="none" />
        <path d={`M ${C} ${C - R} A ${R} ${R} 0 0 0 ${C} ${C + R}`} stroke={GOLD_DARK} strokeWidth="2" fill="none" />
        {/* leaves */}
        {angles.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x = C + Math.cos(rad) * R
          const y = C + Math.sin(rad) * R
          return (
            <g key={deg} transform={`rotate(${deg + 90} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx={3.4} ry={8.6} fill={GOLD_DARK} />
              <ellipse cx={x} cy={y} rx={1.6} ry={5.4} fill={GOLD_LIGHT} opacity="0.85" />
            </g>
          )
        })}
        {/* inner disc */}
        <circle cx={C} cy={C} r={43} fill="#fdfbf6" stroke={GOLD} strokeWidth="2.2" />
        <circle cx={C} cy={C} r={39} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" />
        <text x={C} y={C - 20} textAnchor="middle" fontSize="10" letterSpacing="3" fill={GOLD_DARK}>
          ★★★
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pt-3">
        <SealIcon variant={variant} />
      </div>
    </div>
  )
}

/* ------------------------------- template -------------------------------- */

export const CertificateTemplate = ({ info }: { info: CertificateInfo }) => (
  <div
    className="relative overflow-hidden font-cert select-none"
    style={{ width: CERT_DESIGN_W, height: CERT_DESIGN_H, background: PAPER, color: NAVY }}
  >
    <Guilloche />
    {/* corner sweeps */}
    <CornerArt className="absolute top-0 left-0" />
    <CornerArt className="absolute bottom-0 right-0 rotate-180" />

    {/* double gold frame + corner ornaments */}
    <div className="absolute inset-[22px] border rounded-[2px]" style={{ borderColor: 'rgba(184,137,46,0.55)' }} />
    <div className="absolute inset-[32px] border-[1.5px]" style={{ borderColor: GOLD_DARK }} />
    <FrameCorner className="left-[28px] top-[28px]" />
    <FrameCorner className="right-[28px] top-[28px]" />
    <FrameCorner className="left-[28px] bottom-[28px]" />
    <FrameCorner className="right-[28px] bottom-[28px]" />

    <Medal />

    {/* content column */}
    <div className="relative h-full flex flex-col items-center text-center px-[150px]">
      {/* logo lockup */}
      <div className="mt-[44px] flex items-center gap-2.5">
        <SparkMark />
        <span className="text-[46px] leading-none font-extrabold tracking-tight">
          <span style={{ color: NAVY }}>Digi</span>
          <span style={{ color: GOLD }}>Spark</span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="h-px w-[72px]" style={{ background: GOLD_DARK }} />
        <span className="text-[15px] tracking-wide" style={{ color: MUTED }}>
          Ignite Skills. Build Future.
        </span>
        <span className="h-px w-[72px]" style={{ background: GOLD_DARK }} />
      </div>

      {/* heading */}
      <h1
        className="mt-[18px] font-display font-semibold leading-none"
        style={{ fontSize: 62, letterSpacing: '0.2em', color: NAVY, marginRight: '-0.2em' }}
      >
        CERTIFICATE
      </h1>
      <div className="mt-[10px] flex items-center gap-4">
        <span className="h-px w-[64px]" style={{ background: GOLD }} />
        <span className="text-[19px] font-medium" style={{ letterSpacing: '0.42em', color: NAVY_2, marginRight: '-0.42em' }}>
          OF COMPLETION
        </span>
        <span className="h-px w-[64px]" style={{ background: GOLD }} />
      </div>

      {/* recipient */}
      <p className="mt-[16px] text-[19px]" style={{ color: MUTED }}>
        This is to certify that
      </p>
      <p className="mt-[2px] font-script leading-tight" style={{ fontSize: 60, color: NAVY }}>
        {info.recipient}
      </p>
      <div
        className="mt-[2px] h-[2.5px] w-[400px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <p className="mt-[12px] text-[18.5px] leading-[1.45]" style={{ color: MUTED }}>
        has successfully completed the training and requirements
        <br />
        to be recognized as a
      </p>

      {/* certification title */}
      <div className="mt-[10px] flex items-center gap-4 max-w-full">
        <span className="h-[2px] w-[46px] shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_DARK})` }} />
        <span className="shrink-0" style={{ color: GOLD, fontSize: 22 }}>
          ★
        </span>
        <span className="font-extrabold leading-tight" style={{ fontSize: 38, letterSpacing: '0.1em', color: NAVY }}>
          {info.title}
        </span>
        <span className="shrink-0" style={{ color: GOLD, fontSize: 22 }}>
          ★
        </span>
        <span className="h-[2px] w-[46px] shrink-0" style={{ background: `linear-gradient(90deg, ${GOLD_DARK}, transparent)` }} />
      </div>

      {/* acknowledgement */}
      <p className="mt-[10px] text-[16.5px] leading-[1.5] max-w-[680px]" style={{ color: MUTED }}>
        {info.note}
      </p>

      {/* footer */}
      <div className="mt-auto w-full flex items-end justify-between px-[6px] pb-[44px]">
        {/* details */}
        <div className="space-y-[9px] text-left text-[16px] pb-1">
          {(
            [
              ['Certificate ID', info.certificateId],
              ['Issue Date', info.issueDate],
              ['Valid Till', info.validTill],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2.5">
              <span className="w-[118px] font-bold" style={{ color: NAVY }}>
                {label}
              </span>
              <span style={{ color: NAVY }}>:</span>
              <span style={{ color: INK }}>{value}</span>
            </div>
          ))}
        </div>

        {/* seal */}
        <LaurelSeal variant={info.seal} />

        {/* signature */}
        <div className="text-center pb-1 w-[190px]">
          <p className="font-script leading-tight" style={{ fontSize: 34, color: NAVY }}>
            Rohan Mehta
          </p>
          <div className="mx-auto mt-[2px] h-px w-[150px]" style={{ background: GOLD_DARK }} />
          <p className="mt-[6px] text-[16px] font-bold" style={{ color: NAVY }}>
            Rohan Mehta
          </p>
          <p className="text-[13.5px] leading-snug" style={{ color: MUTED }}>
            Founder &amp; CEO
            <br />
            DigiSpark
          </p>
        </div>
      </div>
    </div>
  </div>
)

/* ------------------------- auto-scaling wrapper --------------------------- */

/**
 * Renders the fixed-size certificate scaled down to fit the parent width.
 * The scaled node carries `certificate-print-area` so the print stylesheet
 * can output the full-size document regardless of on-screen scale.
 */
export const CertificatePreview = ({ info, className }: { info: CertificateInfo; className?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / CERT_DESIGN_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const outerHeight = scale ? CERT_DESIGN_H * scale : undefined

  return (
    <div ref={wrapRef} className={cn('w-full relative', className)} style={{ height: outerHeight }}>
      <div
        className="certificate-print-area"
        style={{
          width: CERT_DESIGN_W,
          height: CERT_DESIGN_H,
          transform: `scale(${scale || 1})`,
          transformOrigin: 'top left',
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        <CertificateTemplate info={info} />
      </div>
    </div>
  )
}





