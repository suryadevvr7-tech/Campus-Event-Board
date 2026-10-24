# Campus Event Board

A student-focused MERN capstone project for discovering campus events. Attendees can search and save events; organizers can publish and manage their own events. The project follows the supplied MERN guide: plan first, separate client and server responsibilities, validate inputs, protect data, test core flows, use Git, and deploy the complete app.

## The problem

Campus events are often announced through scattered messages and posts. Students miss events that match their interests, while organizers need a straightforward way to publish and update accurate event details.

## MVP roles and features

- **Attendee:** browse, search, filter, and save upcoming events; see a personal saved-events list.
- **Organizer:** create events and manage only their own events; update details, cancel/reopen, and delete.
- **Visitor:** browse public event details without creating an account.

Each event includes its name, description, category, venue, start and end time, status, and organizer. Organizer email addresses are never exposed in public event data.

Out of scope for this version: ticket sales, payments, attendee capacity/RSVPs, messaging, notifications, photos, maps, and admin moderation. Organizer role selection is self-service in this classroom MVP; a real campus deployment should verify organizers or add moderation.

## Technology

- MongoDB and Mongoose for users, events, and saved events.
- Express 5 and Node.js for a validated JSON API.
- React 19 with Vite and React Router for the responsive web interface.
- Zod for server-side validation; bcrypt for password hashing; signed HttpOnly cookies for sessions.
- Node's test runner and MongoDB Memory Server for API integration tests; Vitest and Testing Library for frontend tests.

## Project structure

```text
client/                 React app, pages, reusable components, API service
server/src/config/      Environment and MongoDB setup
server/src/controllers/ Request handling and business operations
server/src/middleware/  Authentication, role checks, validation, errors, origin checks
server/src/models/      Mongoose schemas and indexes
server/src/routes/      API endpoint mapping
server/src/validation/  Zod request schemas
server/test/            API integration test
PROJECT_BRIEF.md        Problem, scope, user stories, criteria, data model, sketches
API_CONTRACT.md         Endpoint contract and error format
SRS.md                 Software Requirements Specification
PROJECT_REPORT.md       Capstone report draft
TEST_PLAN.md            Test plan and run record
```

## Requirements

- Node.js 22.12 or later (Node 24 LTS is suitable) and npm.
- MongoDB Community Server running locally, or a MongoDB Atlas connection string.
- Internet access during dependency installation. The first API test run may download a temporary MongoDB binary for MongoDB Memory Server.

## Run locally on Windows PowerShell

1. Install and start MongoDB locally, or create a database user and database in MongoDB Atlas.
2. Install dependencies from the project root:

   ```powershell
   npm run install:all
   ```

3. Create the server environment file and set its values:

   ```powershell
   Copy-Item server/.env.example server/.env
   ```

   Set `MONGODB_URI` to your local or Atlas connection string. Set `JWT_SECRET` to a private random value of at least 32 characters. Keep the real `server/.env` out of Git.

4. Start the API and React client together:

   ```powershell
   npm run dev
   ```

5. Open `http://localhost:5173`. The Vite development server proxies `/api` requests to the API at `http://localhost:5000`.

If the API reports `querySrv ECONNREFUSED` while connecting to Atlas, add `MONGODB_DNS_SERVERS=8.8.8.8,8.8.4.4` to `server/.env` and restart the app. This optional setting makes Node use those DNS resolvers for Atlas SRV lookups.

To generate a strong local session secret in PowerShell:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Paste the result into `JWT_SECRET` in `server/.env`. Never put secrets in `client/.env`; browser environment variables are visible to users.

## Seed demonstration events

The seed command creates a demo organizer and three upcoming campus events. Choose a demo password yourself; the script refuses to use a built-in password.

```powershell
$env:DEMO_ORGANIZER_PASSWORD = 'Choose-A-Strong-Demo-Password-42'
npm run seed
Remove-Item Env:DEMO_ORGANIZER_PASSWORD
```

Demo email: `demo.organizer@campus.local`. The seed script only creates sample content and does not contact real people.

## Build and run the production server

The production Node server also serves the built React app. This keeps the browser and API on the same origin, simplifying secure cookie handling.

```powershell
npm run build
npm start
```

The server listens on `PORT` (default 5000) and serves the client build from `client/dist`. MongoDB must be reachable through `MONGODB_URI`.

## Verification

```powershell
npm test
npm run build
```

The API tests cover registration, login, safe cookie settings, role/ownership authorization, event CRUD, saved-event privacy, query limits, origin checks, and safe error responses. The UI tests cover the key event card and loading, empty, and retry states.

## API overview

The API base path is `/api`. See [API_CONTRACT.md](API_CONTRACT.md) for request and response details.

- `GET /health`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- `GET /events`, `GET /events/:id`, `POST /events`, `PATCH /events/:id`, `DELETE /events/:id`
- `GET /events/mine`, `GET /events/saved`, `POST /events/:id/save`, `DELETE /events/:id/save`

The API validates request bodies, query parameters, and IDs; returns a consistent safe error format; hashes passwords; checks roles and ownership server-side; and caps lists at 20 per page.

## Git and submission checklist

- Initialize Git before feature work and commit small working changes with meaningful messages.
- Push the repository to GitHub and make sure reviewers have access.
- Deploy the Node API, built client, and MongoDB; set production secrets in the host dashboard.
- Test signup/login, attendee saves, organizer create/edit/cancel/delete, deep-link refresh, mobile layout, and HTTPS on the live site.
- Add screenshots of Discover, event details, sign-in/register, saved events, and organizer event management to the report.
- Replace the pending submission fields in [PROJECT_REPORT.md](PROJECT_REPORT.md) with the repository URL, hosted URL, actual test results, screenshots, student/course details, and the institution's required report format.

No GitHub repository URL or hosted URL is claimed until those services are actually configured.




