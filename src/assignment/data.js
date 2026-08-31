// Every figure quoted in the diagnosis, computed from paylet_sessions.csv
// (847 rows, 15-28 July 2026) and kept in one place so each number on screen
// traces back to a single source.
//
// Method note that governs most of this file: the funnel is reconstructed from
// `last_field_completed` plus the field order given in the brief, on the rule
// that abandoning at a field means every earlier field was completed. The
// reconstructed chain reconciles exactly to the 296 recorded completions.
//
// Drop rates are CONDITIONAL — deaths at a field divided by the sessions that
// actually reached it — not raw death counts. Every session reaches field 1 but
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
  { step: 1, field: 'Business name', reached: 847, died: 48, rate: 5.7 },
  { step: 2, field: 'Company type', reached: 799, died: 15, rate: 1.9 },
  { step: 3, field: 'Tax ID', reached: 784, died: 63, rate: 8.0 },
  { step: 4, field: 'Registration number', reached: 721, died: 98, rate: 13.6 },
  { step: 5, field: 'Registered address', reached: 623, died: 31, rate: 5.0 },
  { step: 6, field: 'UBO name', reached: 592, died: 73, rate: 12.3 },
  { step: 7, field: 'ID document upload', reached: 519, died: 169, rate: 32.6, worst: true },
  { step: 8, field: 'Bank details', reached: 350, died: 35, rate: 10.0 },
  { step: 9, field: 'Terms + submit', reached: 315, died: 19, rate: 6.0 },
]

// Time spent on the ID upload field before abandoning, for the 169 sessions
// that died there. Separates "refused" from "tried and failed".
export const UPLOAD_TIME = [
  { band: 'Under 30s', gloss: 'instant refusal', sessions: 5, share: 3 },
  { band: '30s - 5 min', gloss: 'actively trying', sessions: 106, share: 63, hot: true },
  { band: 'Over 5 min', gloss: 'stuck, then gave up', sessions: 58, share: 34, hot: true },
]

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
  { device: 'Desktop', sessions: 530, reached: 318, died: 132, rate: 41.5, worst: true },
  { device: 'Mobile', sessions: 317, reached: 201, died: 37, rate: 18.4 },
]

export const DEVICE_COMPLETION = { desktop: '29.6%', mobile: '43.8%' }

export const BY_COMPANY_TYPE = [
  { type: 'Sole trader', sessions: 274, reached: 159, died: 68, rate: 42.8, worst: true },
  { type: 'Partnership', sessions: 106, reached: 66, died: 19, rate: 28.8, thin: true },
  { type: 'Private limited', sessions: 467, reached: 294, died: 82, rate: 27.9 },
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
  { n: '01', title: 'Diagnose', status: 'this page', active: true },
  { n: '02', title: 'Name the gap', status: 'next' },
  { n: '03', title: 'Redesign', status: 'to come' },
  { n: '04', title: 'Justify', status: 'to come' },
]
