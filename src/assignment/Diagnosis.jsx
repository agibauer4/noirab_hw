import { View } from 'reshaped'
import DataTable from './DataTable.jsx'
import { Section, P, H3, Stats, Quote, Bullets } from './Blocks.jsx'
import {
  TOPLINE,
  FUNNEL,
  UPLOAD_TIME,
  UPLOAD_TIME_STATS,
  ID_UPLOAD_BY_MARKET,
  SIGNATURES,
  BY_MARKET,
  MARKET_SIZES,
  MARKET_COMPLETION,
  NUMBER_FIELD_LOSS,
  NUMBER_FIELD_LOSS_ALL,
  REG_NUMBER_TIME,
  MARKET_MIX,
  RETRY,
  PERMANENT_LOSSES,
  BY_DEVICE,
  DEVICE_COMPLETION,
  BY_COMPANY_TYPE,
  SOLE_TRADER_COMPLETION,
  QUOTES,
} from './data.js'

// Bars are scaled to a fixed ceiling per figure rather than to each figure's
// own maximum, so a long bar means the same thing everywhere on the page.
const FUNNEL_MAX = 40
const SHARE_MAX = 70
const LOSS_MAX = 40
const PERMANENT_MAX = 25
const UPLOAD_MAX = 45

export default function Diagnosis() {
  return (
    <View gap={10}>
      {/* ---------------- summary ---------------- */}
      <Section rail="Summary" title="Five findings" rule={false}>
        <P>
          {TOPLINE.sessionRate} of sessions complete. The loss isn't spread across a long
          form. Six of the nine steps drop under 10%, and three specific points do the
          damage.
        </P>
        <Bullets
          items={[
            <>
              <strong>The ID upload is where it breaks.</strong> 32.6% of everyone who
              reaches it abandons, 2.4× the next worst step. Only 3% leave inside 30
              seconds, so this is failure under effort, not refusal.
            </>,
            <>
              <strong>Vesland loses merchants on the two registry-number fields.</strong>{' '}
              30.3% against roughly 13% in the other markets, and it survives a company-type
              control. Not a language barrier: Vesland is at parity across the rest of the
              form.
            </>,
            <>
              <strong>73% of people who abandon never come back.</strong> With no save or
              resume, one bad step ends the relationship: {RETRY.startedOnce} of{' '}
              {TOPLINE.users} users started exactly once.
            </>,
            <>
              <strong>Desktop fails at the upload far more than mobile</strong>: 41.5%
              against 18.4%. It matches mobile everywhere else. The obstacle is
              producing a file.
            </>,
            <>
              <strong>Sole traders drop hardest at the ID step</strong> (42.8%), where they
              are asked to prove a beneficial owner's identity after already giving their
              own name.
            </>,
          ]}
        />
      </Section>

      {/* ---------------- topline ---------------- */}
      <Section rail="Topline" title="Where it stands">
        <Stats
          items={[
            { value: TOPLINE.sessionRate, label: `of sessions complete (${TOPLINE.completedSessions} / ${TOPLINE.sessions})` },
            { value: TOPLINE.userRate, label: `of people complete (${TOPLINE.completedSessions} / ${TOPLINE.users} users)` },
            { value: TOPLINE.neverCompletedRate, label: `never get through at all (${TOPLINE.neverCompleted} users)`, bad: true },
            { value: TOPLINE.worstStepRate, label: 'drop at ID upload, the worst single step', bad: true },
          ]}
        />
        <P>
          Session and person rates differ because {TOPLINE.repeatUsers} people started more
          than once. Finding 03 covers why that number is so low.
        </P>
      </Section>

      {/* ---------------- funnel ---------------- */}
      <Section
        rail="The funnel"
        title="Three walls, not a slope"
        dek="Fatigue would produce a gentle rise. Six of the nine steps sit under 10% and the losses concentrate in three places."
      >
        <P>
          Every session reaches field 1 but only 519 of 847 reach field 7, so raw drop
          counts rank reach, not difficulty. Every rate here is <strong>conditional</strong>:{' '}
          drops divided by the sessions that got there.
        </P>
        <DataTable
          title="Conditional drop rate by step"
          subtitle={`${TOPLINE.sessions} sessions · ${TOPLINE.window}`}
          columns={[
            { key: 'step', header: '', type: 'step' },
            { key: 'field', header: 'Step', type: 'label', badge: 'worst' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'dropped', header: 'Dropped', type: 'num' },
            { key: 'rate', header: 'Drop rate', type: 'bar', max: FUNNEL_MAX },
          ]}
          rows={FUNNEL.map((r) => ({ ...r, key: r.field }))}
          caption="Bars scaled to a 40% ceiling; every bar is labelled, so the figure reads without colour. Reached counts are reconstructed from last_field_completed and reconcile exactly to the 296 recorded completions."
        />
        <P>
          ID document upload is <strong>2.4× worse than the next worst step</strong>. A
          third of everyone who reaches field 7 abandons there, after completing six fields.
        </P>
      </Section>

      {/* ---------------- finding 01 ---------------- */}
      <Section
        rail="Finding 01"
        title="The ID upload is a failed attempt, not a refusal"
      >
        <DataTable
          title="Time on ID upload before abandoning"
          subtitle="169 abandoned sessions"
          columns={[
            { key: 'band', header: 'Time on field', type: 'label' },
            { key: 'sessions', header: 'Sessions', type: 'num' },
            { key: 'share', header: 'Share', type: 'bar', max: SHARE_MAX, decimals: 0 },
          ]}
          rows={UPLOAD_TIME.map((r) => ({ ...r, key: r.band }))}
          caption={`Median ${UPLOAD_TIME_STATS.median}, mean ${UPLOAD_TIME_STATS.mean}. The longest session sat on this one field for ${UPLOAD_TIME_STATS.maxMinutes} and still left.`}
        />
        <P>
          3% leave inside 30 seconds; 34% spend more than five minutes. That is effort, not
          objection.
        </P>
        <Quote>{QUOTES.identity}</Quote>
        <P>Three mechanisms fit:</P>
        <Bullets
          items={[
            <>
              <strong>Not prepared.</strong> The merchant leaves to find the document and
              loses the session while they're gone.
            </>,
            <>
              <strong>The upload flow fails them.</strong> No progress, no stated size or
              format limits, silent errors. Someone holding the document can still fail
              here.
            </>,
            <>
              <strong>The document is rejected downstream.</strong> A KYC provider that
              doesn't handle certain regional ID types would fail some markets and not
              others.
            </>,
          ]}
        />

        <H3>The third has a fingerprint, and it shows up</H3>
        <DataTable
          title="ID upload drop rate by market"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'dropped', header: 'Dropped', type: 'num' },
            { key: 'rate', header: 'Drop at ID upload', type: 'bar', max: UPLOAD_MAX },
          ]}
          rows={ID_UPLOAD_BY_MARKET.map((r) => ({ ...r, key: r.market }))}
          caption="Bars scaled to a 45% ceiling."
        />
        <DataTable
          title="Two different market signatures"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'numberFields', header: 'Number-field loss', type: 'num', suffix: '%' },
            { key: 'idUpload', header: 'ID-upload drop', type: 'num', suffix: '%' },
          ]}
          rows={SIGNATURES.map((r) => ({ ...r, key: r.market }))}
        />
        <P>
          The groupings differ. On the number fields Vesland alone is the outlier, with
          Korria and Aldany near-identical (13.3% / 12.7%). At the upload Korria alone is
          the good one and those same two markets are ten points apart (25.3% / 35.7%). Two
          different shapes point to two different causes, consistent with Korrian documents
          working better with whatever verifies them, though there is no provider or
          document-type column to confirm it.
        </P>
        <P>
          The step fails people who are <strong>trying to comply</strong>. Which of the
          three mechanisms is doing the damage isn't visible here: no column separates a
          walk-away from a retry loop, so eleven minutes looks the same whether someone went
          to find a passport or watched the same file fail six times.
        </P>
      </Section>

      {/* ---------------- finding 02 ---------------- */}
      <Section
        rail="Finding 02"
        title="Vesland's problem is vocabulary, not translation"
        dek={`Vesland completes at ${MARKET_COMPLETION.vesland} against Korria's ${MARKET_COMPLETION.korria}. The obvious hypothesis is a language barrier; the data argues against it.`}
      >
        <DataTable
          title="Drop rate by step, per market"
          subtitle={`Vesland n=${MARKET_SIZES.vesland} · Korria n=${MARKET_SIZES.korria} · Aldany n=${MARKET_SIZES.aldany}`}
          columns={[
            { key: 'step', header: '', type: 'step' },
            { key: 'field', header: 'Step', type: 'label' },
            { key: 'vesland', header: 'Vesland', type: 'num', suffix: '%', emphasis: true },
            { key: 'korria', header: 'Korria', type: 'num', suffix: '%' },
            { key: 'aldany', header: 'Aldany', type: 'num', suffix: '%' },
            { key: 'ratio', header: 'V ÷ best', type: 'num' },
          ]}
          rows={BY_MARKET.map((r) => ({ ...r, key: r.field }))}
          caption="Steps 2 and 5 show high ratios off tiny absolute differences (1.1% vs 2.3%; 2.6% vs 5.5%): noise. Steps 3 and 4 are large in both ratio and absolute terms."
        />
        <P>A form nobody can read should degrade everything. It doesn't:</P>
        <Bullets
          items={[
            <>
              Vesland is at parity on the plain fields: Bank details 1.07×, Terms 1.25×,
              UBO name 1.37×.
            </>,
            <>
              It fails the door test. Leaving before completing a single field is the purest
              language signal, and Vesland does that at{' '}
              <strong>4.9%, better than Korria's 7.7%</strong>.
            </>,
            <>All of the excess sits on steps 3 and 4, the two registry-number fields.</>,
          ]}
        />
        <P>
          The mix isn't unusual either: mobile share {MARKET_MIX.mobileShare} across all
          three markets, private limited {MARKET_MIX.privateLimitedShare}. So this isn't
          composition. Holding company type constant sharpens it:
        </P>
        <DataTable
          title="Combined loss on Tax ID + Registration number"
          subtitle="private limited only · % of those reaching Tax ID"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'lost', header: 'Lost', type: 'num' },
            { key: 'rate', header: 'Loss on the two number fields', type: 'bar', max: LOSS_MAX },
          ]}
          rows={NUMBER_FIELD_LOSS.map((r) => ({ ...r, key: r.market }))}
          caption={`Bars scaled to a 40% ceiling. Across all company types: Vesland ${NUMBER_FIELD_LOSS_ALL.vesland}, Korria ${NUMBER_FIELD_LOSS_ALL.korria}, Aldany ${NUMBER_FIELD_LOSS_ALL.aldany}.`}
        />
        <Quote>{QUOTES.numbers}</Quote>

        <H3>Naming or format: both fit</H3>
        <P>
          The obvious reading is <strong>naming</strong>: three plausible identifiers, two
          generic boxes, nothing saying which goes where. The other is{' '}
          <strong>format</strong>: the merchant knows which number you want, types it, and
          the field won't take it because the system expects a different representation.
          Ask a Hungarian merchant for a bank account number and they'll enter the domestic
          one they've used for years; if the form silently accepts only IBAN, they aren't
          confused about which account, they're confused about why the right answer is being
          refused. Registry numbers with market-specific prefixes or check digits fail the
          same way.
        </P>
        <P>
          The timings don't settle it. {REG_NUMBER_TIME.over30s} of Vesland's Registration-number
          abandons spend over 30 seconds, and the spread is wide, from a lower quartile of{' '}
          {REG_NUMBER_TIME.p25} to an upper quartile of {REG_NUMBER_TIME.p75}, which looks like two
          different experiences at one box. But Vesland's median ({REG_NUMBER_TIME.median})
          is no higher than Korria's ({REG_NUMBER_TIME.korriaMedian}). It fails far more
          often without failing more slowly.
        </P>
        <P>
          Either way this is content and localisation, not translation. Which content
          changes depends on the mechanism, and{' '}
          <strong>this export can't separate them</strong>. With no validation or error
          telemetry, a rejected entry and a never-attempted one look identical.
        </P>
      </Section>

      {/* ---------------- finding 03 ---------------- */}
      <Section
        rail="Finding 03"
        title="Almost nobody comes back"
        dek="No autosave, no draft, no resume. The visible cost is a lost session; the real cost is that the session is the whole relationship."
      >
        <Stats
          items={[
            { value: String(RETRY.firstSessionAbandoned), label: 'users whose first session abandoned' },
            { value: RETRY.neverReturnedRate, label: `never start again (${RETRY.neverReturned} users)`, bad: true },
            { value: RETRY.sessionsPerUser, label: 'sessions per user across 14 days' },
            { value: RETRY.noBetterRate, label: 'of returners get no further than last time', bad: true },
          ]}
        />
        <P>
          {RETRY.startedOnce} of {TOPLINE.users} people started exactly once. When someone
          abandons, the likely next event is nothing at all.
        </P>
        <Quote>{QUOTES.resume}</Quote>
        <P>
          Retrying doesn't reliably help. The {RETRY.returned} who came back re-typed
          everything from field one: {RETRY.gotFurther} got further, {RETRY.gotSameDepth}{' '}
          got as far, {RETRY.gotLessFar} got less far. Returning users hit ID upload at{' '}
          {RETRY.returnerUploadRate}, marginally worse than first-timers'{' '}
          {RETRY.firstTimerUploadRate}. Re-typing six fields doesn't help you find a
          passport.
        </P>
        <DataTable
          title="Where the people who never returned gave up"
          subtitle="337 users · first and only session"
          columns={[
            { key: 'step', header: '', type: 'step' },
            { key: 'field', header: 'Abandoned at', type: 'label' },
            { key: 'users', header: 'Users', type: 'num' },
            { key: 'share', header: 'Share of permanent losses', type: 'bar', max: PERMANENT_MAX },
          ]}
          rows={PERMANENT_LOSSES.map((r) => ({ ...r, key: r.field }))}
          caption="Bars scaled to a 25% ceiling. ID upload and Registration number account for 43.6% of everyone permanently lost."
        />
        <P>
          The missing save-and-resume isn't a fourth problem alongside the others. It's the{' '}
          <strong>amplifier that turns them into permanent losses</strong>.
        </P>
      </Section>

      {/* ---------------- finding 04 ---------------- */}
      <Section
        rail="Finding 04"
        title="Desktop is the worse device, and only at the upload"
        dek={`Mobile completes at ${DEVICE_COMPLETION.mobile}, desktop at ${DEVICE_COMPLETION.desktop}.`}
      >
        <DataTable
          title="ID upload drop rate by device"
          subtitle="desktop n=530 · mobile n=317"
          columns={[
            { key: 'device', header: 'Device', type: 'label' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'dropped', header: 'Dropped', type: 'num' },
            { key: 'rate', header: 'Drop at ID upload', type: 'bar', max: UPLOAD_MAX },
          ]}
          rows={BY_DEVICE.map((r) => ({ ...r, key: r.device }))}
          caption="Bars scaled to a 45% ceiling. Across the other eight steps the devices track each other within a few points."
        />
        <P>
          A phone has a camera in the same device as the form. A desktop user has to find an
          existing scan, or photograph the document and move the file across, work that
          leaves the browser. Desktop drops at more than twice the mobile rate at exactly
          the step where that matters, and matches mobile everywhere else. More evidence
          that the obstacle is <strong>producing a file</strong>, not being identified.
        </P>
      </Section>

      {/* ---------------- finding 05 ---------------- */}
      <Section
        rail="Finding 05"
        title="Sole traders are asked a question that doesn't fit them"
        dek="The UBO-and-ID pairing assumes a company with owners behind it. For a sole trader, the company is the person."
      >
        <DataTable
          title="ID upload drop rate by company type"
          columns={[
            { key: 'type', header: 'Company type', type: 'label' },
            { key: 'sessions', header: 'Sessions', type: 'num' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'dropped', header: 'Dropped', type: 'num' },
            { key: 'rate', header: 'Drop at ID upload', type: 'bar', max: UPLOAD_MAX },
          ]}
          rows={BY_COMPANY_TYPE.map((r) => ({ ...r, key: r.type }))}
          caption="Bars scaled to a 45% ceiling. Partnership n=66 at this step, indicative rather than precise."
        />
        <P>
          Sole traders drop roughly 15 points above both other company types and carry the
          lowest overall completion rate ({SOLE_TRADER_COMPLETION}). The flow asks them to
          name a beneficial owner and then prove that person's identity, when they have
          already given their own name once and experience the business and themselves as
          one thing.
        </P>
      </Section>
    </View>
  )
}
