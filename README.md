# TalentFlow 

## LOGIN CREDENTIALS 
## EMAIL : admin@test.com
## PASSWORD : 123456



## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Architecture](#project-architecture)
- [Frontend](#frontend)
- [Backend Simulation (MirageJS + Dexie)](#backend-simulation-miragejs--dexie)
- [Data Model](#data-model)
- [Folder Structure & Key Files](#folder-structure--key-files)
- [Key technical decisions](#key-technical-decisions)
- [API Routes & Authentication](#api-routes--authentication)
- [Working With the Project](#working-with-the-project)
- [Testing & Deployment](#testing--deployment)
- [Future Improvements & Roadmap](#future-improvements--scalability)
- [Contribution Guidelines](#contribution-guidelines)

## Project Overview

**TalentFlow** is a modern, full-stack applicant tracking and assessment management system created to streamline and enhance the hiring process for teams of any size. It brings together job posting, candidate pipeline management, and custom assessment building—all within a fast, intuitive interface inspired by the look and feel of top music streaming apps.

The application leverages a simulated backend (MirageJS + Dexie/IndexedDB) for a seamless local development experience—no real server or database needed. This makes the project ideal for rapid prototyping, demonstration, or hackathons.

---

## Main Features


# User & Authentication
User Signup: New users can register through a simple onboarding form.
User Login: Registered users can securely sign in with their credentials.
Persistent Sessions: Authentication persists across page reloads using JWT-based session handling stored locally.
Demo Authentication: For demonstration purposes, login/logout is managed via local storage to gate access.
# Job Management
Create & Edit Job Posts: HR users can create, edit, and update job details with an intuitive interface.
Drag-and-Drop Job Reordering: Job cards can be rearranged to reflect hiring priorities or workflow stages.
Archive/Unarchive Jobs: Users can archive inactive job postings and restore them later when needed.
Detailed Job View & Inline Editing: Clicking on a job card opens a slide-over panel for viewing or updating job information seamlessly.
Rich UI: A beautifully themed, responsive dashboard provides interactive lists, modals, and real-time visual updates
# Candidate Tracking
Visual Pipelines: HR teams can visualize the entire candidate pipeline using a Kanban-style interface.
Drag-and-Drop Stage Movement: Candidates can be moved between different stages easily with drag-and-drop functionality.
Restricted Backward Movement: Process integrity is maintained by preventing unauthorized backward stage transitions.
Real-Time Updates: Candidate stage updates and changes reflect immediately across the interface.
# Custom Assessments
Create & Update Assessments: Build customizable multi-section assessments with conditional logic and live preview.
Delete Assessments: Remove outdated or unnecessary assessments from the system.
Send Assessments to Candidates: Assign and distribute assessment links directly to candidates.
Assessment Submissions: Candidates can complete and submit assessments (future candidate portal to be added).
Preview Pane: HR users can view assessment structure and content updates in real-time before sending.
# Future Modifications
Candidate Assessment Portal: A planned feature to enable candidates to take assigned assessments online, with automatic submission and result storage in the system’s database for HR review and scoring.
# Simulated Backend
Local Data Storage: All data (jobs, candidates, assessments, and user interactions) is stored locally using MirageJS and Dexie.
Simulated APIs & Error Handling: Mock APIs replicate real-world scenarios, including success, loading, and error states.
Zero Deployment Requirements: The entire app runs locally—no backend hosting or database setup needed. Simply npm install and npm start.

---

## Tech Stack

- **Frontend**: React 19, TailwindCSS (custom dark theme), React Router v7, Headless UI, React Icons, React Hot Toast
- **Simulated Backend**: MirageJS (API mocking), Dexie (IndexedDB abstraction)
- **Testing**: React Testing Library, Jest
- **Tools**: Faker.js for data seed, Create React App
- **Hosting**: Designed for static hosting (Vercel, Netlify, GitHub Pages, etc.), but can run locally with `react-scripts`
- **No real backend/server or cloud database is required**

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sahil-mehran.git
cd sahil-mehran
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm start
```

Open http://localhost:3000 

The app is fully functional with mocked backend.

---

## Environment Variables

There are **no required environment variables**. All tokens, authentication, and data persistence are handled using local storage (for demo auth) and IndexedDB (via Dexie). External API calls are fully mocked, and no sensitive configuration is needed.

---
## Project Architecture
-Frontend
React 19 is the main framework.
TailwindCSS is used for rapid and responsive UI development with a custom dark theme.
React Router v7 for client-side routing.
Headless UI, React Icons, React Hot Toast for consistent UI patterns, icons, and toast notifications.
-Simulated Backend
MirageJS mocks REST API endpoints directly in the browser, allowing API-like development without a real server.
Dexie wraps IndexedDB for persistent storage, enabling complex queries and multi-table schema locally.
No actual backend/server or cloud DB is used; everything runs in-browser.
-Application Layers
Components Layer: Presentational and layout components organized by domains (Jobs, Assessments, Candidates, Layout).
Context Layer: Custom React context for authentication (src/context/AuthContext.jsx).
Hooks Layer: Project-specific React hooks for encapsulated logic (e.g., src/hooks/useJobs.js).
Pages Layer: Main route-enabled application pages (Jobs, Candidates, Assessments, Landing Page).
Routes Layer: Custom routing management and route protection (src/routes/AppRoutes.jsx, src/routes/ProtectedRoute.jsx).
-Mirage Server & Data Modeling
The server boots in src/mirage/server.js and seeds demo data (jobs, candidates, assessments).
The data model is formalized in src/mirage/db/index.js using Dexie’s schema for jobs, candidates, assessments, and candidate timelines.
## Running Backend & Frontend Locally

- **Frontend**: 
  - Start with `npm start` (runs on port 3000).
- **Backend (Simulated)**:
  - There is no separate backend server. MirageJS auto-initializes with the app (see `src/index.js`).

---

## Folder Structure & Key Files

```
TalentFlow/
├── public/                # Static files, HTML template
├── src/
│   ├── components/        # All presentational & layout components
│   │   ├── Layout/        # Main shell, sidebar, navbar
│   │   │   ├── JobComponents/         # Job cards, detail, editing
│   │   │   ├── AssessmentComponents/  # Assessment cards, builder UI
│   │   │   ├── CandidateComponents/   # Candidate cards, modal
│   ├── constants/         # Shared static data (pipeline stages, etc)
│   ├── context/           # React Context for Auth
│   ├── hooks/             # Custom React hooks
│   ├── mirage/            # MirageJS server, routes, seeds, API logic
│   │   ├── routes/        # jobs, candidates, assessments
│   │   ├── db/            # Dexie IndexedDB config
│   ├── pages/             # Main route pages
│   │   ├── assessments/   # Assessment listing and builder views
│   ├── routes/            # React router config, ProtectedRoute
│   ├── index.js           # App entrypoint, MirageJS boot
│   └── App.js             # Main app container
├── tailwind.config.js     # TailwindCSS theming
└── package.json
```

**Key Files:**
- `src/mirage/server.js`: MirageJS server and API mocking setup
- `src/mirage/db/index.js`: Dexie schema for local IndexedDB
- `src/context/AuthContext.jsx`: Demo authentication logic
- `src/routes/AppRoutes.jsx`: SPA routes

---
##  Key Technical Decisions


### State Management: Context API + Custom Hooks
- We chose React Context with custom hooks over Redux for its **optimal complexity-to-benefit ratio**. This architecture provides clean separation of concerns with feature-specific contexts (Jobs, Candidates, Assessments) while    avoiding unnecessary boilerplate. The app's clear domain boundaries and moderate state complexity make this approach both sufficient and superior for maintainability.
- Custom React Hooks instead of Redux for simpler state management as per requirement
- Component composition over complex prop drilling 
- Separation of concerns with hooks handling logic and components handling UI
## Data Management
-MirageJS for mock API during development
-IndexedDB via Dexie for client-side persistence
-Optimistic updates for instant UI feedback
-Automatic rollback on API failures
## User Experience
Drag & drop with @hello-pangea/dnd library
Real-time updates without page refresh
Toast notifications for user feedback
Defensive error handling to prevent crashes
## Performance
Efficient re-renders with proper state management
Local state updates to minimize API calls
Modular component structure for better maintainability
## Security & Workflow
Token-based assessment system for candidate testing
Time-limited access links
authentication required for security

## API Routes & Authentication

**All API routes are mocked via MirageJS:**

- `GET /api/jobs`, 
- `POST /api/jobs`,
- `PATCH /api/jobs/:id`,
- `PATCH /api/jobs/:id/archive`
- `PATCH /api/jobs/:id/reorder`,
- `GET /api/candidates`, 
- `POST /api/candidates`,
- `PATCH /api/candidates/:id`
- `GET /api/assessments`,
- `POST /api/assessments`, 
- `PUT /api/assessments/:jobId`, 
- `DELETE /api/assessments/:id`

**Authentication:**  
- Simple login sets a mock token to localStorage
- `ProtectedRoute` gates all `/app/*` routes (jobs, candidates, assessments)
- No real RBAC or cryptographic security is implemented (demo only!)

---

## Testing and Deployment

- **Testing**:  
  - Run tests with `npm test`
  - Uses React Testing Library and Jest for unit/component tests
- **Deployment**:  
  - Build with `npm run build`
  - Output is static, can be hosted on Netlify, Vercel, or any static file server

---

## Future Improvements & Scalability

- Plug in a real backend with minimal changes (swap MirageJS handlers for real API)
- Candidate email invitations and assessment links with results storage
- Real authentication and user role management
- Multi-tenant/team support for larger organizations
- More detailed analytics and custom dashboards
- Accessibility and internationalization enhancements

---

## Contribution Guidelines

1. Fork & clone this repo.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Keep code consistent with design patterns and style (see existing code).
4. Pull request should include:
    - Clear description of the change or fix
    - Reference to any related issues
    - Screenshots for UI changes
5. All contributions are reviewed!
