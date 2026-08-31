import { useMemo } from 'react'

const SIZE = 25
const QUIET = 2 // Quiet zone — real codes need clear margin to be readable.

// A QR-shaped placeholder: correct anatomy (three finder patterns, an alignment
// pattern, timing rows) with deterministic noise in the data area. It isn't a
// valid code and won't resolve if anyone scans it — this is a prototype, not a
// live handoff — but it reads as a QR at a glance, which is what the screen
// needs to communicate.
function buildModules() {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))
  const alignAt = SIZE - 9

  // The three big corner squares: 7x7 ring with a 3x3 core.
  const finder = (row, col) => {
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        const ring = i === 0 || i === 6 || j === 0 || j === 6
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
        grid[row + i][col + j] = ring || core
      }
    }
  }
  finder(0, 0)
  finder(0, SIZE - 7)
  finder(SIZE - 7, 0)

  // Smaller alignment square near the bottom-right.
  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const ring = i === 0 || i === 4 || j === 0 || j === 4
      grid[alignAt + i][alignAt + j] = ring || (i === 2 && j === 2)
    }
  }

  // Timing patterns: alternating modules bridging the finders.
  for (let i = 8; i < SIZE - 8; i += 1) {
    grid[6][i] = i % 2 === 0
    grid[i][6] = i % 2 === 0
  }

  // Data area. Seeded so the pattern is stable across renders rather than
  // flickering into a new code on every state change.
  let seed = 20260831
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  const reserved = (r, c) =>
    (r < 9 && c < 9) ||
    (r < 9 && c >= SIZE - 8) ||
    (r >= SIZE - 8 && c < 9) ||
    (r >= alignAt - 1 && r <= alignAt + 5 && c >= alignAt - 1 && c <= alignAt + 5) ||
    r === 6 ||
    c === 6

  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (!reserved(r, c)) grid[r][c] = random() > 0.5
    }
  }

  return grid
}

export default function FakeQr({ size = 168 }) {
  // One path for the whole code rather than ~400 rects.
  const path = useMemo(() => {
    const grid = buildModules()
    let d = ''
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (grid[r][c]) d += `M${c + QUIET} ${r + QUIET}h1v1h-1z`
      }
    }
    return d
  }, [])

  const span = SIZE + QUIET * 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label="QR code to continue on your phone"
      shapeRendering="crispEdges"
    >
      {/* QR codes are read as dark-on-light regardless of the surrounding UI
          theme, so this keeps its own light ground rather than inheriting the
          dark surface behind it. */}
      <rect width={span} height={span} rx="1.5" fill="#FFFFFF" />
      <path d={path} fill="#0B0E13" />
    </svg>
  )
}
