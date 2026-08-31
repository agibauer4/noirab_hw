import { useEffect, useRef, useState } from 'react'
import { View, Text, Button } from 'reshaped'

/**
 * The container the redesign lives in. It's a viewport, not a figure: the
 * design inside is meant to be looked at at real size, so the canvas expands to
 * fill the window.
 *
 * This expands via CSS rather than the Fullscreen API. requestFullscreen needs
 * a user gesture, is refused outright in some embedded contexts, and in at
 * least one it returns a promise that never settles — which leaves a button
 * that looks alive and does nothing. A fixed overlay behaves identically in
 * every browser, and lets us own the Escape key and focus handling.
 */
export default function DesignCanvas({ label, children }) {
  const [expanded, setExpanded] = useState(false)
  const frameRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!expanded) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKeyDown)

    // The page behind must not scroll under the overlay.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Captured now: by cleanup time the ref may already point elsewhere.
    const trigger = triggerRef.current

    // Move focus in, so Escape and the close button are reachable by keyboard
    // and a screen reader lands inside the panel rather than behind it.
    frameRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      // Send focus back where it came from, not to the top of the document.
      trigger?.querySelector('button')?.focus()
    }
  }, [expanded])

  return (
    <View gap={2}>
      <View direction="row" gap={3} align="center">
        <View.Item grow>
          <Text variant="caption-2" color="neutral-faded" monospace weight="medium">
            {label}
          </Text>
        </View.Item>
        <div ref={triggerRef}>
          <Button size="small" variant="outline" onClick={() => setExpanded(true)}>
            View full screen
          </Button>
        </div>
      </View>

      <div
        ref={frameRef}
        className={`design-canvas${expanded ? ' design-canvas--expanded' : ''}`}
        tabIndex={expanded ? -1 : undefined}
        role={expanded ? 'dialog' : undefined}
        aria-modal={expanded ? 'true' : undefined}
        aria-label={expanded ? label : undefined}
      >
        {expanded && (
          <View direction="row" gap={3} align="center" paddingBottom={4}>
            <View.Item grow>
              <Text variant="caption-2" color="neutral-faded" monospace>
                {label} — press Esc to exit
              </Text>
            </View.Item>
            <Button size="small" variant="outline" onClick={() => setExpanded(false)}>
              Exit full screen
            </Button>
          </View>
        )}
        {children}
      </div>
    </View>
  )
}
