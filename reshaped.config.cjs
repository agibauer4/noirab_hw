const { generateThemeColors } = require("@reshaped/theming");

// Custom Reshaped theme for noirab_hw — a royal blue / orange duo, pushed
// toward a darker, high-tech edge (sharper corners, a more technical display
// face). Primary and warning both get hand-tuned dark-mode chroma so they
// stay vivid instead of the muted tones Reshaped's default dark-mode
// auto-derivation produces. Every pairing below is checked against WCAG AA
// (text >=4.5:1, non-text UI contrast against the page >=3:1):
//   - white on primary dark (#5553d2):     5.91:1
//   - primary dark vs page background:     3.29:1
//   - black on warning (light or dark):    7.2-7.8:1
module.exports = {
  themes: {
    noirab: {
      color: generateThemeColors({
        // Royal blue/indigo. The raw brand hex is dark enough that white text
        // reads great (10.5:1) but the shape itself nearly disappears against
        // a near-black page (1.84:1, fails the 3:1 non-text UI minimum) — so
        // dark mode gets a lifted, same-hue variant instead of the raw brand color.
        primary: {
          hex: "#3626A7",
          hexDark: "#5553d2",
        },
        // True vivid orange (not gold/amber) for the blue/orange accent duo.
        warning: {
          oklch: { l: 0.72, c: 0.22, h: 45 },
        },
        // Same hue family as the royal blue primary, for cohesion.
        neutral: { oklch: { l: 0.4875, c: 0.054, h: 278 } },
      }),
      radius: {
        small: { px: 2 },
        medium: { px: 4 },
        large: { px: 8 },
      },
      fontFamily: {
        headline: {
          family:
            "Space Grotesk, Inter, BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif",
        },
        title: {
          family:
            "Space Grotesk, Inter, BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif",
        },
      },
    },
  },
};
