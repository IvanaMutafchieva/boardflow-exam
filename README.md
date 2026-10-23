# Boardflow

Boardflow is a Trello-inspired project board SPA built with React, JavaScript, Vite, React Router, and Supabase. It gives teams a calm place to organize tasks into **To do**, **In progress**, and **Done**.

## Features

- Public catalog and details pages for public boards; board owners can mark their boards private
- Header search with live results limited to public boards
- Members can edit their own profile name; database rules prevent editing another member's profile
- About, Contact, Features, and FAQ information pages
- A Help form that securely stores incoming questions in Supabase
- Email/password registration, login, session persistence, and logout
- Password recovery by email with a secure reset link
- Private dashboard and board workspaces with route guards
- Board and task CRUD backed by Supabase; only board owners can manage their workspaces and tasks on their own boards
- Task status and priority controls, controlled auth/search inputs, loading and error states
- Responsive layout with reusable components and Context API authentication

## Run locally

1. Install Node.js 18+.
2. Install packages: `npm install`
3. Copy `.env.example` to `.env` and add the Supabase project URL and anon key.
4. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql), [`supabase/help_questions.sql`](supabase/help_questions.sql), [`supabase/members_only.sql`](supabase/members_only.sql), [`supabase/board_visibility.sql`](supabase/board_visibility.sql), and [`supabase/owner_only_workspaces.sql`](supabase/owner_only_workspaces.sql). If your database is already set up, run only `owner_only_workspaces.sql` for this access change.
5. Start the app: `npm run dev`
6. Create a Supabase Auth user through the app and add boards/tasks.
7. Create a production build: `npm run build`

## Code formatting

Prettier formats the JavaScript, JSX, and CSS files in `src/`. Run `npm run format` to format them, or `npm run format:check` to check formatting without changing files. Formatting preferences are in `.prettierrc.json`.

The Vite development server prints a local URL (usually `http://localhost:5173`). Without Supabase configuration, the app starts in setup mode and explains how to connect the live service; it does not show fake records.

## Deploy

Deploy the frontend on Vercel, Netlify, or another static host. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables, then deploy the `dist/` output from `npm run build`. In Supabase Authentication URL Configuration, add the deployed frontend URL and its `/reset-password` path to the allowed redirect URLs. For local development, allow `http://localhost:5173/reset-password` too. Supabase hosts the authentication and persistent database, so there is no separate API server to deploy.

**Live frontend:** add your deployed URL here before submission.

## Architecture

`src/context/AuthContext.jsx` shares the current Supabase session and auth actions across the app. `src/lib/data.js` contains the remote data operations. React Router provides public directories and dynamic detail pages for boards, tasks, and members (`/boards/:boardId`, `/tasks/:taskId`, `/profiles/:profileId`), informational pages (`/about`, `/contact`, `/features`, `/faq`), and guarded workspace pages (`/dashboard`, `/workspace/:boardId`). `src/components` contains shared navigation, footer, dialogs, notices, and route guard components. Supabase table definitions, constraints, and row-level security policies are in `supabase/schema.sql`.

## Functional Guide

### Project name and purpose

**Boardflow** helps individuals and teams organize project work in a visual board. Each board contains tasks that move through To do, In progress, and Done.

### Target users

Students, small teams, and anyone who wants a clear lightweight project tracker.

### Pages and routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Everyone | Introduction and product preview |
| `/boards` | Everyone | Live catalog of public boards |
| `/boards/:boardId` | Everyone for public boards; owner for private boards | Board details |
| `/tasks` | Signed in | Searchable directory of tasks across boards |
| `/tasks/:taskId` | Signed in | Task details with links to its board and author |
| `/people` | Signed in | Searchable member directory |
| `/profiles/:profileId` | Signed in | Member profile and their boards |
| `/about` | Everyone | About Boardflow and its purpose |
| `/contact` | Everyone | Contact guidance for the student project |
| `/help` | Everyone | Submit a question through the Supabase-backed help form |
| `/features` | Everyone | Overview of app features |
| `/faq` | Everyone | Answers to common questions |
| `/login` | Guests | Sign into an account |
| `/register` | Guests | Create an account |
| `/reset-password` | Password reset link | Choose a new account password |
| `/dashboard` | Signed in | See and manage owned boards |
| `/workspace/:boardId` | Board owner | Manage tasks on your own board |

### Main user flows

1. A guest browses public boards and opens a board's details.
2. A guest registers or logs in with email and password.
3. A signed-in user creates a board from the navigation or dashboard.
4. The owner opens their workspace to add tasks, edit task details, change status or priority, and delete tasks they authored. Other signed-in users can view public board previews but cannot edit or open someone else's workspace.
5. The owner can edit or delete their board. Logging out returns the user to public pages.

### Data and persistence

Supabase Auth stores user accounts. PostgreSQL stores profiles, boards, and tasks. The app reads and writes records through the Supabase JavaScript client, and the SQL schema enforces field constraints and row-level security. Boards are public by default; the owner can make a board private. The visibility migration limits private board and task reads to the owner, while public boards remain browsable. The owner-only workspace migration restricts board and task changes to the board owner. The member-only migration limits task and profile reads to signed-in users. Boards and tasks persist across visits.

### Validation and error handling

Forms use required fields, minimum/maximum lengths, and email/password input constraints. Database checks repeat important length and enum validation. Network and API errors appear in the UI; loading and empty states are provided. Supabase credentials are environment variables and must not be committed.

### Test account / reviewer notes

Create a reviewer account in the deployed app and add one or more boards if no public examples are present. The database starts empty intentionally. To let reviewers explore board details before signing in, make boards public in the catalog (the schema permits public reads). Only a board owner can access its workspace and manage its tasks; row-level policies enforce this on Supabase too.

### Deployment links

- Frontend: **TODO — replace with the public deployment URL**
- Backend: Supabase hosted project (BaaS; no separate backend deployment)

### Known limitations

- This first version has no invitations or multi-user membership management; public boards are viewable by everyone, while their workspaces and task editing are restricted to the owner.
- Help form submissions are stored in Supabase for the project owner to review; automatic email notifications and replies are not configured.
- Add sample project records through the app before submission so the public catalog and reviewer flow have content.
