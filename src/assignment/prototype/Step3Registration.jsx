import { View, Text, FormControl, TextField, Checkbox, Badge, Select } from 'reshaped'
import { MARKETS } from './registry.js'

// Step 3 is Finding 02 turned into a form. Every label comes from the selected
// market's own registry vocabulary, every field shows the shape it expects, and
// the error for the most common mistake — entering the other number — says what
// went wrong and what the right one looks like.
export default function Step3Registration({ values, set, errors }) {
  const market = MARKETS[values.market] ?? MARKETS.vesland
  const isSoleTrader = values.companyType === 'sole-trader'

  return (
    <View gap={5}>
      <View gap={1}>
        <Text variant="featured-3" weight="bold">
          Your registration details
        </Text>
        <Text variant="body-3" color="neutral-faded">
          {values.addressPrefilled
            ? `These come from your ${market.label} registration documents. We've filled in the address we read from your ID — check it and change anything that's wrong.`
            : `These come from your ${market.label} registration documents.`}
        </Text>
      </View>

      {/* ORIGINAL FIELD 3 — Tax ID, named the way this market names it. */}
      <FormControl hasError={Boolean(errors.taxId)}>
        <FormControl.Label>{market.taxId.label}</FormControl.Label>
        <TextField
          name="taxId"
          value={values.taxId}
          onChange={({ value }) => set('taxId', value)}
          placeholder={market.taxId.placeholder}
          hasError={Boolean(errors.taxId)}
        />
        {errors.taxId ? (
          <FormControl.Error>{errors.taxId}</FormControl.Error>
        ) : (
          <FormControl.Helper>{market.taxId.hint}</FormControl.Helper>
        )}
      </FormControl>

      {/* ORIGINAL FIELD 4 — Registration number.
          CONDITIONAL: sole traders in some markets genuinely don't have one, and
          forcing a value invents data. The escape hatch is explicit rather than
          leaving them stuck on a required field they can't satisfy. */}
      <View gap={2}>
        <FormControl hasError={Boolean(errors.regNumber)} disabled={values.noRegNumber}>
          <FormControl.Label>{market.regNumber.label}</FormControl.Label>
          <TextField
            name="regNumber"
            value={values.noRegNumber ? '' : values.regNumber}
            onChange={({ value }) => set('regNumber', value)}
            placeholder={market.regNumber.placeholder}
            hasError={Boolean(errors.regNumber)}
            disabled={values.noRegNumber}
          />
          {errors.regNumber ? (
            <FormControl.Error>{errors.regNumber}</FormControl.Error>
          ) : (
            <FormControl.Helper>{market.regNumber.hint}</FormControl.Helper>
          )}
        </FormControl>

        {isSoleTrader && (
          <Checkbox
            name="noRegNumber"
            checked={values.noRegNumber}
            onChange={({ checked }) => set('noRegNumber', checked)}
          >
            <Text variant="caption-1">
              I don't have one — sole traders in {market.label} are not always registered
            </Text>
          </Checkbox>
        )}
      </View>

      {/* ORIGINAL FIELD 5 — Registered business address. */}
      <View gap={3}>
        <View direction="row" gap={2} align="center">
          <Text variant="body-3" weight="semibold">
            Registered business address
          </Text>
          {values.addressPrefilled && (
            <Badge size="small" color="positive" variant="faded">
              from your ID
            </Badge>
          )}
        </View>

        <FormControl hasError={Boolean(errors.street)}>
          <FormControl.Label>Street and number</FormControl.Label>
          <TextField
            name="street"
            value={values.street}
            onChange={({ value }) => set('street', value)}
            placeholder={market.addressPlaceholder}
            hasError={Boolean(errors.street)}
          />
          {errors.street ? (
            <FormControl.Error>{errors.street}</FormControl.Error>
          ) : (
            values.addressPrefilled && (
              <FormControl.Helper>
                Taken from your ID. Change it if your business is registered elsewhere.
              </FormControl.Helper>
            )
          )}
        </FormControl>

        <View direction="row" gap={3}>
          <View.Item columns={{ s: 12, m: 4 }}>
            <FormControl>
              <FormControl.Label>Postcode</FormControl.Label>
              <TextField
                name="postcode"
                value={values.postcode}
                onChange={({ value }) => set('postcode', value)}
                placeholder={market.postcodePlaceholder}
              />
            </FormControl>
          </View.Item>
          <View.Item columns={{ s: 12, m: 8 }}>
            <FormControl>
              <FormControl.Label>City</FormControl.Label>
              <TextField
                name="city"
                value={values.city}
                onChange={({ value }) => set('city', value)}
                placeholder={market.cityPlaceholder}
              />
            </FormControl>
          </View.Item>
        </View>

        {/* Editable, not locked. A merchant who picked the wrong country in
            step 1 shouldn't have to walk backwards to fix it — and changing it
            here re-labels the two number fields above straight away. */}
        <FormControl>
          <FormControl.Label>Country of registration</FormControl.Label>
          <Select
            name="country"
            value={values.market}
            onChange={({ value }) => set('market', value)}
          >
            {Object.entries(MARKETS).map(([key, entry]) => (
              <Select.Option key={key} value={key}>
                {entry.label}
              </Select.Option>
            ))}
          </Select>
          <FormControl.Helper>
            Changing this changes which registration numbers we ask for.
          </FormControl.Helper>
        </FormControl>
      </View>
    </View>
  )
}
