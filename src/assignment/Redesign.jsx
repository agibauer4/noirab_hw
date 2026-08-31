import { View, Text } from 'reshaped'
import { Section } from './Blocks.jsx'
import DesignCanvas from './DesignCanvas.jsx'
import OnboardingPrototype from './prototype/OnboardingPrototype.jsx'

// Placeholder for the concept summary, written once the design is settled.
function ConceptSlot() {
  return (
    <div className="concept-slot">
      <View gap={1}>
        <Text variant="caption-2" color="neutral-faded" monospace weight="medium">
          Concept — to be written
        </Text>
        <Text variant="body-3" color="neutral-faded">
          A short paragraph on what the flow does and why, once the design below is settled.
        </Text>
      </View>
    </div>
  )
}

export default function Redesign() {
  return (
    <View gap={8}>
      <Section rail="Concept" title="Desktop-first, identity early" rule={false}>
        <ConceptSlot />
      </Section>

      <DesignCanvas label="Redesigned onboarding — desktop · click through it">
        <OnboardingPrototype />
      </DesignCanvas>
    </View>
  )
}
