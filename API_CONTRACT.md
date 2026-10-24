# Campus Event Board API contract

Base path: `/api`. JSON bodies. Authentication uses an HttpOnly cookie. List endpoints use `page` and `limit` (default 1 and 10; maximum 20).

| Method | Path | Auth | Purpose | Success | Common errors |
|---|---|---|---|---|---|
| GET | `/health` | No | Liveness check | 200 `{status}` | 503 unavailable |
| POST | `/auth/register` | No | Create attendee or organizer | 201 `{user}` | 400 invalid, 409 duplicate, 429 rate limited |
| POST | `/auth/login` | No | Start session | 200 `{user}` | 400 invalid, 401 invalid credentials, 429 rate limited |
| GET | `/auth/me` | Yes | Current account | 200 `{user}` | 401 unauthenticated |
| POST | `/auth/logout` | No | Clear session | 200 `{message}` | 500 unexpected |
| GET | `/events` | No | Browse/search/filter published upcoming events | 200 `{items,pagination}` | 400 invalid query |
| GET | `/events/mine` | Organizer | List own events, including cancelled | 200 `{items,pagination}` | 401/403 |
| GET | `/events/saved` | Yes | List current user's saved events | 200 `{items,pagination}` | 401 |
| GET | `/events/:id` | No | Read event details | 200 `{item}` | 400 malformed ID, 404 missing |
| POST | `/events` | Organizer | Create event | 201 `{item}` | 400 invalid, 401/403 |
| PATCH | `/events/:id` | Organizer owner | Edit fields/status | 200 `{item}` | 400 invalid, 401/403/404 |
| DELETE | `/events/:id` | Organizer owner | Delete event and saves | 204 | 400 malformed ID, 401/403/404 |
| POST | `/events/:id/save` | Yes | Save event | 201 `{saved:true}` | 401, 404 |
| DELETE | `/events/:id/save` | Yes | Unsave event | 204 | 401, 404 |

## Event payload

```json
{
  "title": "Design Club Portfolio Night",
  "description": "Bring a project and get feedback from other students.",
  "category": "Workshop",
  "venue": "Innovation Hall, Room 204",
  "startsAt": "2026-11-12T17:00:00.000Z",
  "endsAt": "2026-11-12T19:00:00.000Z"
}
```

The organizer is always derived from the authenticated account, never from the request body. Update requests may include any subset of event fields and `status` (`published` | `cancelled`). A saved-event response never includes another user's saved records.

## Error shape

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Please check the highlighted fields.", "details": [] } }
```

The API validates body, query, and path parameters. It never returns stack traces, database messages, password hashes, or private account emails in a listing response.

