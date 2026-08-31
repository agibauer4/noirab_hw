import { View, Text, Card } from 'reshaped'
import DataTable from './DataTable.jsx'
import { Section, P } from './Blocks.jsx'
import {
  DEVICE_BY_STEP,
  DEVICE_BAND,
  AB_POWER,
  RECOVERY,
  TOPLINE,
  FUNNEL,
  RETRY,
} from './data.js'

// The ordering argument, one move per row. A stacked list rather than a grid:
// these are five decisions in the order a merchant meets them, and a two-column
// grid would break that reading order.
const MOVES = [
  {
    label: 'Before step 01',
    title: 'Say what they will need, before they start',
    body: 'Of the 169 sessions that abandoned at the old ID step, 3% left inside 30 seconds and 34% stayed more than five minutes. That is not refusal, it is people discovering seven fields deep that they need a physical document. One screen listing what to have ready moves that discovery to a moment when nothing is at stake.',
  },
  {
    label: 'Step 01',
    title: 'Open with what every merchant knows by heart',
    body: 'Business name and company type need no paperwork and no lookup, so the first screen can be answered from memory. The work email is the only thing added to the brief’s eight fields, and it is what makes save and resume possible at all.',
  },
  {
    label: 'Step 02',
    title: 'Run the hardest step while nothing has been invested yet',
    body: 'The ID check is the largest single loss in the funnel and 24.3% of all permanent losses. Moving it from seventh to second does not make it easier — it makes failing there cheap. It also leads with why a company registration needs a person’s ID, because the support quote says nobody knew, and it offers phone capture first with file upload always visible, because desktop drops 41.5% here against mobile’s 18.4%.',
  },
  {
    label: 'Steps 03 - 04',
    title: 'Registry data after the scan, money last',
    body: 'The registry numbers sit after identity so the document can pre-fill the name and address rather than making the merchant type them. Bank details and terms go last, where commitment is highest and the steps are cheap anyway — 10.0% and 6.0%.',
  },
  {
    label: 'Throughout',
    title: 'The words are doing as much work as the order',
    body: 'Each market gets the label its own registry uses — VAT number in Vesland, fiscal code in Aldany — with a placeholder in the real shape and a helper saying which document it is printed on. Validation names the mistake people actually make (“that looks like your VAT number”) instead of saying invalid. Vesland loses 30.3% on the two number fields against roughly 13% elsewhere on identical inputs; the difference is vocabulary, and vocabulary is free to fix.',
  },
]

