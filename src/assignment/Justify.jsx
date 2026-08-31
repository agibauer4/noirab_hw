import { View } from 'reshaped'
import DataTable from './DataTable.jsx'
import { Section, P, Bullets } from './Blocks.jsx'
import {
  DEVICE_BY_STEP,
  DEVICE_BAND,
  RECOVERY,
  RETRY,
  ID_UPLOAD_BY_MARKET,
} from './data.js'

// The brief asks for one page here, so this is deliberately the shortest of the
// four parts. Anything already argued in Parts 01-03 is referenced rather than
// restated, and the one table left standing is the one a decision hangs on.
export default function Justify() {
  // Same source as the Part 01 table, so the market figures can't drift apart.
  // toFixed keeps 38.0 from printing as "38" beside 25.3 and 35.7.
  const idRate = Object.fromEntries(
    ID_UPLOAD_BY_MARKET.map((row) => [row.market.toLowerCase(), row.rate.toFixed(1)])
  )

  return (
    <View gap={10}>
      <Section
        rail="The order"
        title="Ordered by what a failure costs, not by what the registry asks first"
        rule={false}
      >
        <P>
          The old form runs in registry order, so the step most likely to stop someone
          comes seventh, after six fields of investment, with {RETRY.neverReturnedRate} of
          first-time abandoners never coming back.
        </P>
        <Bullets
          items={[
            'A welcome screen lists what they will need. Only 3% of the 169 who abandoned at the old ID step left inside 30 seconds: unprepared, not unwilling, and seven fields deep is a bad place to find that out.',
            'Step 1 asks only what a merchant knows by heart. The work email is the one addition to the brief’s eight fields, and it is what makes save and resume possible.',
            'Identity runs second, not seventh. Running the biggest loss early does not make it easier, it makes failing there cheap. Phone capture leads, because desktop drops 41.5% here against mobile’s 18.4%.',
            'Registry numbers follow the scan, so the document pre-fills name and address. Bank details and terms go last, where commitment is highest and the steps are cheap anyway.',
            'Each market gets its own registry’s words (VAT number in Vesland, fiscal code in Aldany) with real-shape placeholders and errors that name the likely mistake. Vesland loses 30.3% on the two number fields against roughly 13% elsewhere: vocabulary, not translation.',
          ]}
        />
      </Section>

      <Section rail="The trade-off" title="Asking for a passport before we have earned it">
        <P>
          Convention says bank small commitments first and ask for the hard thing late.
          Putting identity second will lose people who would have complied at field seven.
          I accept that, because today a failure there is near-permanent: of{' '}
          {RECOVERY.firstAbandoned} people whose first session abandoned,{' '}
          {RECOVERY.everCompleted} ever completed. With an email captured and their work
          saved, that drop becomes recoverable: a higher drop at the step for a lower
          permanent loss. Smaller costs: one extra field, and step 3 carrying three at
          once.
        </P>
      </Section>

      <Section rail="Before shipping" title="One phone call, then one test">
        <P>
          <strong>The call.</strong> Does the provider accept identity documents from all
          three markets? Korria drops {idRate.korria}% at the ID step against Vesland’s{' '}
          {idRate.vesland}% and Aldany’s {idRate.aldany}%, and keeps that advantage on both
          devices, a market factor independent of the device one. If some regional
          documents are not accepted, no copy or preparation fixes it: change provider, or
          give the weakest markets a second route to the same check.
        </P>
        <P>
          <strong>The test.</strong> Step 2 on its own, desktop, unmoderated, around
          thirty merchants recruited across Vesland, Korria and Aldany, each using their
          own market’s ID. The spread is the point: it shows whether the handoff works in
          all three markets or only where the documents already pass. Thirty people is a
          read on mechanism rather than a rate, and it separates the three failures: never
          scanned the code (copy), scanned and photographed but the desktop never updated
          (engineering), captured and rejected (the provider). It runs in days, where an
          A/B on the whole flow needs three weeks at this traffic to see even an
          eight-point move.
        </P>
      </Section>

      <Section
        rail="What would change my mind"
        title="The desktop gap at the identity step"
      >
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
            It is 23.1 points today. If it has not closed to under 5 once this ships, I am
            wrong.
          </strong>{' '}
          Five is the widest gap any other step produces, so it is the noise this form
          makes when nothing device-specific is going on.
        </P>
        <P>
          I name the gap and not the step’s drop rate because the redesign changes who
          reaches that step. Today only 519 of 847 sessions survive six fields to get
          there, so raw rates are not comparable across the change, while a within-cohort
          device comparison is. If it stays wide with merchants arriving prepared, the loss
          is downstream at the provider.
        </P>
      </Section>

      <Section rail="Not built" title="Where the remaining time would have gone">
        <P>
          The mobile flow. Four steps of this density is a desktop shape; on a phone it
          wants breaking down further, one decision per screen, and it wants a native app
          rather than a browser tab, which changes what step 2 even is, with the camera
          already in hand.
        </P>
      </Section>
    </View>
  )
}
