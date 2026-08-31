// Every figure quoted in the diagnosis, computed from paylet_sessions.csv
// (847 rows, 15-28 July 2026) and kept in one place so each number on screen
// traces back to a single source.
//
// Method note that governs most of this file: the funnel is reconstructed from
// `last_field_completed` plus the field order given in the brief, on the rule
// that abandoning at a field means every earlier field was completed. The
// reconstructed chain reconciles exactly to the 296 recorded completions.
//
// Drop rates are CONDITIONAL — drops at a field divided by the sessions that
// actually reached it — not raw drop counts. Every session reaches field 1 but
// only 519 reach field 7, so raw counts rank reach, not difficulty.

export const TOPLINE = {
  sessions: 847,
  users: 704,
  completedSessions: 296,
  sessionRate: '34.9%',
  userRate: '42.0%',
  neverCompleted: 408,
  neverCompletedRate: '58.0%',
  worstStepRate: '32.6%',
  window: '15-28 July 2026',
  repeatUsers: 123,
}

// Field order as specified in the brief.
export const FUNNEL = [
  { step: 1, field: 'Business name', reached: 847, dropped: 48, rate: 5.7 },
  { step: 2, field: 'Company type', reached: 799, dropped: 15, rate: 1.9 },
  { step: 3, field: 'Tax ID', reached: 784, dropped: 63, rate: 8.0 },
  { step: 4, field: 'Registration number', reached: 721, dropped: 98, rate: 13.6 },
  { step: 5, field: 'Registered address', reached: 623, dropped: 31, rate: 5.0 },
  { step: 6, field: 'UBO name', reached: 592, dropped: 73, rate: 12.3 },
  { step: 7, field: 'ID document upload', reached: 519, dropped: 169, rate: 32.6, worst: true },
  { step: 8, field: 'Bank details', reached: 350, dropped: 35, rate: 10.0 },
  { step: 9, field: 'Terms + submit', reached: 315, dropped: 19, rate: 6.0 },
]

// Time spent on the ID upload field before abandoning, for the 169 sessions
// that dropped there. Separates "refused" from "tried and failed".
export const UPLOAD_TIME = [
  { band: 'Under 30s', gloss: 'instant refusal', sessions: 5, share: 3 },
  { band: '30s - 5 min', gloss: 'actively trying', sessions: 106, share: 63, hot: true },
  { band: 'Over 5 min', gloss: 'stuck, then gave up', sessions: 58, share: 34, hot: true },
]

// ID upload drop by market. The important thing about this table is that it
// groups DIFFERENTLY from the number-field loss: there Vesland alone is the
// outlier, here Korria alone is the good one. Two different groupings point to
// two different causes, which is why they're written up as separate findings.
export const ID_UPLOAD_BY_MARKET = [
  { market: 'Vesland', reached: 192, dropped: 73, rate: 38.0, worst: true },
  { market: 'Aldany', reached: 129, dropped: 46, rate: 35.7, hot: true },
  { market: 'Korria', reached: 198, dropped: 50, rate: 25.3 },
]

// The two signatures side by side — the comparison that separates them.
export const SIGNATURES = [
  { market: 'Vesland', numberFields: 30.3, idUpload: 38.0 },
  { market: 'Korria', numberFields: 13.3, idUpload: 25.3 },
  { market: 'Aldany', numberFields: 12.7, idUpload: 35.7 },
]

// Struggle time is near-identical across markets and devices, which is why it
// can't be used to tell the candidate mechanisms apart.
export const UPLOAD_TIME_SPLITS = {
  vesland: '180s median · 30% over 5 min',
  korria: '180s median · 34% over 5 min',
  aldany: '216s median · 41% over 5 min',
  desktopMedian: '182s',
  mobileMedian: '214s',
  desktopOver5: '35%',
  mobileOver5: '32%',
}

export const UPLOAD_TIME_STATS = {
  median: '182s',
  mean: '719s',
  max: '3,293s',
  maxMinutes: '55 minutes',
}

