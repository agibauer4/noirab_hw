import { View, Text, Card, Divider } from 'reshaped'

// A part-level heading — one rung above the Section headings inside it. Parts
// 02-04 reuse this, so the four parts of the brief stay legible as distinct
// chapters in a single scroll.
export function PartHeading({ number, title }) {
  return (
    <View gap={4} as="header">
      <hr className="part-rule" />
      <View gap={1}>
        <Text variant="caption-1" color="primary" monospace weight="medium">
          Part {number}
        </Text>
        <Text variant="featured-2" weight="bold">
          {title}
        </Text>
      </View>
    </View>
  )
}

// A titled section with a small monospace rail label above it. The rail is the
// document's structural device: it names what kind of move each section makes
// (Method / Finding 01 / Ruling out), which is information, not decoration.
// `rule` is off for the first section after a PartHeading, which already
// carries its own heavier rule — two lines in a row reads as a mistake.
export function Section({ rail, title, dek, children, rule = true }) {
  return (
    <View gap={4} as="section">
      <View gap={3}>
        {rule && <Divider />}
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

// Unnumbered on purpose: these lists are alternatives and reasons, not
// sequences, so numbering them would imply an order that isn't there.
export function Bullets({ items }) {
  return (
    <View gap={2} className="prose-measure">
      {items.map((item, i) => (
        // View wraps by default, and the body text takes its full natural width —
        // without View.Item the dash gets pushed onto its own line.
        <View key={i} direction="row" gap={3} align="start" wrap={false}>
          <Text variant="body-2" color="primary">
            —
          </Text>
          <View.Item grow>
            <Text variant="body-2">{item}</Text>
          </View.Item>
        </View>
      ))}
    </View>
  )
}
