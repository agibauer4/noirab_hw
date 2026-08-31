import { View, Text } from 'reshaped'
import { STEPS } from './registry.js'

// A merchant who knows there are four steps and which one they're on can judge
// whether it's worth starting. The single-page form told them nothing, which is
// part of why abandonment clustered where it did.
export default function Stepper({ current, onSelect }) {
  return (
    <View direction="row" gap={0} as="ol" className="proto-stepper">
      {STEPS.map((step) => {
        const state =
          step.n === current ? 'current' : step.n < current ? 'done' : 'upcoming'
        // Only completed steps are navigable — jumping ahead to a step whose
        // inputs depend on earlier answers just produces a broken form.
        const canVisit = step.n < current

        return (
          <View.Item grow key={step.n} as="li">
            <button
              type="button"
              className={`proto-step proto-step--${state}`}
              onClick={canVisit ? () => onSelect(step.n) : undefined}
              disabled={!canVisit}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <View gap={1}>
                <View direction="row" gap={2} align="center" wrap={false}>
                  <Text variant="caption-2" monospace weight="medium">
                    {state === 'done' ? '✓' : step.n}
                  </Text>
                  <View.Item grow>
                    <Text variant="caption-1" weight={state === 'current' ? 'bold' : 'medium'}>
                      {step.title}
                    </Text>
                  </View.Item>
                </View>
                <Text variant="caption-2" color="neutral-faded">
                  {step.summary}
                </Text>
              </View>
            </button>
          </View.Item>
        )
      })}
    </View>
  )
}
