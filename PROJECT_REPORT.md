# Campus Event Board Capstone Project Report

> **Submission draft:** replace bracketed fields, add actual screenshots and test results, and apply the institution's Project Report Format file before final submission.

## Cover page

**Project:** Campus Event Board  
**Student:** [Student name]  
**Programme / batch:** [Programme and batch]  
**Institution:** [Institution name]  
**Guide / faculty:** [Faculty name]  
**Submission date:** [Date]

## Abstract

Campus Event Board is a MERN web application that helps students find upcoming campus activities in one place. Visitors can discover events, attendees can save events for later, and organizers can publish and manage their own events. The React client communicates with an Express API, which validates requests and stores accounts, events, and saved-event relationships in MongoDB. The project demonstrates planning, API design, authentication, role and ownership checks, responsive interface design, testing, Git-based development, and deployment preparation.

## 1. Introduction

Campus activities are often announced through separate social posts, classroom messages, and club groups. Students may not see events that fit their interests, and details can become outdated. This project provides a searchable campus event board with a personal saved list and organizer-owned publishing tools.

## 2. Problem statement

Students lack a reliable, searchable view of current campus events. Organizers need a simple way to publish accurate details and update or cancel events they own.

## 3. Objectives

- Build a full-stack application using MongoDB, Express, React, and Node.js.
- Support event search, category filtering, and paginated discovery.
- Provide attendee accounts and personal saved events.
- Allow organizers to create and manage only their own events.
- Apply validation, safe errors, password hashing, secure sessions, and privacy controls.
- Test the main flows, deploy the application, and provide reproducible project documentation.

## 4. Scope

### Included
Registration/login/logout; attendee and organizer roles; event CRUD; search/category filters; pagination; saved events; responsive React screens; API validation; server-side authorization; automated API/UI tests; deployment instructions.

### Excluded from the MVP
Ticketing/payments, capacity and RSVP management, messaging, notifications, maps, photos, admin moderation, analytics.

## 5. Requirements and planning

The project brief, user stories, data model, screen sketches, non-functional targets, and measurable criteria are documented in [PROJECT_BRIEF.md](PROJECT_BRIEF.md). Endpoint methods, payloads, status codes, and error format are documented in [API_CONTRACT.md](API_CONTRACT.md). The full SRS is in [SRS.md](SRS.md).

## 6. System architecture

The browser renders the React application. It sends JSON requests to the Express API. The API validates the request, checks the session/role/ownership as required, accesses MongoDB through Mongoose, and returns safe JSON. The client updates the interface with loading, success, empty, or error feedback.

```text
React browser client  <-- JSON/HTTP -->  Express / Node API  <-- Mongoose -->  MongoDB
```

### Main data entities
- User: name, normalized email, password hash, and role.
- Event: event details, times, status, and organizer reference.
- SavedEvent: user/event references with a unique pair index.

## 7. Implementation

- **Backend:** resource-based `/api` routes; thin route mapping; controllers; Mongoose models; validation/auth/error/origin middleware.
- **Authentication:** bcrypt password hashes and signed HttpOnly cookies.
- **Authorization:** role checks for organizer tools and ownership checks for event changes.
- **Frontend:** responsive discovery, event detail, registration/login, saved event, organizer dashboard, and event form screens.
- **Privacy:** event responses include organizer display names, not organizer email addresses.
- **Environment:** secrets and database connection string are configured outside source code; example files contain variable names and safe local defaults.

## 8. Testing and verification

See [TEST_PLAN.md](TEST_PLAN.md) for the planned API, UI, integration, responsive, accessibility, and production checks.

- `npm test`
- `npm run build`
- Manual organizer and attendee journey on local and deployed URLs.

**Actual results (23 October 2026):** `npm test` passed: 1 API integration test and 4 UI tests. `npm run build` passed. `npm audit` reported 0 vulnerabilities for the root, client, and server packages. Manual browser flows, responsive checks, and production deployment checks remain pending; complete them after configuring MongoDB and hosting.

## 9. Deployment

The Node server serves the compiled React application and API from one origin. MongoDB is hosted separately. Production configuration requires a MongoDB connection string and strong session secret in the host's environment settings. CORS and origin checks include the same-origin host. See [DEPLOYMENT.md](DEPLOYMENT.md).

**GitHub repository:** [Add repository URL after pushing.]  
**Hosted project:** [Add live HTTPS URL after deployment.]

## 10. Screenshots

Add genuine screenshots captured from the running application. Do not use the decorative sample event illustration in place of application screenshots.

1. Discover page with event list: [Insert screenshot]
2. Event details: [Insert screenshot]
3. Registration and role selection: [Insert screenshot]
4. Saved events: [Insert screenshot]
5. Organizer dashboard: [Insert screenshot]
6. Create/edit event form on mobile: [Insert screenshot]

## 11. Security, privacy, and limitations

The server hashes passwords, validates requests, rate limits registration/login, limits payload size, uses HttpOnly/SameSite cookies, restricts unsafe cross-origin requests, and enforces organizer ownership. Public event details do not disclose organizer email.

Organizer registration is self-selected in this academic MVP and therefore not proof of campus affiliation. A real campus deployment should verify organizers and provide moderation/report handling. The app does not handle registrations, capacity, payment, or emergency event changes. Hosting/free-tier limits and pricing must be checked before selecting a provider.

## 12. Future enhancements

Verified campus email, moderator/admin review, RSVP/capacity management, calendar export, event reminders, maps, image upload with moderation, and organizer analytics.

## 13. Conclusion

Campus Event Board provides the core flow for discovering campus events, saving events, and managing organizer-owned listings. Its architecture keeps browser, API, and database responsibilities separate and provides a foundation for extensions after the MVP is tested and deployed.

## References

- React: https://react.dev/
- React Router: https://reactrouter.com/
- Vite: https://vite.dev/
- Node.js: https://nodejs.org/en/docs
- Express: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/
- Mongoose: https://mongoosejs.com/docs/
- Git and GitHub: https://git-scm.com/doc/ and https://docs.github.com/
- Security guidance: https://expressjs.com/en/advanced/best-practice-security.html and https://owasp.org/www-project-top-ten/


