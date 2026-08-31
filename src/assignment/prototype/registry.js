// Market-specific registry vocabulary.
//
// This is Finding 02 turned into content: the labels have to be what each
// market's registry actually calls these numbers, the placeholder has to show
// the real shape, and the helper has to say where to find it. A merchant
// holding three identifiers should never have to guess which box wants which.
export const MARKETS = {
  vesland: {
    label: 'Vesland',
    taxId: {
      label: 'VAT number',
      placeholder: 'VE 123 456 789',
      hint: 'Nine digits after VE. On your VAT registration certificate.',
    },
    regNumber: {
      label: 'Trade register number',
      placeholder: '12-34-567890',
      hint: 'On your Trade Register extract. This is not your VAT number.',
      // The error a merchant actually hits: they entered the other number.
      wrongEntry: {
        looksLike: 'VAT number',
        message: 'That looks like your VAT number. The trade register number has 10 digits in three groups, like 12-34-567890.',
      },
    },
    addressPlaceholder: 'Handelsstraat 12',
    postcodePlaceholder: '1234 AB',
    cityPlaceholder: 'Vesburg',
    bankLocalLabel: 'Vesland account number',
    bankLocalPlaceholder: '12 34 56 789',
    // What the ID scan returns. Pre-filled into the form, never locked.
    ocr: { name: 'Anna Bauer', street: 'Handelsstraat 12', postcode: '1234 AB', city: 'Vesburg' },
  },
  korria: {
    label: 'Korria',
    taxId: {
      label: 'Tax identification number (TIN)',
      placeholder: '123-456-789',
      hint: 'Nine digits, on any correspondence from the tax office.',
    },
    regNumber: {
      label: 'Business registry number',
      placeholder: 'KR-2024-01234',
      hint: 'On your certificate of incorporation, starting with KR.',
      wrongEntry: {
        looksLike: 'tax identification number',
        message: 'That looks like your TIN. The registry number starts with KR, like KR-2024-01234.',
      },
    },
    addressPlaceholder: '14 Market Row',
    postcodePlaceholder: 'K1 4RW',
    cityPlaceholder: 'Korria City',
    bankLocalLabel: 'Korria account number',
    bankLocalPlaceholder: '00-11-22 33445566',
    ocr: { name: 'Anna Bauer', street: '14 Market Row', postcode: 'K1 4RW', city: 'Korria City' },
  },
  aldany: {
    label: 'Aldany',
    taxId: {
      label: 'Fiscal code',
      placeholder: 'ALD1234567X',
      hint: 'Eleven characters, on your fiscal registration letter.',
    },
    regNumber: {
      label: 'Chamber of commerce number',
      placeholder: '987654321',
      hint: 'Nine digits, issued by your local chamber of commerce.',
      wrongEntry: {
        looksLike: 'fiscal code',
        message: 'That looks like your fiscal code. The chamber of commerce number is nine digits, like 987654321.',
      },
    },
    addressPlaceholder: 'Via Mercato 8',
    postcodePlaceholder: '00184',
    cityPlaceholder: 'Aldano',
    bankLocalLabel: 'Aldany account number',
    bankLocalPlaceholder: 'X0300203280000400162854',
    ocr: { name: 'Anna Bauer', street: 'Via Mercato 8', postcode: '00184', city: 'Aldano' },
  },
}

export const COMPANY_TYPES = [
  { value: 'private-limited', label: 'Private limited company' },
  { value: 'sole-trader', label: 'Sole trader' },
  { value: 'partnership', label: 'Partnership' },
]

export const STEPS = [
  { n: 1, title: 'Your business', summary: 'Name and type' },
  { n: 2, title: 'Prove your identity', summary: 'Photo ID' },
  { n: 3, title: 'Registration details', summary: 'Registry numbers and address' },
  { n: 4, title: 'Getting paid', summary: 'Bank details and terms' },
]

export const NAME_MAX = 120
