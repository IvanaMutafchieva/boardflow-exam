# Boardflow Git Commit Commands

Copy and run one batch at a time from PowerShell, on the day you work on that batch.

## Open the project folder

```powershell
cd "$env:USERPROFILE\Desktop\exam reactJS"
git status
```

If `git status` says this is not a Git repository, initialize it once:

```powershell
git init
git branch -M main
```

## Before each commit

1. Run only the batch you worked on that day.
2. Review the files listed by `git status` before committing.
3. Never add `.env`, `node_modules`, or `dist`; `.gitignore` excludes them.
4. Do not create an empty or misleading commit. If there is nothing to commit, make a real improvement first.

> The first setup commit may not build by itself because the later feature files are added in following batches. Run `npm run build` after all batches are committed.

## Batch 1 — Initial project setup

```powershell
git add .gitignore package.json pnpm-lock.yaml index.html vite.config.js src/main.jsx src/App.jsx src/styles.css
git status
git commit -m "Set up React and Vite project"
```

## Batch 2 — Homepage and shared navigation

```powershell
git add src/pages/Home.jsx src/components/Topbar.jsx
git status
git commit -m "Add Boardflow homepage and navigation"
```

## Batch 3 — Public board catalog and details

```powershell
git add src/pages/Catalog.jsx src/pages/BoardDetail.jsx
git status
git commit -m "Add public board catalog and details"
```

## Batch 4 — Authentication and route protection

```powershell
git add src/context/AuthContext.jsx src/pages/AuthPage.jsx src/components/ProtectedRoute.jsx src/lib/supabase.js
git status
git commit -m "Add Supabase authentication and protected routes"
```

## Batch 5 — Dashboard, workspace, and data operations

```powershell
git add src/pages/Dashboard.jsx src/pages/BoardWorkspace.jsx src/lib/data.js src/components/Modal.jsx src/components/Notice.jsx supabase/schema.sql
git status
git commit -m "Add board and task management with Supabase"
```

## Batch 6 — Documentation

```powershell
git add README.md .env.example
git status
git commit -m "Document setup and functional guide"
```

## Check the final production build

```powershell
npm run build
```

The assignment asks for commits spread across at least three different days. Make genuine changes and commit them on the days you do the work; do not backdate commits.
