# IISA (Israeli Imaginary Space Agency)

Front-end project built with Angular 20 and Angular Material.

## Prerequisites
- Node.js 20+
- npm 10+

## Setup
npm install
npm start
Then open `http://localhost:4200`.

## Scripts
- `npm start`: Run dev server with HMR
- `npm run build`: Production build

## Tech Stack
- Angular 20 (standalone components)
- Angular Material 20
- RxJS

## Project Structure
- Landing page
  - Candidate form for new candidate / editing existing candidate
- Management dashboard
  - List of candidates with search/filter
  - Candidate detail view with next/previous
  - Live updates

## Project folders Structure
The project was built using modern Angular versions.
In recent Angular versions, the framework emphasizes the use of stand-alone components.
For this reason, I did not separate the app into multiple modules.

To maintain organization and a clear structure, I arranged the folders to reflect the conceptual modules:

  dashboard/ – contains all dashboard-related components and functionality

  landing/ – contains all landing page-related components and functionality

  shared/ – contains shared components used across the app

  core/ – contains services and logic shared across the project

The project structure under src/app/ looks like this:
src/app/
  core/
  features/
  landing/
  shared/
  app.routes.ts
  app.ts


## Data & real-time synchronization
- Uses Firebase’s backend services, which provide real-time data synchronization out of the  box eliminating the need to implement polling or WebSocket logic manually.

## Notes
Some highlights related to the Angular version:
- I preferred using signals instead of RxJS wherever possible, as they are easier to work with and, in my opinion, lead to more readable and clear code.
- Components were built as stand-alone.
- Inside the templates, I utilized the Control Flow Syntax.

## Deployment
- Build the project using npm run build.
- Deployed on Firebase Hosting.