// Per-market drop rate at every step. The shape of this table is the whole
// language-barrier argument: Vesland is at parity on the plain fields and only
// diverges on the two registry-number fields.
export const BY_MARKET = [
  { step: 1, field: 'Business name', vesland: 4.9, korria: 7.7, aldany: 3.8, ratio: '1.28x' },
  { step: 2, field: 'Company type', vesland: 2.3, korria: 1.8, aldany: 1.1, ratio: '2.01x', noisy: true },
  { step: 3, field: 'Tax ID', vesland: 11.5, korria: 5.5, aldany: 5.2, ratio: '2.20x', hot: true },
  { step: 4, field: 'Registration number', vesland: 21.3, korria: 8.2, aldany: 7.9, ratio: '2.68x', hot: true },
  { step: 5, field: 'Registered address', vesland: 5.5, korria: 6.0, aldany: 2.6, ratio: '2.07x', noisy: true },
  { step: 6, field: 'UBO name', vesland: 14.3, korria: 10.4, aldany: 12.2, ratio: '1.37x' },
  { step: 7, field: 'ID document upload', vesland: 38.0, korria: 25.3, aldany: 35.7, ratio: '1.51x' },
  { step: 8, field: 'Bank details', vesland: 10.1, korria: 9.5, aldany: 10.8, ratio: '1.07x' },
  { step: 9, field: 'Terms + submit', vesland: 6.5, korria: 5.2, aldany: 6.8, ratio: '1.25x' },
]

export const MARKET_SIZES = { vesland: 366, korria: 299, aldany: 182 }

export const MARKET_COMPLETION = { vesland: '27.3%', korria: '42.5%', aldany: '37.9%' }

// Combined loss on Tax ID + Registration number, private limited companies only.
// Holding company type constant is the control that rules out a mix effect.
export const NUMBER_FIELD_LOSS = [
  { market: 'Vesland', reached: 180, lost: 63, rate: 35.0, worst: true },
  { market: 'Korria', reached: 159, lost: 14, rate: 8.8 },
  { market: 'Aldany', reached: 95, lost: 9, rate: 9.5 },
]

// Same comparison across all company types, quoted inline as supporting detail.
export const NUMBER_FIELD_LOSS_ALL = { vesland: '30.3%', korria: '13.3%', aldany: '12.7%' }

// Market mix, to show Vesland is not compositionally unusual.
export const MARKET_MIX = {
  mobileShare: '36-39%',
  privateLimitedShare: '53-58%',
}

// Where the loss sits across the two number fields. Everywhere loses more on
// the second than the first, but Vesland's skew toward the second is the
// steepest — people get past Tax ID and then drop at Registration number.
export const NUMBER_FIELD_ORDER = [
  { market: 'Vesland', taxId: 11.5, regNumber: 21.3, skew: '1.85x', worst: true },
  { market: 'Aldany', taxId: 5.2, regNumber: 7.9, skew: '1.52x' },
  { market: 'Korria', taxId: 5.5, regNumber: 8.2, skew: '1.48x' },
]

// Time-on-field for the 64 Vesland sessions that dropped at Registration number.
// The spread is the interesting part: a tight lower quartile and a very long
// upper one, which looks like two different failure experiences at one field.
export const REG_NUMBER_TIME = {
  n: 64,
  min: '17s',
  p25: '85s',
  median: '129s',
  p75: '1,206s',
  max: '2,159s',
  under60: '16%',
  over30s: '91%',
  korriaMedian: '159s',
  aldanyMedian: '620s',
}

export const RETRY = {
  firstSessionAbandoned: 460,
  neverReturned: 337,
  neverReturnedRate: '73.3%',
  returned: 123,
  sessionsPerUser: '1.20',
  startedOnce: 581,
  startedTwice: 103,
  startedThrice: 20,
  gotFurther: 68,
  gotSameDepth: 25,
  gotLessFar: 30,
  noBetterRate: '45%',
  returnerUploadRate: '36.7%',
  firstTimerUploadRate: '31.1%',
}

