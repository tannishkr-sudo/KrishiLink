# KrishiLink Product Requirements

## Original problem statement
Rebuild the existing uploaded agricultural marketplace application using its HTML/CSS as the visual source, preserve existing functionality and Supabase configuration where present, keep every provided page reachable, and deliver a responsive, functioning application rather than a screenshot mockup.

## Architecture decisions
- React 19 + React Router provide one reusable application shell and independently reachable workspace routes.
- CSS variables and shared components establish the uploaded KrishiLink sage/light visual language across pages.
- Lucide icons replace the uploaded Material Symbols dependency while keeping the same agricultural icon vocabulary.
- The existing FastAPI/Mongo starter remains available at `/api`; no new backend data contract was invented because the uploaded source contained no Supabase client, tables, queries, or auth flow.

## User personas
- Farmers managing produce lots, stock levels, locations, and sales status.
- Farmers discovering buyer requests, market signals, storage, transport, orders, and conversations.

## Core requirements (static)
- Shared sidebar/topbar navigation.
- Home overview with stock, value, requests, delivery, inventory pulse, and activity.
- Produce inventory with add, view, edit affordance, and mark-sold interaction.
- Buyer request filters and request cards.
- Reachable Marketplace, Market Prices, Storage, Transport, Orders, Messages, and Profile workspaces.
- Desktop, tablet, and mobile responsive behavior with no horizontal overflow.
- Unique descriptive `data-testid` attributes on interactive and critical flow elements.

## What's been implemented

### 2026-03-08
- Replaced the starter page with a KrishiLink application shell and responsive navigation.
- Added Home, My Produce, Buyer Requests, and seven additional independently reachable workspaces.
- Added working filter, add-produce, mark-sold, navigation, mobile menu, and request-detail interactions.
- Recreated the two uploaded reference HTML screens as reusable React UI patterns.
- Verified production build, public preview loading, desktop screenshots, route navigation, mobile overflow, and starter API endpoints.

### 2026-03-09
- Expanded every main workspace with searchable lists, Overview/Activity/Saved tabs, row selection actions, quick actions, status messaging, and workspace-specific content.
- Added independently reachable subroutes for listings, price forecasts, storage locations, transport schedules, order history, new messages, and profile settings.
- Re-ran frontend and backend regression checks; all expanded routes and interactions passed with no UI, route, or console issues.
- Added a Messages voice composer using the browser microphone, with recording timer, stop, audio preview, discard, send, and visible permission/support error handling.
- Verified voice messaging flows and responsive layout on desktop and mobile.

## Prioritized backlog

### P0
- Connect actual Supabase client using the provided environment variables once the source project provides its schema, queries, and auth behavior.
- Replace local in-memory dashboard, produce, and request data with Supabase reads/writes.

### P1
- Add real authentication screens and protected route behavior if present in the source project or Supabase schema.
- Flesh out Marketplace, Market Prices, Storage, Transport, Orders, Messages, and Profile with their corresponding persisted data models.

### P2
- Add charts, map-based logistics views, richer order states, and notification preferences.
- Add offline-friendly draft saving for produce listings.

## Next tasks
1. Obtain the original Supabase schema/query files and auth requirements.
2. Add the Supabase client and map existing tables to the current UI models.
3. Replace local mutation handlers with persisted operations and loading/error states.
4. Expand each generic workspace into the full source page when its original HTML is supplied.