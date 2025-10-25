## Quick orientation

This is a small React + Vite app (see `package.json`). Key facts for an AI coding agent to be immediately productive:

- Runner: Vite (dev/build/preview). Scripts are in `package.json`: `dev`, `build`, `preview`, `lint`.
- App entry: `src/main.jsx` -> mounts `src/App.jsx`.
- Firebase: an example config is provided in `src/firebase.example.js`. The app expects a `src/firebase.js` exporting `db` and `storage` (Firestore + Storage).

## How to run locally

- Install dependencies with your package manager of choice (repo uses npm metadata):

  - Development: `npm run dev` — starts Vite with HMR.
  - Build: `npm run build` — produces production output via Vite.
  - Preview: `npm run preview` — run a local preview of the build.
  - Lint: `npm run lint` — runs ESLint across the codebase.

Note: this repo uses ESM (`"type": "module"` in `package.json`) and React 19 with Vite plugin `@vitejs/plugin-react`.

## Project layout & important files

- `src/main.jsx` — application bootstrap (StrictMode + render).
- `src/App.jsx` — primary component and example UI.
- `src/assets/` and `public/` — static assets and files served by Vite. Note `'/vite.svg'` is referenced directly (Vite serves root public assets).
- `src/firebase.example.js` — example Firebase config + initialization. Use this as the canonical pattern when creating `src/firebase.js`.

## Firebase details & gotchas (important)

- The project expects `src/firebase.js` to export named `db` and `storage` (Firestore and Storage):

  ```js
  import { initializeApp } from 'firebase/app'
  import { getFirestore } from 'firebase/firestore'
  import { getStorage } from 'firebase/storage'

  const app = initializeApp(firebaseConfig)
  export const db = getFirestore(app)
  export const storage = getStorage(app)
  ```

- There is a present `src/firebase.js` file in the repo that appears to contain typographical errors (e.g. `initalizeApp`, `getStroage`). Prefer using `src/firebase.example.js` as the correct reference.

## Conventions & patterns to follow

- Keep React components as `.jsx` files (current codebase uses `.jsx`).
- Single default export for top-level components (see `App.jsx` import style in `main.jsx`).
- Use named exports from utility/service files (Firebase exports `db`, `storage`) rather than default exports for easier testing/mocking.
- Prefer importing images from `src/assets` or referencing `public/` assets with absolute paths (e.g., `/vite.svg`).

## Integration points / external dependencies

- Firebase (package `firebase`, currently in `package.json`). Code expects the modular SDK (v9+ style imports such as `initializeApp`, `getFirestore`, `getStorage`).
- Vite + React (HMR via `@vitejs/plugin-react`).
- ESLint is configured via devDependencies; use `npm run lint` to surface style issues.

## Recommended agent behaviors (practical, codebase-specific)

- When adding or editing Firebase initialization, always mirror `src/firebase.example.js` and keep secrets out of source control. If you see `initalizeApp` / `getStroage` typos, fix them to `initializeApp` and `getStorage`.
- For UI changes, run `npm run dev` locally to validate HMR behavior; prefer small, visible iterations.
- Avoid introducing TypeScript without adding tsconfig and updating build configs — the repo is plain ESM + JSX.
- When adding tests or build tooling, update `package.json` scripts and include a short README note for the team.

## Where to look for more context

- `package.json` — scripts and dependency versions.
- `README.md` — template notes and why certain defaults are chosen.
- `src/firebase.example.js` — canonical Firebase initialization pattern used by the project.
- `src/App.jsx`, `src/main.jsx` — component and bootstrapping patterns.

## If you need to modify the repo

- Prefer minimal, targeted PRs. Provide a short verification checklist in the PR body (how to run locally, what to look for).
- If you introduce new environment requirements (e.g., a `.env` file), document them in `README.md` and do not commit secrets.

---

If any section above is unclear or you'd like more detail (e.g., expected shape for Firestore documents used by the app), tell me which area to expand and I'll iterate.