// Where the 337 users who abandoned once and never came back gave up.
export const PERMANENT_LOSSES = [
  { step: 7, field: 'ID document upload', users: 82, share: 24.3, worst: true },
  { step: 4, field: 'Registration number', users: 65, share: 19.3, hot: true },
  { step: 6, field: 'UBO name', users: 46, share: 13.6 },
  { step: 3, field: 'Tax ID', users: 42, share: 12.5 },
  { step: 1, field: 'Business name', users: 37, share: 11.0 },
  { step: 8, field: 'Bank details', users: 24, share: 7.1 },
  { step: 5, field: 'Registered address', users: 21, share: 6.2 },
  { step: 9, field: 'Terms + submit', users: 11, share: 3.3 },
  { step: 2, field: 'Company type', users: 9, share: 2.7 },
]

export const BY_DEVICE = [
  { device: 'Desktop', sessions: 530, reached: 318, dropped: 132, rate: 41.5, worst: true },
  { device: 'Mobile', sessions: 317, reached: 201, dropped: 37, rate: 18.4 },
]

export const DEVICE_COMPLETION = { desktop: '29.6%', mobile: '43.8%' }

export const BY_COMPANY_TYPE = [
  { type: 'Sole trader', sessions: 274, reached: 159, dropped: 68, rate: 42.8, worst: true },
  { type: 'Partnership', sessions: 106, reached: 66, dropped: 19, rate: 28.8, thin: true },
  { type: 'Private limited', sessions: 467, reached: 294, dropped: 82, rate: 27.9 },
]

export const SOLE_TRADER_COMPLETION = '29.6%'

export const QUOTES = {
  resume:
    'I got halfway through, got a call, and when I came back the whole form was gone.',
  identity:
    "I didn't know why it was asking for my ID document, I thought I was just registering a company, not myself.",
  numbers:
    "It wasn't clear which of the two number fields I was supposed to fill in, I have three different registry numbers for my business.",
}

export const PARTS = [
  { n: '01', title: 'Diagnose', status: 'on this page', active: true },
  { n: '02', title: 'Name the gap', status: 'on this page', active: true },
  { n: '03', title: 'Redesign', status: 'on this page', active: true },
  { n: '04', title: 'Justify', status: 'on this page', active: true },
]

// --- Part 03 ---------------------------------------------------------------

// The redesigned flow. Desktop-first, because desktop is where the funnel is
// worst (41.5% at the ID step against mobile's 18.4%).
//
// Every one of the 8 original fields is accounted for below — `original` marks
// which brief field each item is, so nothing can be dropped silently.
//
// The ordering decision that matters: identity moves from field 7 to step 2.
// It's the single biggest loss in the funnel, so it runs while motivation is
// highest instead of after six fields of investment, and OCR on the document
// pre-fills what it can for the steps after it.
export const FLOW = [
  {
    n: '01',
    title: 'Account basics',
    intent: 'Get them in with the two things every merchant knows by heart.',
    fields: [
      { label: 'Business / legal name', original: true, note: 'character count' },
      { label: 'Company type', original: true, note: 'drives later steps' },
      { label: 'Work email', original: false, note: 'new — enables save & resume' },
    ],
  },
  {
    n: '02',
    title: 'Identity check',
    intent: 'Hardest step, run early. OCR pre-fills what it reads.',
    fields: [
      { label: 'Your name (UBO)', original: true, note: 'pre-filled by OCR' },
      { label: 'ID document', original: true, note: 'phone capture, upload fallback' },
    ],
    branch: true,
  },
  {
    n: '03',
    title: 'Company details',
    intent: 'Registry data, with market-specific labels and examples.',
    fields: [
      { label: 'Tax identification number', original: true, note: 'format hint + example' },
      { label: 'Company registration number', original: true, note: 'format hint + example' },
      { label: 'Registered business address', original: true, note: 'partly pre-filled' },
    ],
  },
  {
    n: '04',
    title: 'Payout & confirmation',
    intent: 'Money last, when commitment is highest.',
    fields: [
      { label: 'Bank account / payout details', original: true, note: 'IBAN or local, both accepted' },
      { label: 'Terms acceptance + submit', original: true, note: 'plain-language summary' },
    ],
  },
]

