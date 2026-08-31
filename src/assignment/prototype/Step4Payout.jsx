import {
  View,
  Text,
  FormControl,
  TextField,
  Checkbox,
  Card,
  Alert,
  Divider,
  Button,
} from 'reshaped'
import { MARKETS, COMPANY_TYPES } from './registry.js'

// Step 4 puts money and terms last, where the data says they're safe: bank
// details drop 10.0% and terms 6.0%, the two calmest steps in the funnel.
//
// The account-number field applies Finding 02's other lesson — accept what the
// merchant actually holds. Both IBAN and the local format are valid input; the
// form normalises rather than refusing.
export default function Step4Payout({ values, set, errors, capture, onEdit }) {
  const market = MARKETS[values.market] ?? MARKETS.vesland
  const companyTypeLabel =
    COMPANY_TYPES.find((type) => type.value === values.companyType)?.label ?? '—'
  const pendingReview = capture.status === 'review'

  return (
    <View gap={5}>
      <View gap={1}>
        <Text variant="featured-3" weight="bold">
          Where should we send your money?
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Last step. This is the account we pay your takings into.
        </Text>
      </View>

      {/* ORIGINAL FIELD 7 — Bank account / payout details. */}
      <FormControl>
        <FormControl.Label>Account holder</FormControl.Label>
        <TextField
          name="accountHolder"
          value={values.accountHolder}
          onChange={({ value }) => set('accountHolder', value)}
          placeholder="The name on the bank account"
        />
        <FormControl.Helper>
          Must match your registered business name or your own name.
        </FormControl.Helper>
      </FormControl>

      <FormControl hasError={Boolean(errors.accountNumber)}>
        <FormControl.Label>Bank account number or IBAN</FormControl.Label>
        <TextField
          name="accountNumber"
          value={values.accountNumber}
          onChange={({ value }) => set('accountNumber', value)}
          placeholder={market.bankIbanPlaceholder}
          hasError={Boolean(errors.accountNumber)}
        />
        {errors.accountNumber ? (
          <FormControl.Error>{errors.accountNumber}</FormControl.Error>
        ) : (
          // Not lowercased — the label opens with the market's name, and
          // "your vesland account number" reads as a typo.
          <FormControl.Helper>
            Either works — an IBAN, or your {market.bankLocalLabel} (
            {market.bankLocalPlaceholder}). Spaces and dashes are fine.
          </FormControl.Helper>
        )}
      </FormControl>

      <Divider />

      {/* Review, so nothing is submitted unseen. */}
      <View gap={3}>
        <Text variant="body-3" weight="semibold">
          Check this over
        </Text>
        <Card padding={4}>
          <View gap={3}>
            {[
              { label: 'Business name', value: values.businessName || '—', step: 1 },
              { label: 'Business type', value: companyTypeLabel, step: 1 },
              { label: 'Country', value: market.label, step: 1 },
              { label: 'Owner', value: values.ownerName || '—', step: 2 },
              {
                label: 'Photo ID',
                value:
                  capture.status === 'verified'
                    ? 'Confirmed'
                    : capture.status === 'review'
                      ? 'Waiting on a manual check'
                      : 'Not added yet',
                step: 2,
              },
              { label: market.taxId.label, value: values.taxId || '—', step: 3 },
              {
                label: market.regNumber.label,
                value: values.noRegNumber ? 'Not registered' : values.regNumber || '—',
                step: 3,
              },
              {
                label: 'Address',
                value:
                  [values.street, values.postcode, values.city].filter(Boolean).join(', ') ||
                  '—',
                step: 3,
              },
            ].map((row) => (
              <View key={row.label} direction="row" gap={3} align="center" wrap={false}>
                <View.Item columns={4}>
                  <Text variant="caption-1" color="neutral-faded">
                    {row.label}
                  </Text>
                </View.Item>
                <View.Item grow>
                  <Text variant="caption-1">{row.value}</Text>
                </View.Item>
                <Button size="small" variant="ghost" onClick={() => onEdit(row.step)}>
                  Change
                </Button>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Carries the upload trade-off all the way through, so the slower
          approval is never a surprise at the end. */}
      {pendingReview && (
        <Alert color="warning" title="Your ID is still being checked">
          <Text variant="caption-1">
            You can submit now. Because your ID was uploaded rather than photographed, a
            person has to review it — approval may take up to 1 working day.
          </Text>
        </Alert>
      )}

      {/* ORIGINAL FIELD 8 — Terms acceptance + submit. */}
      <View gap={3}>
        <Card padding={4}>
          <View gap={2}>
            <Text variant="caption-1" weight="semibold">
              What you're agreeing to
            </Text>
            <Text variant="caption-1" color="neutral-faded">
              We can hold or return payments if a customer disputes them. We may ask for
              more documents if your account activity changes. You can close the account at
              any time and we'll pay out what you're owed.
            </Text>
          </View>
        </Card>

        <FormControl hasError={Boolean(errors.terms)}>
          <Checkbox
            name="terms"
            checked={values.terms}
            onChange={({ checked }) => set('terms', checked)}
            hasError={Boolean(errors.terms)}
          >
            <Text variant="caption-1">
              I've read and accept the merchant terms and the privacy notice
            </Text>
          </Checkbox>
          {errors.terms && <FormControl.Error>{errors.terms}</FormControl.Error>}
        </FormControl>
      </View>
    </View>
  )
}
