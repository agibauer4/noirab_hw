import { useState } from 'react'
import { View, Text, Button, Card, Badge, Divider, Alert } from 'reshaped'
import Stepper from './Stepper.jsx'
import Welcome from './Welcome.jsx'
import PayletLogo from './PayletLogo.jsx'
import StatusMark from './StatusMark.jsx'
import Step1Business from './Step1Business.jsx'
import Step2Identity from './Step2Identity.jsx'
import Step3Registration from './Step3Registration.jsx'
import Step4Payout from './Step4Payout.jsx'
import { MARKETS, STEPS, inSentence } from './registry.js'

const INITIAL_VALUES = {
  businessName: '',
  companyType: 'private-limited',
  market: 'vesland',
  email: '',
  ownerName: '',
  taxId: '',
  regNumber: '',
  noRegNumber: false,
  street: '',
  postcode: '',
  city: '',
  addressPrefilled: false,
  accountHolder: '',
  accountNumber: '',
  terms: false,
}

// Validation runs on Continue, not on every keystroke — a merchant shouldn't be
// told they're wrong while still typing. Messages say what to do next, never
// just "invalid".
function validate(step, values, capture) {
  const errors = {}
  const market = MARKETS[values.market] ?? MARKETS.vesland

  if (step === 1) {
    if (!values.businessName.trim()) {
      errors.businessName = 'Enter the name your business is registered under.'
    }
    if (!values.email.trim()) {
      errors.email = 'We need an email to save your progress.'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "That doesn't look like an email address. Check for typos."
    }
  }

  if (step === 2 && capture.status !== 'verified' && capture.status !== 'review') {
    errors.capture = 'Add your photo ID to continue — use your phone or upload a file.'
  }

  if (step === 3) {
    if (!values.taxId.trim()) {
      errors.taxId = `Enter your ${inSentence(market.taxId.label)}. ${market.taxId.hint}`
    }
    // The most common real mistake: the merchant enters the other number. The
    // error names what they probably typed and shows the right shape.
    if (!values.noRegNumber) {
      if (!values.regNumber.trim()) {
        errors.regNumber = `Enter your ${inSentence(market.regNumber.label)}, or tick the box if you don't have one.`
      } else if (values.regNumber.trim() === values.taxId.trim()) {
        errors.regNumber = market.regNumber.wrongEntry.message
      }
    }
    if (!values.street.trim()) errors.street = 'Enter your registered address.'
  }

  if (step === 4) {
    if (!values.accountNumber.trim()) {
      errors.accountNumber = 'Enter the account we should pay into.'
    }
    if (!values.terms) errors.terms = 'You need to accept the terms to open the account.'
  }

  return errors
}

export default function OnboardingPrototype() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [capture, setCapture] = useState({ mode: null, status: 'idle', progress: 0 })
  const [savedAt, setSavedAt] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showedDashboardNote, setShowedDashboardNote] = useState(false)

  const set = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }))
    // Clear the error for a field as soon as the merchant works on it.
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous))
    setSavedAt('just now')
  }

  // Used when the ID scan returns several fields at once.
  const setMany = (patch) => {
    setValues((previous) => ({ ...previous, ...patch }))
    setSavedAt('just now')
  }

  const goNext = () => {
    const found = validate(step, values, capture)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    if (step === 4) {
      setSubmitted(true)
      return
    }
    setStep(step + 1)
    setErrors({})
  }

  if (submitted) {
    // The two endings aren't the same. A verified ID means the account is open;
    // an uploaded one is still with a reviewer, so the copy can't promise
    // payments yet and the CTA can't send them somewhere they can't act.
    const pending = capture.status === 'review'

    return (
      <View gap={5} className="proto-frame">
        <View direction="row" gap={3} align="center">
          <PayletLogo />
        </View>

        <Card padding={{ s: 5, m: 8 }}>
          <View gap={5} align="center">
            <StatusMark tone={pending ? 'warning' : 'positive'} />
            <View gap={2} align="center">
              <Text variant="featured-2" weight="bold" align="center">
                {pending ? "You're all set — we're checking your ID" : "You're all set"}
              </Text>
              <Text variant="body-3" color="neutral-faded" align="center">
                {pending
                  ? "Everything else is done. Someone is reviewing your ID now — we'll email you within 1 working day, and you can take payments as soon as it clears."
                  : "Your account is open and you can start taking payments straight away. We've emailed you a confirmation."}
              </Text>
            </View>
            {/* Needs a real handler: Reshaped renders Button as a <span> when
                it has neither onClick nor href, which leaves the screen's
                primary control unfocusable and dead to the keyboard. */}
            <View gap={2} align="center">
              <Button
                color="primary"
                size="large"
                onClick={() => setShowedDashboardNote(true)}
              >
                {pending ? 'Go to my dashboard' : 'Start taking payments'}
              </Button>
              {showedDashboardNote && (
                <Text variant="caption-1" color="neutral-faded" align="center">
                  The merchant dashboard would open here — beyond the scope of this flow.
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Prototype control, not product chrome — kept outside the card and
            named for what it is, so it can't be mistaken for a real CTA. */}
        <View direction="row" justify="center">
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSubmitted(false)
              setShowedDashboardNote(false)
              setStep(0)
              setValues(INITIAL_VALUES)
              setCapture({ mode: null, status: 'idle', progress: 0 })
              setSavedAt(null)
            }}
          >
            Replay this prototype
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View gap={4} className="proto-frame">
      {/* App chrome, so the prototype reads as a product rather than as more of
          the document it sits inside. */}
      <View direction="row" gap={3} align="center">
        <View.Item grow>
          <PayletLogo />
        </View.Item>
        {savedAt && (
          <Badge size="small" color="positive" variant="faded">
            Draft saved {savedAt}
          </Badge>
        )}
      </View>

      <Divider />

      {step > 0 && <Stepper current={step} onSelect={setStep} />}

      <Card padding={{ s: 4, m: 6 }}>
        <View gap={5}>
          {step === 0 && <Welcome onStart={() => setStep(1)} />}
          {step === 1 && <Step1Business values={values} set={set} errors={errors} />}
          {step === 2 && (
            <Step2Identity
              values={values}
              set={set}
              setMany={setMany}
              capture={capture}
              setCapture={setCapture}
            />
          )}
          {step === 3 && <Step3Registration values={values} set={set} errors={errors} />}
          {step === 4 && (
            <Step4Payout
              values={values}
              set={set}
              errors={errors}
              capture={capture}
              onEdit={setStep}
            />
          )}

          {errors.capture && (
            <Alert color="critical" title="Add your ID first">
              <Text variant="caption-1">{errors.capture}</Text>
            </Alert>
          )}

          {/* The welcome screen carries its own single call to action, so the
              step footer only appears once the form proper has started. */}
          {step > 0 && (
            <>
              <Divider />

              <View direction="row" gap={3} align="center">
                {step > 1 && (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <View.Item grow>
                  <Text variant="caption-2" color="neutral-faded" monospace>
                    Step {step} of {STEPS.length}
                  </Text>
                </View.Item>
                {/* Secondary, and sitting immediately left of the primary, so
                    leaving is an obvious option rather than a hidden one. */}
                <Button variant="outline" onClick={() => setSavedAt('just now')}>
                  Save for later
                </Button>
                <Button color="primary" onClick={goNext}>
                  {step === 4 ? 'Open my account' : 'Continue'}
                </Button>
              </View>
            </>
          )}
        </View>
      </Card>

      <Text variant="caption-2" color="neutral-faded" align="center">
        Your progress is saved as you go. You can close this and come back.
      </Text>
    </View>
  )
}
