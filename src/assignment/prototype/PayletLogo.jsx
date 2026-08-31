import { View, Text } from 'reshaped'

// Simple wordmark: a rounded tile carrying a geometric P, set against the
// theme's primary. The counter in the P is punched with fill-rule evenodd so
// the mark stays a single path and reads cleanly at small sizes.
export default function PayletLogo({ size = 24 }) {
  return (
    <View direction="row" gap={2} align="center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="24" height="24" rx="6.5" fill="var(--rs-color-background-primary)" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.4 5.8h5a3.75 3.75 0 0 1 0 7.5h-2.5v4.9H8.4V5.8Zm2.5 2.45v2.6h2.5a1.3 1.3 0 0 0 0-2.6h-2.5Z"
          fill="var(--rs-color-foreground-primary)"
        />
      </svg>
      <Text variant="body-3" weight="bold">
        Paylet
      </Text>
    </View>
  )
}
