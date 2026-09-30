# Innerdrive

An original English workplace reflection questionnaire inspired by six drives. It is not the official Management Drives assessment or a validated psychometric instrument.

## Run locally

Requires Node.js 20.19+ (or 22.12+) and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL Vite prints. `pnpm build` type-checks and creates `dist/`; `pnpm preview` serves that production build. `pnpm test` runs scoring, content integrity, and saved-data validation tests.

GitHub Pages publishes through `.github/workflows/deploy-pages.yml` on pushes to `main`. The workflow runs `pnpm run build:pages`, which builds assets under `/innerdrive/`, then deploys `dist/`. Keep the Pages source set to **GitHub Actions**. The ordinary `pnpm build` retains root-relative assets for other hosts.

## Behaviour

12 original statements cover six workplace situations twice: motivation and frustration. Each statement has one response per drive. Allocate exactly 12 whole points, with zero and all 12 on one response allowed. Each section totals 72 points. Results show each drive's percentage independently in both sections; ties remain ties. Explanations are authored, deterministic reflection prompts, not AI-generated judgements.

Progress and the latest result live in localStorage under `innerdrive-v1`. No answers are sent to a server. Browser storage failures allow completion with a notice. Reset deletes saved answers after confirmation. Browser print supports a PDF report. Changing the questionnaire requires a storage schema version update so old answers are not scored against new content.

Fonts load from Google Fonts with local fallbacks. No analytics, account system, backend, or assessment API is configured. All text and scoring mappings are in `src/data.ts`; scoring and storage validation are in `src/model.ts`.

## Manual acceptance checks

- Complete all 12 statements using keyboard or pointer; incomplete totals cannot advance.
- Edit allocations, go back, refresh, resume, and review answers before generating results.
- Try equal scores and all points on one drive; verify separate charts and tied leaders.
- Print results and inspect pages; review at narrow mobile and desktop widths.
- Cancel and confirm reset; simulate unavailable storage and corrupt saved data.
