import { View, Text, Card, Divider } from 'reshaped'

// A titled section with a small monospace rail label above it. The rail is the
// document's structural device: it names what kind of move each section makes
// (Method / Finding 01 / Ruling out), which is information, not decoration.
export function Section({ rail, title, dek, children }) {
  return (
    <View gap={4} as="section">
      <View gap={3}>
        <Divider />
        <Text variant="caption-2" color="primary" monospace weight="medium">
          {rail}
        </Text>
      </View>
      <View gap={2}>
        <Text variant="featured-3" weight="bold">
          {title}
        </Text>
        {dek && (
          <Text variant="body-2" color="neutral-faded" className="prose-measure">
            {dek}
          </Text>
        )}
      </View>
      <View gap={4}>{children}</View>
    </View>
  )
}

// Body copy, held to a comfortable reading measure.
export function P({ children }) {
  return (
    <Text variant="body-2" className="prose-measure">
      {children}
    </Text>
  )
}

export function H3({ children }) {
  return (
    <Text variant="body-1" weight="semibold">
      {children}
    </Text>
  )
}

export function Stats({ items }) {
  return (
    <View direction="row" gap={3} wrap>
      {items.map((item) => (
        <View.Item key={item.label} columns={{ s: 12, m: 6, l: 3 }}>
          <Card padding={4} height="100%">
            <View gap={1}>
              <Text
                variant="featured-2"
                weight="bold"
                color={item.bad ? 'warning' : 'neutral'}
              >
                {item.value}
              </Text>
              <Text variant="caption-1" color="neutral-faded" monospace>
                {item.label}
              </Text>
            </View>
          </Card>
        </View.Item>
      ))}
    </View>
  )
}

export function Quote({ children, source = 'Paylet support' }) {
  return (
    <View className="assignment-quote prose-measure" gap={2}>
      <Text variant="body-2" color="neutral-faded">
        <em>{children}</em>
      </Text>
      <Text variant="caption-2" color="neutral-faded" monospace>
        {source}
      </Text>
    </View>
  )
}

// The read on a finding — what I think the data means, kept visually distinct
// from the evidence that supports it.
export function Verdict({ heading = 'What I think is happening', children }) {
  return (
    <Card padding={4} className="glow-primary">
      <View gap={2}>
        <Text variant="caption-2" color="primary" monospace weight="medium">
          {heading}
        </Text>
        {children}
      </View>
    </Card>
  )
}

// A caveat or aside — flagged, but deliberately quieter than a Verdict.
export function Note({ heading, children }) {
  return (
    <Card padding={4}>
      <View gap={2}>
        <Text variant="caption-2" color="neutral-faded" monospace weight="medium">
          {heading}
        </Text>
        {children}
      </View>
    </Card>
  )
}

export function Bullets({ items }) {
  return (
    <View gap={3} className="prose-measure">
      {items.map((item, i) => (
        <View key={i} direction="row" gap={3} align="start">
          <Text variant="caption-1" color="primary" monospace>
            {String(i + 1).padStart(2, '0')}
          </Text>
          <Text variant="body-2">{item}</Text>
        </View>
      ))}
    </View>
  )
}
