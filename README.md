# Boardflow

Boardflow is a Trello-inspired project board SPA built with React, JavaScript, Vite, React Router, and Supabase. It gives teams a calm place to organize tasks into **To do**, **In progress**, and **Done**.

## Features

- Public catalog and details pages for boards
- Email/password registration, login, session persistence, and logout
- Private dashboard and board workspaces with route guards
- Board and task CRUD backed by Supabase; task authors can edit/delete their records and board owners can edit/delete boards
- Task status and priority controls, controlled auth/search inputs, loading and error states
- Responsive layout with reusable components and Context API authentication

## Run locally

1. Install Node.js 18+.
2. Install packages: `npm install`
3. Copy `.env.example` to `.env` and add the Supabase project URL and anon key.
4. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
5. Start the app: `npm run dev`
6. Create a Supabase Auth user through the app and add boards/tasks.
7. Create a production build: `npm run build`

The Vite development server prints a local URL (usually `http://localhost:5173`). Without Supabase configuration, the app starts in setup mode and explains how to connect the live service; it does not show fake records.

## Deploy

Deploy the frontend on Vercel, Netlify, or another static host. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables, then deploy the `dist/` output from `npm run build`. Add the deployed frontend domain to Supabase Auth's allowed redirect URLs. Supabase hosts the authentication and persistent database, so there is no separate API server to deploy.

**Live frontend:** add your deployed URL here before submission.

## Architecture

`src/context/AuthContext.jsx` shares the current Supabase session and auth actions across the app. `src/lib/data.js` contains the remote data operations. React Router separates public pages (`/boards`, `/boards/:boardId`) from guarded private pages (`/dashboard`, `/workspace/:boardId`). `src/components` contains shared navigation, dialogs, notices, and route guard components. Supabase table definitions, constraints, and row-level security policies are in `supabase/schema.sql`.

## Functional Guide

### Project name and purpose

**Boardflow** helps individuals and teams organize project work in a visual board. Each board contains tasks that move through To do, In progress, and Done.

### Target users

Students, small teams, and anyone who wants a clear lightweight project tracker.

### Pages and routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Everyone | Introduction and product preview |
| `/boards` | Everyone | Live public catalog of boards |
| `/boards/:boardId` | Everyone | Public board details |
| `/login` | Guests | Sign into an account |
| `/register` | Guests | Create an account |
| `/dashboard` | Signed in | See and manage owned boards |
| `/workspace/:boardId` | Signed in | Manage tasks on a board |

### Main user flows

1. A guest browses public boards and opens a board's details.
2. A guest registers or logs in with email and password.
3. A signed-in user creates a board from the navigation or dashboard.
4. The owner adds tasks, edits task details, changes status or priority, and deletes tasks they authored.
5. The owner can edit or delete their board. Logging out returns the user to public pages.

### Data and persistence

Supabase Auth stores user accounts. PostgreSQL stores profiles, boards, and tasks. The app reads and writes records through the Supabase JavaScript client, and the SQL schema enforces field constraints and row-level security. Boards and tasks persist across visits.

### Validation and error handling

Forms use required fields, minimum/maximum lengths, and email/password input constraints. Database checks repeat important length and enum validation. Network and API errors appear in the UI; loading and empty states are provided. Supabase credentials are environment variables and must not be committed.

### Test account / reviewer notes

Create a reviewer account in the deployed app and add one or more boards if no public examples are present. The database starts empty intentionally. To let reviewers explore board details before signing in, make boards public in the catalog (the schema permits public reads). Editing/deleting is restricted by row-level policies to the record author/board owner.

### Deployment links

- Frontend: **TODO — replace with the public deployment URL**
- Backend: Supabase hosted project (BaaS; no separate backend deployment)

### Known limitations

- This first version has no invitations or multi-user membership management; any signed-in user can create a task, while only its author can edit or delete it.
- Add sample project records through the app before submission so the public catalog and reviewer flow have content.

## Source-control submission checklist

The assignment requires a public GitHub repository, at least five meaningful commits spread across at least three different days, and a public deployed frontend URL above. Those account/repository/deployment actions must be completed by the project owner; they cannot be truthfully represented as completed by this generated source folder.