function Moves() {
  return (
    <View gap={3}>
      {MOVES.map((move) => (
        <Card key={move.label} padding={4}>
          <View gap={2}>
            <Text variant="caption-2" color="primary" monospace weight="medium">
              {move.label.toUpperCase()}
            </Text>
            <Text variant="body-3" weight="semibold">
              {move.title}
            </Text>
            <Text variant="body-3" color="neutral-faded">
              {move.body}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  )
}

export default function Justify() {
  const idStep = FUNNEL.find((row) => row.worst)

  return (
    <View gap={10}>
      <Section
        rail="The order"
        title="Ordered by what it costs to fail, not by what the registry asks first"
        rule={false}
      >
        <P>
          The old form is one list in registry order, which puts the thing most likely to
          stop someone in seventh place — after six fields of investment, and with{' '}
          {RETRY.neverReturnedRate} of first-time abandoners never coming back. The redesign orders the same eight fields by what a failure at each
          point costs the merchant.
        </P>
        <Moves />
      </Section>

      <Section
        rail="The trade-off"
        title="Asking for a passport before we have earned it"
      >
        <P>
          The conventional move is the opposite of this one. You bank small commitments
          first and ask for the hard thing once someone is invested, which is an argument
          for leaving the ID check late. Putting it second asks a stranger for photo ID two
          screens in, and some people who would have complied at field seven will refuse at
          step two. I am accepting that.
        </P>
        <P>
          The reason is what a failure costs on either side of the trade. Today it is
          close to total: of {RECOVERY.firstAbandoned} people whose first session
          abandoned, {RECOVERY.everCompleted} ever completed —{' '}
          {RECOVERY.everCompletedRate}. Of the {RECOVERY.idFirstAbandoned} who first
          stopped at the ID step, {RECOVERY.idEverCompleted} finished, ever ({RECOVERY.idEverCompletedRate}).
          With no email captured and nothing saved, the old form has no way to bring anyone
          back. In the new flow a merchant who stalls at step 2 has already given a name
          and an address to write to, and their work is still there. The bet is a higher
          drop at the step in exchange for a much lower permanent loss.
        </P>
        <P>
          Two smaller things I gave up: one extra field in step 1 (the email) against the
          brief’s eight, all eight of which survive; and four steps rather than six, which
          leaves step 3 carrying three fields at once. That is the denser screen in the
          flow, and the first place I would look if step 3 misbehaves.
        </P>
      </Section>

      <Section
        rail="Before shipping"
        title="Thirty desktop merchants, step 2 on its own"
      >
        <P>
          The obvious test is the whole flow against the current form, and it is the wrong
          one to run first. At {TOPLINE.sessions} sessions in 14 days — 60 a day — split
          across two arms, this is what the traffic can settle:
        </P>
        <DataTable
          title="Sessions needed to call an A/B at this traffic"
          subtitle="80% power · 5% two-sided · 34.9% baseline completion"
          columns={[
            { key: 'lift', header: 'True lift', type: 'label' },
            { key: 'perArm', header: 'Per arm', type: 'num' },
            { key: 'total', header: 'Total', type: 'num' },
            { key: 'days', header: 'Days', type: 'num', emphasis: true },
          ]}
          rows={AB_POWER.map((row) => ({ ...row, key: row.lift }))}
          caption="An eight-point lift is readable in three weeks. A three-point one is not readable at all in any window worth waiting for — and either way the result says that something moved, not which of five changes moved it."
        />
        <P>
          So the thing I would test before shipping is the single riskiest mechanism, not
          the package: <strong>step 2 in isolation, desktop only, unmoderated</strong>,
          with a working phone handoff and around thirty merchants who have never seen it.
          The whole redesign of that step rests on one unproven claim — that a desktop
          merchant who cannot produce a file can produce a photo instead.
        </P>
        <P>
          What makes it worth running is that the failures are separable. Someone who never
          scans the code has been failed by the explanation, which is copy. Someone who
          scans, photographs, and finds the desktop screen unchanged has been failed by the
          handoff, which is engineering. Someone who completes capture and is rejected has
          been failed by the provider — which is the question Part 02 names, and no flow
          design touches it. Thirty people is not a rate, and I would not quote one from
          it. It is enough to tell those three apart, which is what decides whether this
          ships as designed.
        </P>
      </Section>

      <Section
        rail="What would change my mind"
        title="The desktop gap at the identity step"
      >
        <P>
          The diagnosis behind step 2 is that the ID upload fails at{' '}
          {idStep.rate}% because merchants cannot produce a file, and that a phone makes
          the file. That claim has one clean signature in the data: the ID upload is the
          only step in the form where the two devices come apart.
        </P>
        <DataTable
          title="Conditional drop by device, every step"
          subtitle="847 sessions · desktop 530 · mobile 317"
          columns={[
            { key: 'step', header: '', type: 'step' },
            { key: 'field', header: 'Step', type: 'label', badge: 'only divergence' },
            { key: 'desktop', header: 'Desktop', type: 'num', suffix: '%' },
            { key: 'mobile', header: 'Mobile', type: 'num', suffix: '%' },
            { key: 'gap', header: 'Gap', type: 'num', suffix: 'pp', emphasis: true },
          ]}
          rows={DEVICE_BY_STEP.map((row) => ({ ...row, key: row.step }))}
          caption={`Eight of the nine steps hold inside ${DEVICE_BAND}, in both directions. The ninth is +23.1pp.`}
        />
        <P>
          <strong>
            The metric is that gap: desktop drop minus mobile drop at the identity step.
            Today it is 23.1 points. If, once this ships, it has not closed to under 5, I
            am wrong.
          </strong>{' '}
          Five is not a round number — it is the widest gap any other step in the form
          produces ({DEVICE_BAND}, at bank details), so it is the noise this form makes
          when nothing device-specific is going on.
        </P>
        <P>
          I am naming the gap rather than the drop rate on purpose. The redesign changes
          who reaches the identity step — today only 519 of 847 sessions get to field 7,
          and they are the ones who survived six fields first, so the step’s raw rate is
          measured on a filtered, more determined population. Moving it to second removes
          that filter, and the same obstacle would post a worse-looking number for reasons
          that have nothing to do with the design. The gap is immune to that: desktop and
          mobile are filtered identically inside whichever cohort you measure.
        </P>
        <P>
          If the gap closes, the file was the problem and the handoff solved it. If it
          stays wide while the copy and preparation land — merchants arriving with the
          document ready and still failing on desktop — then the loss is downstream at the
          verification provider, the ordering argument above is solving the wrong thing,
          and the fix is a vendor conversation rather than a flow.
        </P>
      </Section>

      <Section rail="Not built" title="Where the remaining time would have gone">
        <P>
          This flow is designed desktop-first, because desktop is where the losses are —
          not because mobile is fine. What I have not designed is the mobile flow proper.
          Four steps of this density is a desktop shape; the same content on a phone wants
          to be broken down further, one decision per screen, and it wants to assume a
          native app rather than a browser tab — which changes what the identity step even
          is, since the camera is already in the merchant’s hand and there is nothing to
          hand off to. That is the next thing I would draw.
        </P>
      </Section>
    </View>
  )
}
