# Campus Event Board test plan and verification record

## Planned checks

1. **API unit/integration:** health, registration validation/duplicate email, login failure/success, cookie flags, role checks, event CRUD, organizer ownership, save/unsave isolation, malformed IDs, pagination limits, query validation, and safe errors.
2. **Frontend:** build succeeds; routes render; forms validate; loading, empty, success, and error states exist; search/category filters update results; organizer-only controls appear only for the owner.
3. **Manual end-to-end:** register organizer → create event → browse/search → open detail → edit → cancel/reopen → delete; register attendee → save/unsave an event → confirm saved list isolation.
4. **Responsive/accessibility:** test at 360 px and desktop; keyboard through navigation/forms; visible focus; labels and semantic headings.
5. **Production smoke check:** HTTPS, no localhost URLs, deep-link refresh, all core flows, no secrets in browser or repository.

## Verification record

### Completed locally (23 October 2026)

- npm test: passed (1 API integration test; 4 UI tests).
- npm run build: passed.
- npm audit at root, client, and server: 0 vulnerabilities.

### Still to complete

- Manual browser journey, mobile and keyboard checks.
- Production smoke checks after configuring MongoDB and a hosting account.
