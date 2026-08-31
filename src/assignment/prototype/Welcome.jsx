import { View, Text, Card, Button } from 'reshaped'

// The preparedness fix, and the single cheapest change in the whole redesign.
//
// 32.6% of merchants who reached the old ID step abandoned there, and only 3%
// of those bounced inside 30 seconds — they were trying and failing, largely
// because a physical document was demanded seven fields deep with no warning.
// Naming everything up front costs one screen and lets people collect what they
// need before they start, rather than mid-flow with a half-filled form at risk.
const CHECKLIST = [
  {
    title: 'Your business details',
    detail: 'The registered name and business type, as they appear on your registration documents.',
  },
  {
    title: 'Photo ID',
    detail: 'A passport, national ID card or driving licence, for whoever owns the business.',
  },
  {
    title: 'Your registration numbers',
    detail: 'Your tax number and company registration number. Both are on your registration paperwork.',
  },
  {
    title: 'Bank account details',
    detail: 'The account you want your takings paid into.',
  },
]

export default function Welcome({ onStart }) {
  return (
    <View gap={6} align="center" className="welcome">
      <View gap={2} align="center">
        <Text variant="featured-2" weight="bold" align="center">
          Welcome to Paylet
        </Text>
        <Text variant="body-2" color="neutral-faded" align="center">
          Before you can start taking payments, we need a few details about your business.
          {/* Grounded in the data: completed sessions ran a median of 652s.
              Promising "a couple of minutes" would set up a broken promise. */}{' '}
          It takes about 10 minutes, and you can stop and come back at any point.
        </Text>
      </View>

      <div className="welcome-box">
        <Card padding={5}>
          <View gap={4}>
            <Text variant="body-3" weight="semibold">
              What you'll need
            </Text>
            <View gap={4}>
              {CHECKLIST.map((item, index) => (
                <View key={item.title} gap={3} direction="row" align="start" wrap={false}>
                  <Text variant="caption-1" color="primary" monospace weight="medium">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <View.Item grow>
                    <View gap={1}>
                      <Text variant="body-3" weight="medium">
                        {item.title}
                      </Text>
                      <Text variant="caption-1" color="neutral-faded">
                        {item.detail}
                      </Text>
                    </View>
                  </View.Item>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </div>

      {/* Desktop drops at 41.5% on the ID step against mobile's 18.4%. Saying
          this before they start is what turns the handoff from a surprise into
          something they've already prepared for. */}
      <div className="welcome-note">
        <Text variant="caption-1" color="neutral-faded">
          <Text as="span" variant="caption-1" weight="medium">
            Keep your phone within reach.
          </Text>{' '}
          The quickest way to add your ID is to photograph it. Uploading a file works
          too, but takes longer to approve.
        </Text>
      </div>

      <Button color="primary" size="large" onClick={onStart}>
        Get started
      </Button>
    </View>
  )
}
