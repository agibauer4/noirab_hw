import { useEffect, useRef } from 'react'
import {
  View,
  Text,
  FormControl,
  TextField,
  Card,
  Button,
  Badge,
  Alert,
  ProgressBar,
  Divider,
} from 'reshaped'
import { MARKETS } from './registry.js'

// Step 2 is the whole diagnosis in one screen.
//
// It runs second, not seventh, because it's the biggest loss in the funnel and
// running it early means a merchant hasn't already sunk six fields before
// hitting it. It leads with WHY a person's ID is needed to register a business,
// because the support quotes say nobody knew. And it makes phone capture the
// default path on desktop, because desktop drops at 41.5% here against mobile's
// 18.4% — while keeping the file upload visible, with its cost stated up front
// instead of discovered later.
export default function Step2Identity({ values, set, setMany, capture, setCapture }) {
  const isSoleTrader = values.companyType === 'sole-trader'
  const timerRef = useRef(null)

  // Simulated upload so the progress and success states are real rather than
  // described. Cleared on unmount so leaving mid-upload doesn't leak a timer.
  useEffect(() => () => clearInterval(timerRef.current), [])

  const startUpload = () => {
    clearInterval(timerRef.current)
    setCapture({ mode: 'upload', status: 'uploading', progress: 0 })
    timerRef.current = setInterval(() => {
      setCapture((previous) => {
        if (previous.status !== 'uploading') return previous
        const next = previous.progress + 12
        if (next >= 100) {
          clearInterval(timerRef.current)
          return { ...previous, status: 'review', progress: 100 }
        }
        return { ...previous, progress: next }
      })
    }, 260)
  }

  const startHandoff = () => {
    clearInterval(timerRef.current)
    setCapture({ mode: 'phone', status: 'waiting', progress: 0 })
  }

  // Stands in for the phone finishing capture. The scan yields a name and the
  // address on the document, so both are filled in for the merchant — they stay
  // fully editable, since an ID address is often out of date.
  const completeHandoff = () => {
    setCapture({ mode: 'phone', status: 'verified', progress: 100 })
    const scanned = (MARKETS[values.market] ?? MARKETS.vesland).ocr
    setMany({
      ownerName: values.ownerName || scanned.name,
      street: values.street || scanned.street,
      postcode: values.postcode || scanned.postcode,
      city: values.city || scanned.city,
      addressPrefilled: true,
    })
  }

  const reset = () => {
    clearInterval(timerRef.current)
    setCapture({ mode: null, status: 'idle', progress: 0 })
  }

  return (
    <View gap={5}>
      <View gap={1}>
        <Text variant="featured-3" weight="bold">
          Now we need to check who you are
        </Text>
        {/* CONDITIONAL — a sole trader is the business, so the generic
            "beneficial owner" wording reads as a duplicate question. Sole
            traders drop at 42.8% here, the worst of any company type. */}
        <Text variant="body-3" color="neutral-faded">
          {isSoleTrader
            ? 'You registered as a sole trader, so you and your business are the same in law. We have to confirm your identity before you can take payments.'
            : 'Payment regulators require us to confirm the identity of the person who owns or controls the business. That means one real person, even though you are registering a company.'}
        </Text>
      </View>

      <Alert color="primary" title="Why this is needed">
        <Text variant="caption-1">
          It is a legal requirement for anyone handling payments. We check the document,
          then delete the image. It is never shown to anyone you sell to.
        </Text>
      </Alert>

      {/* ORIGINAL FIELD 6a — UBO name. Pre-filled by OCR when the document is
          read, so the merchant doesn't type what we just scanned. */}
      <FormControl>
        <FormControl.Label>
          {isSoleTrader ? 'Your full name' : "The owner's full name"}
        </FormControl.Label>
        <TextField
          name="ownerName"
          value={values.ownerName}
          onChange={({ value }) => set('ownerName', value)}
          placeholder="Exactly as it appears on the ID"
          endSlot={
            capture.status === 'verified' ? (
              <Badge size="small" color="positive" variant="faded">
                from your ID
              </Badge>
            ) : undefined
          }
        />
        <FormControl.Helper>
          {capture.status === 'verified'
            ? 'Filled in from your document. Change it if it is wrong.'
            : 'We fill this in for you once you add your ID below.'}
        </FormControl.Helper>
      </FormControl>

      <Divider />

      {/* ORIGINAL FIELD 6b — ID document. */}
      <View gap={3}>
        <Text variant="body-3" weight="semibold">
          Add your photo ID
        </Text>

        {capture.status === 'idle' && (
          <View gap={3}>
            <Card padding={4} className="glow-primary">
              <View gap={3}>
                <View direction="row" gap={2} align="center">
                  <Text variant="body-3" weight="semibold">
                    Use your phone
                  </Text>
                  <Badge size="small" color="primary" variant="faded">
                    fastest
                  </Badge>
                </View>
                <Text variant="caption-1" color="neutral-faded">
                  We'll show a QR code. Photograph your ID with your phone and this page
                  updates by itself — you won't lose your place, and you don't need to find
                  a scan.
                </Text>
                <Text variant="caption-2" color="positive" monospace>
                  Usually approved within minutes
                </Text>
                <View direction="row">
                  <Button color="primary" onClick={startHandoff}>
                    Continue on my phone
                  </Button>
                </View>
              </View>
            </Card>

            {/* The fallback is never hidden — someone without a phone to hand
                must not be stuck. Its cost is stated here, not after. */}
            <Card padding={4}>
              <View gap={3}>
                <Text variant="body-3" weight="semibold">
                  Upload a file instead
                </Text>
                <Text variant="caption-1" color="neutral-faded">
                  If you already have a photo or scan saved. JPG, PNG or PDF, up to 10 MB.
                </Text>
                <Text variant="caption-2" color="warning" monospace>
                  Checked by a person — approval can take up to 1 working day
                </Text>
                <View direction="row">
                  <Button variant="outline" onClick={startUpload}>
                    Choose a file
                  </Button>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* HANDOFF WAITING — the desktop tab keeps control throughout. */}
        {capture.status === 'waiting' && (
          <Card padding={5}>
            <View gap={4} align="center">
              <div className="proto-qr" aria-hidden="true" />
              <View gap={1} align="center">
                <Text variant="body-3" weight="semibold">
                  Scan this with your phone camera
                </Text>
                <Text variant="caption-1" color="neutral-faded" align="center">
                  Keep this page open. It updates on its own when your phone is done.
                </Text>
              </View>
              <View direction="row" gap={2} align="center">
                <Text variant="caption-2" color="neutral-faded" monospace>
                  Waiting for your phone…
                </Text>
              </View>
              <View direction="row" gap={2}>
                <Button size="small" color="primary" onClick={completeHandoff}>
                  Simulate phone finishing
                </Button>
                <Button size="small" variant="ghost" onClick={startUpload}>
                  Upload a file instead
                </Button>
              </View>
            </View>
          </Card>
        )}

        {/* UPLOAD PROGRESS */}
        {capture.status === 'uploading' && (
          <Card padding={5}>
            <View gap={3}>
              <Text variant="body-3" weight="semibold">
                Uploading passport-scan.jpg
              </Text>
              <ProgressBar value={capture.progress} ariaLabel="Upload progress" />
              <View direction="row" gap={3} align="center">
                <View.Item grow>
                  <Text variant="caption-2" color="neutral-faded" monospace>
                    {capture.progress}% — don't close this tab
                  </Text>
                </View.Item>
                <Button size="small" variant="ghost" onClick={reset}>
                  Cancel
                </Button>
              </View>
            </View>
          </Card>
        )}

        {/* UPLOAD DONE — but honest that it isn't verified yet. */}
        {capture.status === 'review' && (
          <Alert color="warning" title="Uploaded — waiting on a manual check">
            <View gap={2}>
              <Text variant="caption-1">
                We couldn't read this automatically, so someone will check it. You can
                finish the rest now; approval may take up to 1 working day.
              </Text>
              <View direction="row" gap={2}>
                <Button size="small" variant="outline" onClick={startHandoff}>
                  Use my phone instead — faster
                </Button>
                <Button size="small" variant="ghost" onClick={reset}>
                  Start over
                </Button>
              </View>
            </View>
          </Alert>
        )}

        {/* VERIFIED */}
        {capture.status === 'verified' && (
          <Alert color="positive" title="Identity confirmed">
            <View gap={2}>
              <Text variant="caption-1">
                Your ID was read and checked. We've filled in your name above from the
                document.
              </Text>
              <View direction="row">
                <Button size="small" variant="ghost" onClick={reset}>
                  Use a different document
                </Button>
              </View>
            </View>
          </Alert>
        )}
      </View>
    </View>
  )
}
