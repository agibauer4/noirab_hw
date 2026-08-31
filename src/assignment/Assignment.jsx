import { View, Text, Container, Card, Badge, Divider } from 'reshaped'
import Diagnosis from './Diagnosis.jsx'
import { PartHeading } from './Blocks.jsx'
import { PARTS, TOPLINE } from './data.js'

function Masthead() {
  return (
    <View gap={6}>
      <View gap={4}>
        <Text variant="caption-1" color="primary" monospace weight="medium">
          Paylet · KYB onboarding · take-home assignment
        </Text>
        <Text variant="featured-1" weight="bold">
          Nobody is quitting because the form is long
        </Text>
      </View>

      <View direction="row" gap={6} wrap>
        {[
          { label: 'Dataset', value: `paylet_sessions.csv\n${TOPLINE.sessions} sessions · ${TOPLINE.users} users` },
          { label: 'Window', value: `${TOPLINE.window}\n14 days` },
          { label: 'Markets', value: 'Vesland · Korria · Aldany' },
          { label: 'Tools', value: 'Python (csv + collections)\nfor every figure quoted' },
        ].map((item) => (
          <View key={item.label} gap={1}>
            <Text variant="caption-2" color="neutral-faded" monospace weight="medium">
              {item.label.toUpperCase()}
            </Text>
            <Text
              variant="caption-1"
              color="neutral-faded"
              monospace
              attributes={{ style: { whiteSpace: 'pre-line' } }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

// The four parts of the brief. Showing all four with their status is more
// honest than hiding the ones that aren't written yet.
function PartNav() {
  return (
    <View direction="row" gap={3} wrap>
      {PARTS.map((part) => (
        <View.Item key={part.n} columns={{ s: 12, m: 6, l: 3 }}>
          <Card padding={4} height="100%" className={part.active ? 'glow-primary' : undefined}>
            <View gap={2}>
              <View direction="row" gap={2} align="center">
                <Text
                  variant="caption-1"
                  monospace
                  color={part.active ? 'primary' : 'neutral-faded'}
                >
                  {part.n}
                </Text>
                {part.active && (
                  <Badge size="small" color="primary" variant="faded">
                    {part.status}
                  </Badge>
                )}
              </View>
              <Text
                variant="body-2"
                weight={part.active ? 'semibold' : 'regular'}
                color={part.active ? 'neutral' : 'neutral-faded'}
              >
                {part.title}
              </Text>
              {!part.active && (
                <Text variant="caption-2" color="neutral-faded" monospace>
                  {part.status}
                </Text>
              )}
            </View>
          </Card>
        </View.Item>
      ))}
    </View>
  )
}

export default function Assignment() {
  return (
    <View
      className="assignment"
      backgroundColor="page"
      attributes={{ style: { minHeight: '100vh' } }}
    >
      <Container width="880px" padding={6}>
        <View gap={10} paddingBlock={{ s: 6, m: 10 }}>
          <Masthead />
          <PartNav />
          <PartHeading number="01" title="Diagnosis" />
          <Diagnosis />

          <View gap={3}>
            <Divider />
            <Text variant="caption-1" color="neutral-faded" monospace>
              Paylet is a fictional payment provider used for this exercise. Part 1 of 4 —
              Diagnose. All figures computed from paylet_sessions.csv ({TOPLINE.sessions}{' '}
              rows, {TOPLINE.window}); the funnel is reconstructed from
              last_field_completed and reconciled against recorded completions.
            </Text>
          </View>
        </View>
      </Container>
    </View>
  )
}
