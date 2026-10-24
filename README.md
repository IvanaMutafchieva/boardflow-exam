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

**Live frontend:** https://boardflow-exam.vercel.app

## Architecture

`src/context/AuthContext.jsx` shares the current Supabase session and auth actions across the app. `src/lib/data.js` contains the remote data operations. React Router provides public directories and dynamic detail pages for boards, tasks, and members (`/boards/:boardId`, `/tasks/:taskId`, `/profiles/:profileId`), informational pages (`/about`, `/contact`, `/features`, `/faq`), and guarded workspace pages (`/dashboard`, `/workspace/:boardId`). `src/components` contains shared navigation, footer, dialogs, notices, and route guard components. Supabase table definitions, constraints, and row-level security policies are in `supabase/schema.sql`.

## Functional Guide

### 1. Project Overview

**Application name:** Boardflow

**Category / topic:** Project and task management board (a lightweight Trello-style productivity app).

**Main purpose:** Boardflow helps individuals and small teams organize project work as boards containing tasks. Board owners can move tasks through To do, In progress, and Done, set priority, and share a public read-only view of a board. It provides a simple place to track work and see what is coming next.

### 2. User Access & Permissions

#### Guest (not authenticated)

Guests can view the home and information pages, browse public boards, and open public board details. They can register, log in, request a password reset, and submit a question through the Help form. Private routes such as the dashboard, workspace, task directory, task details, people directory, and profiles require authentication.

**Available routes:** `/`, `/boards`, `/boards/:boardId` (public boards only), `/about`, `/contact`, `/help`, `/features`, `/faq`, `/login`, `/register`, and `/reset-password` (with a valid reset session).

**Public data shown:** public board titles, descriptions, owner display names, and creation dates. Private boards are readable only by their owner under the database policies.

#### Authenticated user

Signed-in users can access their dashboard, board workspace, task directory and details, member directory, and profiles. They can create boards, manage their own boards and their tasks, change task status or priority, and edit their own profile name. The dashboard and workspace are for the board owner; signing in does not grant access to another owner's private workspace.

**Main sections / pages:** `/dashboard`, `/workspace/:boardId`, `/tasks`, and `/people`, alongside the public pages.

**Details pages:** `/boards/:boardId`, `/tasks/:taskId`, and `/profiles/:profileId` use a record identifier in the URL. Task details link to the related board and author profile.

**Create / edit / delete:** a user can create boards and tasks. A board owner can edit or delete that board and create, edit, move, or delete its tasks. A user can edit their own profile name. Row-level security policies enforce ownership in Supabase as well as in the interface.

### 3. Authentication & Session Handling

#### Authentication flow

1. When the app starts, `AuthProvider` asks Supabase Auth for the current session and subscribes to authentication changes.
2. The provider shares the current user and loading state through React Context. Protected routes show a loading indicator until the initial session check finishes.
3. Guests who attempt to open a protected route are redirected to `/login`. After successful login or registration, the app navigates to `/dashboard`. If email confirmation is required, the app asks the user to confirm their address before logging in.
4. If an authenticated user visits `/login` or `/register`, the auth page redirects them to `/dashboard`.
5. On logout, Supabase ends the session and the shared auth state updates; protected routes then require login again.

#### Session persistence

Supabase Auth manages and persists the session in the browser using the Supabase JavaScript client's default session storage behavior. On a page refresh, `getSession()` restores the session and `onAuthStateChange()` keeps the Context state current. The auth subscription is removed when the provider unmounts.

### 4. Routing Structure

#### Route guard logic

Routes are declared at the top level in `src/App.jsx`. Public routes are available without signing in. `ProtectedRoute` wraps the dashboard, workspace, task directory, task details, people directory, and profile pages and redirects unauthenticated visitors to `/login`. The login and registration page redirects an already authenticated user to `/dashboard`. Supabase row-level security separately protects private records and write operations.

#### Main routes

The app has **17 explicit top-level route patterns** plus a fallback route. The routes cover a home page, public board catalog and board details, authenticated task and member directories and their details, account pages, informational pages, a dashboard, and a board workspace. The current router uses top-level routes rather than nested layout routes.

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Everyone | Home and product introduction |
| `/boards` | Everyone | Searchable catalog of public boards |
| `/boards/:boardId` | Everyone for public boards; owner for private boards | Board details |
| `/tasks` | Signed in | Searchable task directory |
| `/tasks/:taskId` | Signed in | Task details and related links |
| `/people` | Signed in | Searchable member directory |
| `/profiles/:profileId` | Signed in | Member profile and public boards |
| `/about` | Everyone | About the project |
| `/contact` | Everyone | Contact information |
| `/help` | Everyone | Submit a question to Supabase |
| `/features` | Everyone | Feature overview |
| `/faq` | Everyone | Frequently asked questions |
| `/login` | Guests | Sign in |
| `/register` | Guests | Create an account |
| `/reset-password` | Valid reset session | Choose a new password |
| `/dashboard` | Signed in | Manage owned boards |
| `/workspace/:boardId` | Signed in; board owner only | Manage a board and its tasks |

The fallback route redirects unknown paths to `/`.

#### Nested and parameterized routes

There is no nested route layout. Parameterized routes are `/boards/:boardId`, `/tasks/:taskId`, `/profiles/:profileId`, and `/workspace/:boardId`. The page reads each value with React Router's `useParams()` and fetches the corresponding Supabase record.

