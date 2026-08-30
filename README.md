# noirab_hw

A password-gated take-home assignment site, built with Vite + React and the
Reshaped UI library.

## Scripts

- `npm run dev` — start the local dev server
- `npm test` — run the test suite (vitest)
- `npm run build` — build for production into `dist/`

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that runs the test suite,
builds the site, and deploys it to GitHub Pages.
