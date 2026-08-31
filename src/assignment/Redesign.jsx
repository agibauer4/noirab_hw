import { View } from 'reshaped'
import { Section, P } from './Blocks.jsx'
import DesignCanvas from './DesignCanvas.jsx'
import OnboardingPrototype from './prototype/OnboardingPrototype.jsx'

export default function Redesign() {
  return (
    <View gap={8}>
      <Section rail="Concept" title="Desktop-first, identity early" rule={false}>
        <P>
          Open with what every merchant knows by heart, so nothing in the first screens
          sends them off to find a document. Identity then runs second by design: it is the
          largest single loss in the funnel, and reading the ID there pre-fills the name and
          address the later steps would otherwise make them type.
        </P>
      </Section>

      <DesignCanvas label="Redesigned onboarding · desktop · click through it">
        <OnboardingPrototype />
      </DesignCanvas>
    </View>
  )
}
