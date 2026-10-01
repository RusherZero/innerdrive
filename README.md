# Innerdrive

Original English workplace and personal-life reflection questionnaires inspired by six drives. It is not the official Management Drives assessment or a validated psychometric instrument.

## Run locally

Requires Node.js 20.19+ (or 22.12+) and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL Vite prints. `pnpm build` type-checks and creates `dist/`; `pnpm preview` serves that production build. `pnpm test` runs scoring, content integrity, and saved-data validation tests.

GitHub Pages publishes through `.github/workflows/deploy-pages.yml` on pushes to `main`. The workflow runs `pnpm run build:pages`, which builds assets under `/innerdrive/`, then deploys `dist/`. Keep the Pages source set to **GitHub Actions**. The ordinary `pnpm build` retains root-relative assets for other hosts.

## Behaviour

Choose Workplace or Personal life on the starting screen. Each reflection has 12 original statements covering six situations twice: motivation and frustration. The personal-life reflection covers routines, free time, relationships, goals, changing plans, and everyday demands. Each statement has one response per drive. Allocate exactly 12 whole points, with zero and all 12 on one response allowed. Each section totals 72 points. Results show each drive's percentage independently in both sections; ties remain ties. Explanations are authored, deterministic reflection prompts, not AI-generated judgements.

Progress and the latest result are stored independently in localStorage: Workplace uses the existing `innerdrive-v1` format and Personal life uses `innerdrive-personal-v1`. Existing workplace answers remain compatible. The app opens on the starting screen; select a mode to resume or view its profile. Switching modes preserves both profiles. No answers are sent to a server. Browser storage failures allow completion with a notice. Reset deletes only the selected reflection after confirmation. Browser print supports a PDF report. Changing the questionnaire requires a storage schema version update so old answers are not scored against new content.

Fonts load from Google Fonts with local fallbacks. No analytics, account system, backend, or assessment API is configured. Personal-life results include routine ideas for all six drives, highlighting leading motivations, plus guidance for busy days, changing plans, and social situations based on all tied leading drainers. Evenly distributed profiles present guidance as options to explore. All advice is authored and deterministic, with no weekly planner or cross-profile comparison.

All text and scoring mappings are in `src/data.ts`; scoring and storage validation are in `src/model.ts`.

## Manual acceptance checks

- Switch modes during an unfinished reflection; refresh and verify that each retains its own answers and progress.
- Open legacy workplace results; reset either reflection and verify that the other remains available.
- Complete all 12 statements in both modes using keyboard or pointer; incomplete totals cannot advance.
- Edit allocations, go back, refresh, resume, and review answers before generating results.
- Try equal scores and all points on one drive; verify separate charts and tied leaders.
- Print results and inspect pages; review at narrow mobile and desktop widths.
- Cancel and confirm reset; simulate unavailable storage and corrupt saved data.
