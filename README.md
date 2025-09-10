# IISA (Israeli Imaginary Space Agency)

Front-end take-home built with Angular 20 and Angular Material.

## Prerequisites
- Node.js 20+
- npm 10+

## Setup
```bash
npm install
npm start
```
Then open `http://localhost:4200`.

## Scripts
- `npm start`: Run dev server with HMR
- `npm run build`: Production build
- `npm run lint`: Lint
- `npm test`: Unit tests (none added yet)

## Tech Stack
- Angular 20 (standalone components)
- Angular Material 20
- RxJS

## Features
- Landing page (TBD)
- Management dashboard
  - List of candidates with search/filter
  - Candidate detail view with next/previous
  - Live updates via localStorage + RxJS

## Project Structure
```
src/app/
  core/
    services/
      candidate.service.ts  # storage + live updates
  features/
    dashboard/
      dashboard-list/
      candidate-detail/
      candidate-card/
  app.routes.ts
  app.ts
  app.html
```

## Data & Persistence
- Uses `localStorage` key `iisa:candidates`.
- Cross-tab updates handled via `storage` events.

## Notes
- Built with Angular CLI 20.
- Material theme added via `ng add @angular/material@20`.

## Deployment
- Build with `npm run build` and deploy `dist/iisa`.