// The step-02 branch. Handoff is the default because desktop drops at 41.5%
// here; the upload fallback stays, with its cost stated up front rather than
// discovered later.
export const KYC_BRANCH = [
  {
    label: 'Phone capture',
    tag: 'default',
    body: 'QR code on desktop, capture on the phone, desktop updates live. Session is never handed over — the desktop tab stays in control.',
    outcome: 'Usually verified in minutes',
    primary: true,
  },
  {
    label: 'Upload a file instead',
    tag: 'always offered',
    body: 'For anyone without a phone to hand, or who already has a scan. Never hidden behind the QR.',
    outcome: 'Approval may take longer — manual review',
  },
]

// --- Part 02 ---------------------------------------------------------------

// ID upload drop, market x device. The point of this table: the desktop
// penalty is near-constant (20-26pp) across all three markets, while Korria
// stays ~10pp better on BOTH devices. Two independent factors, not one.
export const MARKET_DEVICE = [
  { market: 'Vesland', desktop: 46.3, mobile: 23.2, gap: '23.2pp' },
  { market: 'Korria', desktop: 33.3, mobile: 12.8, gap: '20.5pp' },
  { market: 'Aldany', desktop: 46.7, mobile: 20.4, gap: '26.3pp' },
]

// Control. At Registration number nothing is captured, and the device effect
// disappears — even reversing in Vesland. Rules out "desktop users are just
// less committed" as an explanation for the ID-upload gap.
export const DEVICE_CONTROL = [
  { market: 'Vesland', desktop: 18.6, mobile: 25.7 },
  { market: 'Korria', desktop: 10.2, mobile: 5.1 },
  { market: 'Aldany', desktop: 8.7, mobile: 6.6 },
]

// --- Part 04 ---------------------------------------------------------------

// Conditional drop by device, at every step. The ID upload is the only place
// the two devices come apart: +23.1pp, against a band of at most 5pp on the
// other eight steps. That band is what makes the gap readable as a threshold —
// and being a comparison WITHIN one cohort, it survives the redesign changing
// who reaches the step at all.
export const DEVICE_BY_STEP = [
  { step: 1, field: 'Business name', desktop: 6.6, mobile: 4.1, gap: '+2.5' },
  { step: 2, field: 'Company type', desktop: 2.2, mobile: 1.3, gap: '+0.9' },
  { step: 3, field: 'Tax ID', desktop: 7.4, mobile: 9.0, gap: '-1.6' },
  { step: 4, field: 'Registration number', desktop: 13.4, mobile: 13.9, gap: '-0.5' },
  { step: 5, field: 'Registered address', desktop: 5.7, mobile: 3.8, gap: '+1.8' },
  { step: 6, field: 'UBO name', desktop: 13.1, mobile: 11.1, gap: '+2.1' },
  {
    step: 7,
    field: 'ID document upload',
    desktop: 41.5,
    mobile: 18.4,
    gap: '+23.1',
    worst: true,
    hot: true,
  },
  { step: 8, field: 'Bank details', desktop: 12.4, mobile: 7.3, gap: '+5.0' },
  { step: 9, field: 'Terms + submit', desktop: 3.7, mobile: 8.6, gap: '-4.9' },
]

export const DEVICE_BAND = '5.0pp'

// What this traffic can actually settle, behind the A/B claim in Part 04.
// 847 sessions over 14 days is 60.5 a day; split two ways, at 80% power and
// 5% two-sided, against the 34.9% baseline:
//
//   +3pp   4,037/arm    8,074 total   134 days
//   +5pp   1,467/arm    2,934 total    49 days
//   +8pp     580/arm    1,160 total    19 days
//   +10pp    373/arm      746 total    12 days
//
// Not exported: the one-page limit on Part 04 left room for the conclusion but
// not the table.

// What abandoning costs today, per user rather than per session. The redesign's
// whole defence of an early ID step rests on making these numbers recoverable.
export const RECOVERY = {
  firstAbandoned: 460,
  everCompleted: 52,
  everCompletedRate: '11.3%',
  idFirstAbandoned: 133,
  idEverCompleted: 21,
  idEverCompletedRate: '15.8%',
}
