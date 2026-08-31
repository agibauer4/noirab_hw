// Draw-in success mark. `pathLength="100"` normalises every path to the same
// length, so one dash value animates both the ring and the glyph regardless of
// their real geometry.
//
// Two tones, because the two endings are genuinely different: a verified ID
// means the account is open, an uploaded one means it is still being checked.
// A green tick on a pending account would be a lie.
export default function StatusMark({ tone = 'positive', size = 76 }) {
  const stroke =
    tone === 'positive'
      ? 'var(--rs-color-background-positive)'
      : 'var(--rs-color-background-warning)'

  return (
    <div className={`status-mark status-mark--${tone}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r="28"
          pathLength="100"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          className="status-mark-ring"
        />
        {tone === 'positive' ? (
          <path
            d="M21 33.5 L28.5 41 L43.5 24"
            pathLength="100"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="status-mark-glyph"
          />
        ) : (
          // Clock hands — "in progress", not "done".
          <path
            d="M32 19 L32 32.5 L41 38"
            pathLength="100"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="status-mark-glyph"
          />
        )}
      </svg>
    </div>
  )
}
