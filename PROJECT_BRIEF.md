# Campus Event Board project brief

## Problem

Students often hear about campus events through scattered posts and messages, making it hard to find current events or remember ones they want to attend. Organizers need a clear place to publish accurate event details and update their own listings.

## Target users

- **Attendee:** browse/search upcoming events and save events to a personal list.
- **Organizer:** publish and manage only their own events; may also save events.
- **Administrator (future):** moderate reports. Administration is outside the first release.

## MVP scope

### Must have

- Register as attendee or organizer, log in, view account, and log out.
- Browse published upcoming events; search by title/description and filter by category.
- View event details including venue, start/end time, and organizer display name.
- Save/unsave events and view a personal saved-events page.
- Organizers create, edit, cancel/reopen, and delete only their own events.
- Validate on client and server; show loading, success, empty, and error states.
- Mobile-first responsive interface with keyboard access.

### Later

- Ticketing, payments, RSVP capacity management, email/push notifications, maps, photo uploads, comments, and admin moderation.

## User stories and acceptance criteria

1. As a student, I can register as an attendee or organizer so the app can show features for my role.
   - Name, valid email, and password are required; duplicate emails and weak passwords receive clear errors.
   - Passwords are hashed; no password/hash appears in responses.
2. As a user, I can sign in and out.
   - Wrong credentials return a generic 401; auth uses an HttpOnly cookie.
3. As a visitor, I can browse and search upcoming published events.
   - Results are paginated and filtered by category/search; no matches show a helpful empty state.
4. As an attendee, I can save and unsave an event and see my saved list.
   - One user cannot read or alter another user's saved events.
5. As an organizer, I can publish a campus event.
   - Title, description, category, venue, start, and end are validated; end must follow start.
6. As an organizer, I can edit, cancel/reopen, and delete my own event.
   - A different organizer receives 403; an unknown event receives 404.

## Data model

- **User:** `name` (2–60), normalized unique `email`, `passwordHash`, `role` (`attendee` | `organizer`), timestamps.
- **Event:** `title` (5–100), `description` (20–2000), `category` (allow-list), `venue` (2–120), `startsAt`, `endsAt`, `status` (`published` | `cancelled`), `organizer` (User reference), timestamps.
- **SavedEvent:** `user` and `event` references with a unique compound index; timestamps.
- Indexes: unique email; event status/category/start date and text fields; unique user/event save pair. Event lists default to 10, capped at 20.

## Non-functional targets

- Responsive from 360 px; keyboard usable with visible focus and labeled inputs.
- API lists default to 10 and never exceed 20 records per page.
- Server validates all input and returns safe, consistent JSON errors.
- Secrets stay in server environment variables. Public event responses expose organizer display name, never email or password data.
- Node.js 20 or later; HTTPS in production.

## Screen sketches

- **Discover:** header, search, category filter, upcoming event cards, loading/empty/error states, pagination.
- **Event detail:** date/time, venue, description, organizer, save button; organizer controls only for the owner.
- **Sign in / Register:** labeled forms; registration includes attendee/organizer choice.
- **Create / Edit event:** title, description, category, venue, start/end date and time.
- **Saved events:** attendee's own saved list.
- **Organizer dashboard:** organizer's own events with edit, cancel/reopen, and delete controls.

