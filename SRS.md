# Software Requirements Specification

## Campus Event Board

**Version:** 1.0  
**Status:** Capstone MVP specification  
**Prepared:** 23 October 2026

## 1. Purpose and scope

Campus Event Board gives students one place to discover upcoming campus events. Attendees can save events for later. Organizers can publish events and manage the events they created. This SRS defines the first release and its acceptance criteria.

## 2. Product context

The application is a MERN web application. The React client communicates with the Express/Node API over JSON/HTTP. The API validates requests and stores data in MongoDB through Mongoose. The client never connects directly to MongoDB.

## 3. User classes

- **Visitor:** browse published future events and event details.
- **Attendee:** visitor features plus account, sign-in/out, and personal saved-event list.
- **Organizer:** attendee features plus event creation and management for owned events.
- **Administrator:** not included in the first release.

In this academic MVP, users choose attendee or organizer at registration. A production campus service should verify organizer accounts or provide moderation.

## 4. Functional requirements

### FR-1 Accounts and sessions
- The system shall allow registration using name, email, password, and role.
- The system shall normalize email addresses and reject duplicate email addresses.
- The system shall hash passwords and shall never return a password or password hash.
- The system shall allow account login, current-account lookup, and logout.
- The session credential shall be stored in an HttpOnly, SameSite Strict cookie; production cookies shall be Secure.
- Repeated login and registration attempts shall be rate limited.

### FR-2 Event discovery
- The system shall show published events with a future start time.
- Visitors shall be able to search title, description, and venue and filter by event category.
- Lists shall support page/limit pagination, with a default page size of 10 and maximum of 20.
- Each event card shall show title, category, date, time, venue, and organizer display name.

### FR-3 Event detail
- The system shall show the full description, date/time, venue, category, organizer display name, and status.
- Organizer email and account credentials shall not appear in public event responses.

### FR-4 Saving events
- A signed-in user shall be able to save and unsave a published event.
- A signed-in user shall be able to view only their own saved events.
- A unique user/event database index shall prevent duplicate saves.

### FR-5 Organizer event management
- Only an organizer may create an event.
- The server shall assign the authenticated organizer as owner; the request body shall not select an owner.
- An organizer shall be able to update, cancel/reopen, and delete only events they own.
- The server shall reject invalid event data and an end time that is not after the start time.
- Deleting an event shall remove its saved-event references.

### FR-6 Interface states and accessibility
- Event screens shall provide loading, success, empty, and error states.
- Forms shall have labels, inline browser validation, submit feedback, and readable server errors.
- The interface shall be responsive from 360 CSS pixels and provide visible keyboard focus, semantic headings, and keyboard-operable controls.

### FR-7 Errors and health
- The API shall return consistent JSON errors with safe messages and suitable HTTP status codes.
- The API shall not expose stack traces, database errors, or secrets.
- The health endpoint shall report API liveness.

## 5. Data requirements

### User
- `name`: required string, 2–60 characters.
- `email`: required, valid, normalized lowercase, unique, maximum 254 characters.
- `passwordHash`: required server-generated hash; excluded from queries and responses by default.
- `role`: `attendee` or `organizer`.
- Created and updated timestamps.

### Event
- `title`: required, 5–100 characters.
- `description`: required, 20–2,000 characters.
- `category`: Academic, Arts & Culture, Career, Community, Sports, Workshop, or Other.
- `venue`: required, 2–120 characters.
- `startsAt` and `endsAt`: required dates; end follows start.
- `status`: published or cancelled.
- `organizer`: required reference to the creating user.
- Created and updated timestamps.

### SavedEvent
- Required user and event references.
- Unique compound index on user and event.
- Timestamps.

## 6. External interface requirements

- Client/API: JSON over HTTP locally and HTTPS in production.
- API routes and payloads: [API_CONTRACT.md](API_CONTRACT.md).
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`, and `FRONTEND_URL`; none may contain production secrets in Git.
- Browser client configuration: `VITE_API_URL`; no secret may be placed in a Vite variable.

## 7. Security requirements

- Server-side validation is authoritative; client validation is for user feedback.
- Passwords shall be salted and hashed using bcrypt.
- Authenticated routes shall verify the signed session.
- Organizer role and event ownership shall be checked on the server.
- Unsafe cross-origin requests shall be rejected; CORS shall be restricted to configured origins and the same-origin production host.
- Request JSON shall be size limited; sensitive auth routes shall be rate limited.
- Database credentials and session secrets shall be environment variables.
- Public event data shall include only the organizer's display name.

## 8. Quality requirements

- Code shall be separated by responsibility (routes, controllers, models, middleware, client services/components/pages).
- Lists shall be paginated and capped.
- Core API and UI behavior shall have automated tests.
- The application shall include a README, project brief, API contract, test evidence, and deployment/submission documentation.

## 9. Acceptance criteria

The release is accepted when:
1. A visitor can browse, search, filter, and open event details.
2. An attendee can register/login, save and unsave an event, and see their own saved list.
3. An organizer can create, edit, cancel/reopen, and delete only their own events.
4. Invalid data, unauthenticated requests, wrong roles, and wrong owners receive safe and appropriate errors.
5. Core screens have loading, empty, and error behavior and work on mobile.
6. Automated tests and production build pass.
7. The deployed site uses HTTPS and production environment variables; no requests point at localhost.

