import { View, Text, FormControl, TextField, Select } from 'reshaped'
import { COMPANY_TYPES, MARKETS, NAME_MAX } from './registry.js'

// Step 1 is deliberately the two things every merchant knows without looking
// anything up, plus the email that makes save-and-resume possible. Nothing here
// requires leaving the desk.
export default function Step1Business({ values, set, errors }) {
  const nameLength = values.businessName.length

  return (
    <View gap={5}>
      <View gap={1}>
        <Text variant="featured-3" weight="bold">
          Tell us about your business
        </Text>
        <Text variant="body-3" color="neutral-faded">
          Four short steps. You can stop at any point and pick up where you left off.
        </Text>
      </View>

      {/* ORIGINAL FIELD 1 — Business / legal name */}
      <FormControl hasError={Boolean(errors.businessName)}>
        <FormControl.Label>Registered business name</FormControl.Label>
        <TextField
          name="businessName"
          value={values.businessName}
          onChange={({ value }) => set('businessName', value.slice(0, NAME_MAX))}
          placeholder="As written on your registration documents"
          hasError={Boolean(errors.businessName)}
          endSlot={
            <Text
              variant="caption-2"
              monospace
              color={nameLength > NAME_MAX - 20 ? 'warning' : 'neutral-faded'}
            >
              {nameLength}/{NAME_MAX}
            </Text>
          }
        />
        {errors.businessName ? (
          <FormControl.Error>{errors.businessName}</FormControl.Error>
        ) : (
          <FormControl.Helper>
            Your legal name, not your trading name. They can be different.
          </FormControl.Helper>
        )}
      </FormControl>

      {/* ORIGINAL FIELD 2 — Company type. Chosen early because it decides what
          later steps ask for. */}
      <FormControl>
        <FormControl.Label>What kind of business is it?</FormControl.Label>
        <Select
          name="companyType"
          value={values.companyType}
          onChange={({ value }) => set('companyType', value)}
          placeholder="Choose one"
        >
          {COMPANY_TYPES.map((type) => (
            <Select.Option key={type.value} value={type.value}>
              {type.label}
            </Select.Option>
          ))}
        </Select>
        <FormControl.Helper>
          This changes what we need from you later, so it's worth getting right.
        </FormControl.Helper>
      </FormControl>

      {/* ADDED — decides which registry vocabulary step 3 uses. */}
      <FormControl>
        <FormControl.Label>Where is it registered?</FormControl.Label>
        <Select
          name="market"
          value={values.market}
          onChange={({ value }) => set('market', value)}
          placeholder="Choose a country"
        >
          {Object.entries(MARKETS).map(([key, market]) => (
            <Select.Option key={key} value={key}>
              {market.label}
            </Select.Option>
          ))}
        </Select>
        <FormControl.Helper>
          Different countries use different registration numbers. We'll ask for the right
          ones.
        </FormControl.Helper>
      </FormControl>

      {/* ADDED — the address save-and-resume sends the link to. */}
      <FormControl hasError={Boolean(errors.email)}>
        <FormControl.Label>Your email</FormControl.Label>
        <TextField
          name="email"
          value={values.email}
          onChange={({ value }) => set('email', value)}
          placeholder="you@yourbusiness.com"
          hasError={Boolean(errors.email)}
          inputAttributes={{ type: 'email', autoComplete: 'email' }}
        />
        {errors.email ? (
          <FormControl.Error>{errors.email}</FormControl.Error>
        ) : (
          <FormControl.Helper>
            We save your progress here, so you can close this and come back.
          </FormControl.Helper>
        )}
      </FormControl>
    </View>
  )
}