### 5. List → Details Flow

#### Catalog / list pages

- `/boards` reads public boards from Supabase and displays their title, description, owner, and creation date. Users can filter the loaded list by entering a search term matching the board title or description. Header search also provides public board results.
- `/tasks` reads tasks from public boards for signed-in users and displays task title, description, board, status, and priority. Its search filters by task title, description, or board title.
- `/people` reads member profiles for signed-in users and filters by display name.

#### Details pages

Users follow React Router `Link` elements from cards and task links to open a detail route. Board cards navigate to `/boards/:boardId`; task cards navigate to `/tasks/:taskId`; member links navigate to `/profiles/:profileId`. The destination reads the ID from the URL and requests the matching record from Supabase. Task details include links back to the board and to the task author's profile. Missing or inaccessible records are shown as an error state.

### 6. Data Source & Backend

Boardflow uses **Supabase as a hosted Backend-as-a-Service (BaaS)**. Supabase Auth handles accounts and sessions; its hosted PostgreSQL database stores profiles, boards, tasks, and Help questions. The React app accesses the service through the Supabase JavaScript client in `src/lib/data.js`. There is no separate custom API server to deploy. Database constraints and row-level security policies are defined in the SQL files under `supabase/`.

### 7. Data Operations (CRUD)

The primary CRUD collection is **boards**; tasks also have CRUD operations.

- **Create:** signed-in users submit the create-board form. Board owners add tasks in their workspace. The app inserts the record through Supabase and associates it with the current owner/author.
- **Read:** the catalog, dashboard, workspace, and detail pages fetch board/task data through the Supabase client. Public catalog queries show public boards; authenticated pages fetch permitted tasks and profiles.
- **Update:** owners edit board title, description, and visibility. They edit task fields and change task status/priority in the workspace. After a successful change, the workspace reloads its data; the dashboard updates visibility in its local state.
- **Delete:** owners can delete boards and tasks from the workspace. Deleting a board cascades to its tasks. The workspace refreshes after task deletion and returns to the dashboard after board deletion.
- **Authorization:** UI checks and Supabase row-level security restrict edits/deletes to the record author/board owner. A user cannot manage another owner's board workspace.

### 8. Forms & Validation

**Forms used:** registration, login, password recovery email, reset password, create board, edit board, create task, edit task, edit profile name, and Help question submission. Form fields are controlled React inputs whose values are stored in component state and updated through React change handlers; form submission uses React submit handlers.

**Validation rules include:**

- **Account name:** required; 2–60 characters at registration, with the profile form also checking a minimum of 2 characters.
- **Email:** required, browser email-format validation, and maximum 254 characters.
- **Password:** required; 6–72 characters. Password confirmation must match on the reset form.
- **Board title:** required; 2–60 characters. Board description is limited to 240 characters.
- **Task title:** required; 2–100 characters. Task description is limited to 500 characters; status and priority are constrained to the supported values.
- **Help question:** required; 10–2,000 characters. The database repeats the length checks and validates the name and email fields.

Important constraints are also enforced in PostgreSQL so invalid values cannot be persisted by bypassing the form.

### 9. React-Specific Techniques

#### Hooks and component lifecycle

The app uses `useState` for form values, fetched records, loading/errors, dialogs, and search; `useEffect` for session initialization and data fetching; `useCallback` for workspace refresh; and routing hooks such as `useParams`, `useNavigate`, and `useSearchParams`.

For example, the board detail page fetches data when it mounts and whenever `boardId` changes. Its effect cleanup marks the request inactive so a late response does not update state after the page unmounts or switches records. The auth provider also unsubscribes from Supabase auth events on unmount.

#### Context API

`AuthContext` shares the current user, loading state, and authentication actions. `AuthProvider` wraps the application in `src/main.jsx`; `Topbar`, `ProtectedRoute`, `App`, and account-aware pages consume the context through `useAuth()`.

#### Component styling

Component styling is provided by the external stylesheet `src/styles.css`. Reusable UI components include navigation, footer, modal, notice, and protected-route components under `src/components/`.

### 10. Typical User Flow

1. A guest opens the public board catalog, searches for a board, and views its details.
2. The guest registers or logs in with email and password.
3. The signed-in user creates a board from the navigation or dashboard and opens its workspace.
4. The owner creates tasks, edits details and priority, moves tasks through statuses, and deletes completed or unwanted records. They can make the board public for others to view or private for owner-only access.

### 11. Error & Edge Case Handling

- **Authentication errors:** Supabase errors are displayed on the auth forms. Protected pages wait for session initialization and redirect guests to login. Invalid or expired reset links show a recovery message and a link back to login.
- **Network or data errors:** data pages display loading states while fetching and show service errors when requests fail. Forms and mutations display returned API errors; some operations also provide a connection-related fallback message.
- **Empty or missing data:** catalogs and dashboards show empty states when there are no records or no search matches. Detail pages show an error when a record is missing or inaccessible. The database intentionally starts without sample boards or tasks; create records in the app to populate the catalog.

### Deployment links

- **Frontend:** https://boardflow-exam.vercel.app
- **Backend:** Supabase hosted project (BaaS); there is no separate API server.

Help submissions are stored for the project owner to review; automatic email notifications and replies are not configured. The app does not currently provide invitations or multi-user membership management.
