# Deployment and submission checklist

## Deploy the combined app

The Express server serves both `/api` and the built React client. This keeps the browser and API on one origin so the HttpOnly SameSite Strict session cookie works without cross-site cookie exceptions.

1. Push the project to a GitHub repository and ensure reviewers can access it.
2. Choose a host that runs a long-lived Node server and supports build/start commands. Review current pricing, sleep behavior, bandwidth, and runtime limits before selecting the service.
3. Create a managed MongoDB database and a database user with only the permissions the app needs. Restrict network access to the app host where possible.
4. Build the client using `npm run build` and start with `npm start`. The provided `render.yaml` is an optional starting blueprint; configure its database secret in the provider dashboard.
5. Set `NODE_ENV=production`, `MONGODB_URI`, and a strong unique `JWT_SECRET` in the host's environment settings. Never upload a real `.env` file.
6. Configure the provider health check path as `/api/health`. Confirm the public application URL is HTTPS.
7. Open the home page and refresh a deep link such as `/events/<id>`. Confirm it still serves the React app.
8. On the live site, test registration, login/logout, attendee save/unsave, organizer event create/edit/cancel/delete, and the event list.
9. Inspect browser Network/Console and server logs. Confirm no request targets localhost, no secret appears in browser code, and no database details appear in API errors.
10. Record the live URL and GitHub URL in `PROJECT_REPORT.md` and the final submission area. Capture screenshots of the major client-side views.

## GitHub workflow

- Keep `main` working.
- Use a short branch per feature, for example `feature/event-search`.
- Commit one coherent change at a time, e.g. `Add event category filtering`.
- Push work at the end of a session and open a pull request for review (solo review is acceptable).
- Confirm `.env`, `node_modules`, and build output are ignored before the first push.
- The included GitHub Actions workflow runs tests and a client production build on pushes and pull requests.

