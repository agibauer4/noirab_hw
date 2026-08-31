import { View, Text, Card } from 'reshaped'
import DataTable from './DataTable.jsx'
import { Section, P } from './Blocks.jsx'
import { MARKET_DEVICE, DEVICE_CONTROL } from './data.js'

export default function NameTheGap() {
  return (
    <View gap={10}>
      <Section
        rail="The question"
        title="Does the KYC provider accept a stored document, or require live capture?"
        rule={false}
      >
        <P>
          The ID step hands off to a verification provider and the export doesn't say what
          kind. Most accept a photo the merchant already holds; many modern ones require
          real-time capture through the device camera. Which one decides what the redesign
          has to solve.
        </P>
      </Section>

      <Section rail="Why it matters" title="It sits on the largest loss and the strangest pattern">
        <P>
          The ID step loses 32.6% of everyone who reaches it and accounts for 24.3% of all
          permanent losses. It also holds the only result here that runs backwards: mobile
          beats desktop, and only at this step.
        </P>
        <DataTable
          title="ID upload drop rate, market × device"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'desktop', header: 'Desktop', type: 'num', suffix: '%' },
            { key: 'mobile', header: 'Mobile', type: 'num', suffix: '%' },
            { key: 'gap', header: 'Gap', type: 'num' },
          ]}
          rows={MARKET_DEVICE.map((r) => ({ ...r, key: r.market }))}
        />
        <P>
          The desktop penalty holds at <strong>20-26 points in every market</strong>, while
          Korria stays roughly 10 points better on both devices. One factor attached to the
          device, another to the documents. A capture-modality requirement would produce
          exactly that.
        </P>
        <DataTable
          title="Registration number drop rate, market × device"
          subtitle="a step with no capture involved"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'desktop', header: 'Desktop', type: 'num', suffix: '%' },
            { key: 'mobile', header: 'Mobile', type: 'num', suffix: '%' },
          ]}
          rows={DEVICE_CONTROL.map((r) => ({ ...r, key: r.market }))}
        />
        <P>
          Where nothing is captured the device effect disappears, and reverses in Vesland.
          Desktop isn't a proxy for a less serious merchant.
        </P>
      </Section>

      <Section rail="The limit" title="Why the data can't close it">
        <P>
          Both modes predict desktop worse — live capture needs a webcam or a phone handoff,
          a stored file needs a scan the merchant may not have. The split confirms a{' '}
          <strong>file-production problem</strong> and stops there. Two things cut against
          the live-capture reading, neither decisive: desktop and mobile abandon after almost
          the same time (182s against 214s), where a handoff should cost desktop more; and
          the field is called “upload”.
        </P>
      </Section>

      <Section rail="What changes" title="The answer changes what gets built">
        <View direction="row" gap={3} wrap>
          {[
            {
              label: 'If live capture is required',
              body: 'The cross-device handoff becomes a first-class flow — QR to phone, state carried across, return without losing the session. Telling merchants to have their ID ready would be useless advice.',
            },
            {
              label: 'If a stored file is accepted',
              body: 'Preparation plus a competent upload component: stated limits, visible progress, specific errors, a retry that doesn’t cost the step.',
            },
          ].map((branch) => (
            <View.Item key={branch.label} columns={{ s: 12, m: 6 }}>
              <Card padding={4} height="100%">
                <View gap={2}>
                  <Text variant="caption-2" color="primary" monospace weight="medium">
                    {branch.label}
                  </Text>
                  <Text variant="body-2">{branch.body}</Text>
                </View>
              </Card>
            </View.Item>
          ))}
        </View>
        <P>One conversation with the vendor, not a research study.</P>
      </Section>
    </View>
  )
}
