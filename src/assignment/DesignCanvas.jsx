import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, Button } from 'reshaped'

/**
 * The container the redesign lives in. It's a viewport, not a figure: the
 * design inside is meant to be looked at at real size, so the canvas expands to
 * fill the screen.
 *
 * Two mechanisms, deliberately layered:
 *
 *   1. A fixed overlay, applied immediately. This always works, owns Escape and
 *      focus handling, and guarantees a full-viewport canvas.
 *   2. The Fullscreen API on top, fired and forgotten. Where it works it also
 *      hides the browser's own chrome, which the overlay can't do.
 *
 * The native call is never awaited. It needs a user gesture, is refused in some
 * embedded contexts, and in at least one returns a promise that never settles —
 * awaiting it would hang the interaction. Since the overlay has already done
 * the important part, a silent failure costs nothing.
 */
export default function DesignCanvas({ label, children }) {
  const [expanded, setExpanded] = useState(false)
  const frameRef = useRef(null)
  const triggerRef = useRef(null)
  // Tracks whether *we* put the document into native fullscreen, so an
  // unrelated fullscreenchange can't collapse the overlay.
  const nativeActiveRef = useRef(false)

  const collapse = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
    nativeActiveRef.current = false
    setExpanded(false)
  }, [])

  const expand = useCallback(() => {
    setExpanded(true)
    frameRef.current?.requestFullscreen?.().catch(() => {})
  }, [])

  // Leaving native fullscreen by any route — Escape, the browser's own control,
  // a window change — collapses the overlay too, so the two can't disagree.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement === frameRef.current) {
        nativeActiveRef.current = true
      } else if (nativeActiveRef.current) {
        nativeActiveRef.current = false
        setExpanded(false)
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    if (!expanded) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') collapse()
    }
    document.addEventListener('keydown', onKeyDown)

    // The page behind must not scroll under the overlay.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus in, so Escape and the close button are reachable by keyboard
    // and a screen reader lands inside the panel rather than behind it.
    frameRef.current?.focus()

    // Captured now: by cleanup time the ref may already point elsewhere.
    const trigger = triggerRef.current

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      // Send focus back where it came from, not to the top of the document.
      trigger?.querySelector('button')?.focus()
    }
  }, [expanded, collapse])

  return (
    <View gap={2}>
      <View direction="row" gap={3} align="center">
        <View.Item grow>
          <Text variant="caption-2" color="neutral-faded" monospace weight="medium">
            {label}
          </Text>
        </View.Item>
        <div ref={triggerRef}>
          <Button size="small" variant="outline" onClick={expand}>
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
                {label} · press Esc to exit
              </Text>
            </View.Item>
            <Button size="small" variant="outline" onClick={collapse}>
              Exit full screen
            </Button>
          </View>
        )}
        {children}
      </div>
    </View>
  )
}
