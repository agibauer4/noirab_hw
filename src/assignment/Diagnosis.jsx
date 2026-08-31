import { View, Text, Card } from 'reshaped'
import DataTable from './DataTable.jsx'
import { Section, P, H3, Stats, Quote, Verdict, Note, Bullets } from './Blocks.jsx'
import {
  TOPLINE,
  FUNNEL,
  UPLOAD_TIME,
  UPLOAD_TIME_STATS,
  BY_MARKET,
  MARKET_SIZES,
  MARKET_COMPLETION,
  NUMBER_FIELD_LOSS,
  NUMBER_FIELD_LOSS_ALL,
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
      {/* ---------------- method ---------------- */}
      <Section
        rail="Method"
        title="Counting deaths ranks the wrong fields"
        dek="Every session passes through field 1; only 519 of 847 ever reach field 7. The raw number of sessions that died at a field mostly measures how many people got there, not how hard the field is."
      >
        <P>
          Everything below uses <strong>conditional drop rate</strong> — sessions that died
          at a field, divided by sessions that actually reached it. The two rankings
          genuinely disagree. <em>Business name</em> is the 5th most common place to die
          (48 sessions) but one of the safest fields at 5.7%. <em>Bank details</em> killed
          fewer sessions in absolute terms (35) yet is nearly twice as lethal per person
          who reaches it (10.0%).
        </P>
        <P>
          Reading raw counts would put effort into the top of the form, where the volume
          is. Reading rates puts it where the difficulty is.
        </P>
      </Section>

      {/* ---------------- topline ---------------- */}
      <Section rail="Topline" title="Where it stands">
        <Stats
          items={[
            { value: TOPLINE.sessionRate, label: `of sessions complete — ${TOPLINE.completedSessions} / ${TOPLINE.sessions}` },
            { value: TOPLINE.userRate, label: `of people complete — ${TOPLINE.completedSessions} / ${TOPLINE.users} users` },
            { value: TOPLINE.neverCompletedRate, label: `never get through at all — ${TOPLINE.neverCompleted} users`, bad: true },
            { value: TOPLINE.worstStepRate, label: 'drop at ID upload — the worst single step', bad: true },
          ]}
        />
        <P>
          The session rate and the person rate differ because {TOPLINE.repeatUsers} people
          started more than once. That gap is small — and Finding 03 shows why it stays
          small.
        </P>
      </Section>

      {/* ---------------- funnel ---------------- */}
      <Section
        rail="The funnel"
        title="Three walls, not a slope"
        dek="If length were the problem, drop rates would rise gently as fatigue accumulated. They don't. Six of the nine steps sit under 10%, and the losses pile up at three specific places."
      >
        <DataTable
          title="Conditional drop rate by step"
          subtitle={`${TOPLINE.sessions} sessions · ${TOPLINE.window} · deaths ÷ sessions reaching that step`}
          columns={[
            { key: 'step', header: '', type: 'step' },
            { key: 'field', header: 'Step', type: 'label', badge: 'worst' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'died', header: 'Died', type: 'num' },
            { key: 'rate', header: 'Drop rate', type: 'bar', max: FUNNEL_MAX },
          ]}
          rows={FUNNEL.map((r) => ({ ...r, key: r.field }))}
          caption="Bars scaled to a 40% ceiling. Colour intensity encodes the same value as the printed number, so the figure reads without colour. Reached counts are reconstructed from last_field_completed; the chain reconciles exactly to the 296 recorded completions."
        />
        <P>
          ID document upload is not just the worst step, it is{' '}
          <strong>2.4× worse than the next worst</strong>. One in three merchants who get
          all the way to field 7 — having already typed their company name, tax ID,
          registration number, address and beneficial owner — abandon there.
        </P>
      </Section>

      {/* ---------------- finding 01 ---------------- */}
      <Section
        rail="Finding 01"
        title="The ID upload isn't a refusal. It's a failed attempt."
        dek="A privacy objection looks like a fast exit. This looks like people trying hard and losing."
      >
        <DataTable
          title="Time spent on ID upload before abandoning"
          subtitle="169 abandoned sessions · seconds_on_last_field"
          columns={[
            { key: 'band', header: 'Time on field', type: 'label' },
            { key: 'sessions', header: 'Sessions', type: 'num' },
            // Shares of 169 rounded to whole percents — a decimal here would
            // claim precision the underlying counts don't have.
            { key: 'share', header: 'Share', type: 'bar', max: SHARE_MAX, decimals: 0 },
          ]}
          rows={UPLOAD_TIME.map((r) => ({ ...r, key: r.band }))}
          caption={`Median ${UPLOAD_TIME_STATS.median}, mean ${UPLOAD_TIME_STATS.mean} — the mean is dragged up by a long tail. The longest session sat on this one field for ${UPLOAD_TIME_STATS.max} (${UPLOAD_TIME_STATS.maxMinutes}) and still left.`}
        />
        <P>
          Only <strong>3% bounce in under 30 seconds</strong>. The other 97% engage with
          the step and fail anyway. A third spend more than five minutes on a single
          field. That is the signature of someone leaving the desk to find a passport,
          scanning something, fighting a file size limit, or waiting on an upload with no
          progress indicator — not someone who objects to being asked.
        </P>
        <Quote>{QUOTES.identity}</Quote>
        <P>
          The quote adds the missing half. People aren't refusing — but they also aren't{' '}
          <em>expecting</em>. The request arrives seven fields deep, unannounced, at the
          exact moment it demands a physical object the merchant almost certainly doesn't
          have on the desk.
        </P>
        <Verdict>
          <P>
            This is a <strong>preparedness failure, not a willingness failure</strong>. The
            form asks for something that requires leaving the form, at a point where
            leaving the form destroys everything already typed. The five-minute-plus group
            are people who went to find the document and lost the session while they were
            gone.
          </P>
        </Verdict>
      </Section>

      {/* ---------------- finding 02 ---------------- */}
      <Section
        rail="Finding 02"
        title="Vesland has a vocabulary problem, not a translation problem"
        dek={`Vesland completes at ${MARKET_COMPLETION.vesland} against Korria's ${MARKET_COMPLETION.korria}. The obvious hypothesis is a language barrier. The data argues against it — and points somewhere more specific.`}
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
          caption="Steps 2 and 5 show high ratios off very small absolute differences (1.1% vs 2.3%; 2.6% vs 5.5%) — noise, not signal. The steps that matter are 3 and 4, where the gap is large in both ratio and absolute terms."
        />

        <H3>Why I don't think this is a language barrier</H3>
        <P>A form the merchant can't read should degrade everything. It doesn't:</P>
        <Bullets
          items={[
            <>
              <strong>Vesland is at parity on the plain fields.</strong> Bank details 1.07×,
              Terms 1.25×, UBO name 1.37×. If comprehension were broken, filling in an
              address and typing a name would suffer too. They don't.
            </>,
            <>
              <strong>The door test fails.</strong> The purest language signal is someone
              landing, not understanding the page, and leaving before completing a single
              field. Vesland does that at <strong>4.9% — better than Korria's 7.7%</strong>.
              Vesland merchants can read the form well enough to start it.
            </>,
            <>
              <strong>The damage is surgical.</strong> All of Vesland's excess loss sits on
              steps 3 and 4 — the two fields that ask for a registry number.
            </>,
          ]}
        />

        <H3>It survives a control</H3>
        <P>
          Vesland's market mix isn't unusual (mobile share {MARKET_MIX.mobileShare} across
          all three markets; private limited {MARKET_MIX.privateLimitedShare}), so this
          isn't a composition effect. Holding company type constant makes the gap sharper,
          not softer:
        </P>
        <DataTable
          title="Combined loss on Tax ID + Registration number"
          subtitle="private limited companies only · % of those reaching Tax ID"
          columns={[
            { key: 'market', header: 'Market', type: 'label' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'lost', header: 'Lost', type: 'num' },
            { key: 'rate', header: 'Loss on the two number fields', type: 'bar', max: LOSS_MAX },
          ]}
          rows={NUMBER_FIELD_LOSS.map((r) => ({ ...r, key: r.market }))}
          caption={`Bars scaled to a 40% ceiling. Same comparison across all company types: Vesland ${NUMBER_FIELD_LOSS_ALL.vesland}, Korria ${NUMBER_FIELD_LOSS_ALL.korria}, Aldany ${NUMBER_FIELD_LOSS_ALL.aldany}.`}
        />
        <P>
          A Vesland private limited company is{' '}
          <strong>roughly four times more likely</strong> to die on the two number fields
          than the same company type in either other market.
        </P>
        <Quote>{QUOTES.numbers}</Quote>
        <Verdict>
          <P>
            Not “the form isn't translated” but{' '}
            <strong>“the two labels don't map onto what Vesland's registry actually calls
            these numbers.”</strong> A merchant holding three plausible identifiers and two
            generically-labelled boxes cannot tell which goes where, and the form gives
            them nothing to check against — no format hint, no example, no explanation of
            where to find each number.
          </P>
          <P>
            That is still a language problem, in the narrow sense that matters: the{' '}
            <em>terminology</em> is wrong for the market. It is a content and localisation
            fix, not a re-translation.
          </P>
        </Verdict>
        <Note heading="Caveat — and it's a real one">
          <P>
            The dataset has no language, locale or browser-locale column, so I cannot test
            the translation hypothesis directly. I am inferring from the <em>shape</em> of
            the loss, not measuring language. The shape is strong enough that I'd act on
            it, and the confidence section records what would change my mind.
          </P>
        </Note>
      </Section>

      {/* ---------------- finding 03 ---------------- */}
      <Section
        rail="Finding 03"
        title="Almost nobody comes back"
        dek="No autosave, no draft, no resume. The visible cost is a lost session. The real cost is that the session is the whole relationship."
      >
        <Stats
          items={[
            { value: String(RETRY.firstSessionAbandoned), label: 'users whose first session abandoned' },
            { value: RETRY.neverReturnedRate, label: `never start again — ${RETRY.neverReturned} users`, bad: true },
            { value: RETRY.sessionsPerUser, label: 'sessions per user across 14 days' },
            { value: RETRY.noBetterRate, label: 'of returners get no further than last time', bad: true },
          ]}
        />
        <P>
          Of {TOPLINE.users} people, <strong>{RETRY.startedOnce} started exactly once</strong>.
          {' '}{RETRY.startedTwice} started twice, {RETRY.startedThrice} started three times.
          When someone abandons, the overwhelmingly likely next event is nothing at all —
          three quarters of them are never seen again inside the fortnight.
        </P>
        <Quote>{QUOTES.resume}</Quote>

        <H3>Retrying doesn't reliably help</H3>
        <P>
          The {RETRY.returned} people who did come back had to re-type everything from
          field one. It bought them less than you'd hope: {RETRY.gotFurther} got further
          than their previous attempt, {RETRY.gotSameDepth} got exactly as far, and{' '}
          <strong>{RETRY.gotLessFar} got less far than before</strong>. So 45% of returners
          spent a second full effort and ended up no better off.
        </P>
        <P>
          The reason is that the wall doesn't move. Returning users hit ID upload at{' '}
          {RETRY.returnerUploadRate}, slightly <em>worse</em> than first-timers'{' '}
          {RETRY.firstTimerUploadRate}. Re-typing six fields doesn't help you find a
          passport. (The third-attempt group is only 20 sessions — I'm not drawing
          conclusions from it.)
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
          caption="Bars scaled to a 25% ceiling. ID upload and Registration number together account for 43.6% of everyone permanently lost."
        />
        <Verdict>
          <P>
            The absence of save-and-resume isn't a separate problem sitting alongside the
            other two — it is the{' '}
            <strong>amplifier that converts them into permanent losses</strong>. A merchant
            who hits the ID wall has two options: abandon everything, or leave the tab open
            and hope. Most abandon, and 73% of those never return. Fix the ID step and the
            number fields and you reduce how often people hit a wall; add save-and-resume
            and hitting a wall stops being fatal.
          </P>
        </Verdict>
      </Section>

      {/* ---------------- finding 04 ---------------- */}
      <Section
        rail="Finding 04"
        title="Desktop is the worse device — and only at the upload"
        dek={`Mobile completes at ${DEVICE_COMPLETION.mobile}; desktop at ${DEVICE_COMPLETION.desktop}. That inversion of the usual pattern has a single cause.`}
      >
        <DataTable
          title="ID upload drop rate by device"
          subtitle="desktop n=530 · mobile n=317"
          columns={[
            { key: 'device', header: 'Device', type: 'label' },
            { key: 'reached', header: 'Reached', type: 'num' },
            { key: 'died', header: 'Died', type: 'num' },
            { key: 'rate', header: 'Drop at ID upload', type: 'bar', max: UPLOAD_MAX },
          ]}
          rows={BY_DEVICE.map((r) => ({ ...r, key: r.device }))}
          caption="Bars scaled to a 45% ceiling. Across the other eight steps the two devices track each other within a few points — the divergence is specific to the upload."
        />
        <P>
          A phone has a camera in the same device as the form. A desktop user has to find
          an existing scan, or photograph the document on their phone and get the file onto
          the computer — a task that leaves the browser entirely.{' '}
          <strong>Desktop drops at more than twice the mobile rate</strong> at exactly the
          step where that difference bites, and roughly matches mobile everywhere else.
        </P>
        <P>
          This reinforces Finding 01: the problem is the{' '}
          <em>logistics of producing a file</em>, not reluctance to be identified. Desktop
          users aren't more privacy-conscious than mobile users; they just have further to
          walk.
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
            { key: 'died', header: 'Died', type: 'num' },
            { key: 'rate', header: 'Drop at ID upload', type: 'bar', max: UPLOAD_MAX },
          ]}
          rows={BY_COMPANY_TYPE.map((r) => ({ ...r, key: r.type }))}
          caption="Bars scaled to a 45% ceiling. Partnership n=66 at this step — the smallest cell here, and I'd treat its exact value as indicative rather than precise."
        />
        <P>
          Sole traders drop at the ID upload{' '}
          <strong>roughly 15 points above both other company types</strong>. They also carry
          the lowest overall completion rate ({SOLE_TRADER_COMPLETION}). Read alongside the
          “I thought I was registering a company, not myself” quote, the likely mechanism is
          that the flow asks a sole trader to name a beneficial owner and then prove that
          person's identity — when the merchant experiences the business and themselves as
          one thing and has already given their name once.
        </P>
        <P>
          Whatever the label says, a sole trader is being asked to do something that reads
          as duplicated, unexplained, or intrusive, at the most expensive point in the form.
        </P>
      </Section>

      {/* ---------------- ruling out ---------------- */}
      <Section rail="Ruling out" title="What the data does not support">
        <Bullets
          items={[
            <>
              <strong>“The form is too long.”</strong> Six of nine steps drop under 10%.
              Company type (1.9%), registered address (5.0%) and terms + submit (6.0%) are
              all late-ish, all fine. Length is a cost people pay willingly right up until
              they hit a specific obstacle. Cutting fields wouldn't touch the walls — and
              the brief doesn't allow it anyway.
            </>,
            <>
              <strong>“People don't want to give ID.”</strong> 97% of ID-upload abandoners
              spend over 30 seconds on the step, and a third spend over five minutes. That's
              effort, not objection.
            </>,
            <>
              <strong>“Vesland can't read the form.”</strong> Vesland is at or near parity on
              six of nine steps and has the second-lowest before-field-one exit rate. The
              loss is concentrated on two fields, not spread across the form.
            </>,
            <>
              <strong>“Mobile is the problem.”</strong> Mobile out-completes desktop by 14
              points. If anything, mobile is the accidental success story here.
            </>,
            <>
              <strong>The final stretch.</strong> Bank details (10.0%) and terms + submit
              (6.0%) are the two steps people most often assume are scary. Both are
              unremarkable. By the time someone reaches field 8 they are committed.
            </>,
          ]}
        />
      </Section>

      {/* ---------------- directions ---------------- */}
      <Section
        rail="Points to"
        title="Where this sends the redesign"
        dek="Three directions fall out of the diagnosis. They are hypotheses to be built and tested in parts 03 and 04, not conclusions — but each one traces to a specific number above."
      >
        <View gap={3}>
          {[
            {
              n: 'Direction A',
              title: 'Save every step, and make resuming the default',
              body: "Persist progress field by field and let a merchant leave and return without loss. This is the highest-leverage change in the document, because it doesn't need to prevent a single abandonment to pay off — it only needs to stop abandonment from being permanent.",
              evidence: `73.3% of first-time abandoners never return (337 of 460) · 581 of 704 users started exactly once · 45% of the few who did return got no further than before`,
            },
            {
              n: 'Direction B',
              title: 'Section the flow, and say up front what people need ready',
              body: "Break the eight fields into named steps, and open with a short “what you'll need” screen that names the ID document and the bank details before anyone starts typing. The ID request should never be the first time a merchant hears about it, seven fields deep. Sectioning also lets the ID step carry its own explanation of why a person's identity is required to register a business.",
              evidence: '32.6% drop at ID upload, 2.4× the next worst step · 97% of those abandons follow real effort, not instant refusal · 34% spend 5+ minutes before giving up · desktop 41.5% vs mobile 18.4%',
            },
            {
              n: 'Direction C',
              title: 'Explain every field in place — market-specific labels, formats, examples',
              body: 'Give the two number fields real names drawn from each market’s registry vocabulary, plus input descriptions, format hints, worked examples and an inline explanation of where to find each number. Placeholders and help text are cheap; the confusion they would resolve is currently the second-largest source of permanent loss.',
              evidence: 'Vesland Tax ID 11.5% and Registration number 21.3% vs ~5-8% elsewhere · Vesland private limited loses 35.0% on the two number fields vs 8.8% Korria / 9.5% Aldany · Registration number is 19.3% of all permanent losses',
            },
          ].map((dir) => (
            <Card key={dir.n} padding={4}>
              <View gap={2}>
                <Text variant="caption-2" color="primary" monospace weight="medium">
                  {dir.n}
                </Text>
                <Text variant="body-1" weight="semibold">
                  {dir.title}
                </Text>
                <Text variant="body-2" className="prose-measure">
                  {dir.body}
                </Text>
                <Text variant="caption-1" color="neutral-faded" monospace>
                  Evidence · {dir.evidence}
                </Text>
              </View>
            </Card>
          ))}
        </View>
        <Note heading="Sequencing note">
          <P>
            B and C reduce how often merchants hit a wall. A changes what happens when they
            do. If only one shipped, A is the one — it is the only change that recovers
            people who have already failed.
          </P>
        </Note>
      </Section>

      {/* ---------------- confidence ---------------- */}
      <Section rail="Confidence" title="What I'm assuming, and what I don't trust">
        <H3>Held with confidence</H3>
        <P>
          The ID upload finding (n=519 reaching, 169 dying), the Vesland number-field
          finding (survives a company-type control at roughly 4× the other markets), and the
          non-return finding (337 of 460) all rest on large cells and hold up under slicing.
        </P>

        <H3>Held loosely — cells too small</H3>
        <Bullets
          items={[
            <>
              Third attempts: 20 sessions total. The 53.8% ID-upload drop rate in that group
              rests on 13 sessions. Not usable.
            </>,
            <>
              Partnership at ID upload: 66 sessions reaching the step. Directionally in line
              with private limited; I wouldn't quote the exact number.
            </>,
            <>
              Per-market medians on individual steps often rest on 4-14 abandons (Aldany
              registration number n=13; Korria registered address n=14). I've used market
              comparisons only where the cell is large.
            </>,
            <>
              Company type (1.9%) and registered address (5.0%) show large Vesland-vs-best{' '}
              <em>ratios</em> off tiny absolute differences. Ratios on small numbers are
              noise; I've ignored them.
            </>,
          ]}
        />

        <H3>Assumptions the data forced on me</H3>
        <Bullets
          items={[
            <>
              <strong>I reconstructed the funnel</strong> from last_field_completed plus the
              stated field order, on the brief's rule that abandoning at a field means
              everything before it was completed. The chain reconciles exactly to 296
              completions, so the reconstruction is sound.
            </>,
            <>
              <strong>I treat “never started again” as churn.</strong> Within a 14-day window
              that's an inference — someone may have returned on day 15, or completed via
              support or a sales rep off-platform. The dataset can't see either.
            </>,
            <>
              <strong>I can't see why anyone left.</strong> seconds_on_last_field tells me how
              long someone struggled, not what they were struggling with. “Couldn't find the
              document”, “upload failed silently” and “file was rejected for format” are
              invisible here, and those three call for different fixes.
            </>,
            <>
              <strong>Nothing distinguishes a real market difference from a content
              difference.</strong> There is no language, locale or field-label column, so the
              Vesland conclusion is inferred from the shape of the loss rather than measured
              directly.
            </>,
          ]}
        />

        <Note heading="Leading into part 02">
          <P>
            The single most valuable missing measurement — the one that would most change
            what I build — is developed in the next section.
          </P>
        </Note>
      </Section>
    </View>
  )
}
