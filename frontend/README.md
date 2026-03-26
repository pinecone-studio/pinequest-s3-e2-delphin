# Frontend

Next.js app-router scaffold for the LMS demo.

## Focus

Keep the frontend simple and role-based:

- `login`
- `reviewer/dashboard`
- `reviewer/assessments`
- `reviewer/assignments`
- `reviewer/reports`
- `candidate/dashboard`
- `candidate/exams/[examId]`
- `candidate/results`

## Guidelines

- Build the exact demo flow first before adding extra pages.
- Reuse shared layout and visual components.
- Prefer simple forms and tables over advanced UI patterns.
- Keep state local unless multiple pages truly need it.

## Backend API

For local development, the frontend defaults to `http://localhost:3001/api`.

For deployment:

- Set `API_BASE_URL` to the deployed backend base URL, including `/api`.
- Set `NEXT_PUBLIC_API_BASE_URL` only if you also want that value exposed to client-side code.

Browser-side exam create/edit/delete requests are proxied through the Next app at `/api/backend/*`, so the deployed site can talk to the backend without hardcoding `localhost`.
