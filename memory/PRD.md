# KrishiLink Product Requirements

## Original problem statement
Rebuild the uploaded agricultural marketplace app (KrishiLink) as a complete, responsive React application, keep every page reachable, add interactive elements everywhere plus a voice message sender, and (originally) preserve the provided Supabase setup.

## Latest user request (June 2026)
"Make all the buttons interactive and usable and type box when needed and make the whole webpage and every page of it and UI design should be more beautiful."
User choices: in-app state only (no persistence for now), add charts on Market Prices and Dashboard, make everything work and look great.

## Architecture
- React 19 + React Router 7, CRA/craco, `@/` path alias.
- Modular structure: `src/pages/*` (10 pages), `src/components/Shell.jsx`, `src/components/UIKit.jsx` (Modal, ConfirmDialog, Field, Toolbar, Menu, Toaster, Badge, Meter, Toggle), `src/store/AppStore.jsx` (single in-memory context store with all actions), `src/data/seed.js`, `src/styles/theme.css` (full design token system).
- Charts via recharts. Icons via lucide-react. No backend/Supabase wiring — all data is in-memory React state.

## What's been implemented

### 2026-03-08 / 2026-03-09
- App shell, responsive navigation, all 10 workspaces reachable, browser voice recorder in Messages.

### 2026-06-01 (this session)
- Refactored the bloated single-file `App.js` into modular pages, a shared UI kit, and a central store.
- Removed every `window.prompt` / `alert` / `confirm`; replaced with in-app modals, validated forms and toast feedback.
- Every button is now functional: topbar language menu, notifications dropdown (mark read / dismiss), profile menu, sidebar CTA & badges, crumbs.
- My Produce: add / edit / view-lot / delete-confirm / mark-sold, status tabs, search.
- Buyer Requests: working filter form + reset, sort chips, request detail modal with offer form that creates a real conversation.
- Marketplace: tabs, search, save toggle, publish-listing modal, contact-buyer modal that opens a conversation.
- Market Prices: crop chips, 7/30-day range, line + bar recharts, searchable price table, price alerts create/remove.
- Storage: capacity meters, add-location modal, book-space modal that updates usage, delete confirm.
- Transport: schedule-pickup modal, status progression (Scheduled → In transit → Delivered), trip details, cancel confirm.
- Orders: computed stats, status tabs, search, order detail modal, invoice download toast, dispatch/deliver actions.
- Messages: multi-conversation list with unread badges, text composer, voice recorder with waveform/timer/preview/discard/send, conversation options menu, new-conversation modal.
- Profile: validated farm details form with save/reset, preferences toggles, language selector, profile summary card.
- New premium design system: cream/deep-green palette, Outfit + DM Sans, grain overlay, glass topbar, layered shadows, pill buttons, micro-animations, staggered page fade-up, mobile-first responsive rules.
- Verified by testing agent (iteration_4.json): 100% of requested frontend flows passed, zero console errors, zero native dialogs.

## Prioritized backlog

### P0
- None open.

### P1
- Persistence: wire Supabase (client + auth + tables) or the FastAPI/Mongo backend so produce, orders, messages and profile survive reloads.
- Upload voice messages to storage instead of local blob URLs.

### P2
- Harvest planner calendar, notification centre page, offline draft saving for listings, map-based logistics view.
- Multi-language content (currently the language switch only sets a label).

## Next tasks
1. Confirm persistence choice with the user (Supabase vs existing FastAPI/Mongo).
2. Implement auth + protected routes once persistence is chosen.
3. Replace store actions with API calls and add loading/error states.

## 2026-06-01 — Vercel production build fix
- Root cause: no lockfile committed for the frontend, so Vercel installs with npm; npm ignores yarn `resolutions` and hoisted ajv@6 to the root while `ajv-keywords@5` (via schema-utils → terser-webpack-plugin → react-scripts) requires ajv@8 → `Cannot find module 'ajv/dist/compile/codegen'` and `craco build` exit 1.
- Fix (package.json only): devDependencies `ajv@8.17.1`, `ajv-keywords@5.1.0` and npm `overrides: { "ajv-keywords": { "ajv": "8.17.1" } }`. React stayed at 19.0.0, no architecture or app-code changes.
- Verified by testing agent (iteration_5.json): clean `npm install --legacy-peer-deps` + `CI=true NODE_ENV=production npm run build` exits 0 ("Compiled successfully"), local yarn build still passes, all 10 pages regress clean with 0 console errors.
- Note: if `ajv-keywords` is upgraded later, keep the `overrides.ajv-keywords.ajv` major in sync.
- Not changed (optional follow-up): no `vercel.json` rewrite rule exists, so direct deep links like /produce will 404 on Vercel until a SPA rewrite (`{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`) is added.
