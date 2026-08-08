# ResQGrid API Reference (for Frontend Developers)

This document lists **every** endpoint the backend currently exposes. If
you've never worked with a backend before, here's the mental model:

- Your React app sends an HTTP request (like `fetch(...)`) to one of the
  URLs below.
- The backend reads it, talks to the database, and sends back a **JSON**
  response.
- Every response body shown below is exactly the JSON shape you'll receive
  — you can copy these as TypeScript interfaces or just eyeball the field
  names.

**Base URL (local development):** `http://127.0.0.1:8000`
So `POST /sos/` really means `POST http://127.0.0.1:8000/sos/`.

**You can also explore and test all of this live** at
`http://127.0.0.1:8000/docs` — an interactive page where you can click
"Try it out" on any endpoint below and see real responses, no React code
needed.

**No login/auth headers required yet.** Every endpoint below is currently
open — you don't need to send an `Authorization` header or token. That's
intentional for now; a login token system is planned for later. Don't
build any token-handling logic yet, it'll just be extra work to redo.

**Every request/response body is JSON.** When you send a body (POST/PATCH),
set the header `Content-Type: application/json` and `JSON.stringify(...)`
your object — standard `fetch` behavior.

**Errors** come back as a JSON object with one field:
```json
{ "detail": "Human-readable error message" }
```
Common status codes you'll see:
- `404` — the ID you asked for doesn't exist.
- `400` — your request conflicts with existing data (e.g. duplicate
  email, overfilling a shelter).
- `401` — login failed (wrong email/password).
- `422` — your request body is missing a required field or has the wrong
  type (e.g. sent a string where a number was expected). FastAPI
  generates this automatically before your code even runs.

---

## Table of Contents

- [Users](#users)
- [SOS Requests](#sos-requests)
- [Volunteers](#volunteers)
- [Shelters](#shelters)
- [Health Check](#health-check)
- [Field Reference (enums)](#field-reference-enums)

---

## Users

Accounts for volunteers, admins, and NGO staff. (Victims usually don't
need an account — see [SOS Requests](#sos-requests).)

### `POST /users/register`
Create a new login account.

**Request body:**
```json
{
  "email": "volunteer@example.com",
  "password": "a-plain-text-password",
  "role": "volunteer"
}
```
`role` must be one of: `"victim"`, `"volunteer"`, `"admin"`, `"ngo"`.

**Returns (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "volunteer@example.com",
  "role": "volunteer",
  "created_at": "2026-08-08T10:15:00"
}
```
Note: the password is never sent back, ever.

**Errors:** `400` if that email is already registered.

---

### `POST /users/login`
Check an email + password.

**Request body:**
```json
{
  "email": "volunteer@example.com",
  "password": "a-plain-text-password"
}
```

**Returns (200 OK):** same shape as register — a `UserOut` object (id,
email, role, created_at). Use the `role` field to decide which dashboard
to route the user to.

**Errors:** `401` if the email/password don't match.

⚠️ This does **not** return a login token/session. There's currently
nothing stopping you from calling any other endpoint without having
"logged in" — that's expected for now, not a bug.

---

### `GET /users/`
List registered accounts.

**Query parameters (optional):**
- `role` — filter to one role, e.g. `/users/?role=volunteer`. Omit it to
  get everyone.

**Returns (200 OK):** an array of `UserOut` objects (same shape as
register's response).
```json
[
  { "id": "...", "email": "...", "role": "volunteer", "created_at": "..." },
  { "id": "...", "email": "...", "role": "admin", "created_at": "..." }
]
```

---

### `GET /users/{user_id}`
Look up one account by its ID.

**Returns (200 OK):** a single `UserOut` object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /users/{user_id}/role`
Change a user's role (e.g. promote someone to admin).

**Request body:**
```json
{ "role": "admin" }
```

**Returns (200 OK):** the updated `UserOut` object.
**Errors:** `404` if that ID doesn't exist.

⚠️ Not locked down yet — currently anyone can call this on anyone.
Permission checks are planned for later.

---

## SOS Requests

A victim's cry for help: their location, situation, and current status.
No account/login needed to submit one.

### `POST /sos/`
Submit a new SOS request.

**Request body:**
```json
{
  "victim_name": "Priya Sharma",
  "victim_phone": "+91-9876543210",
  "description": "Trapped on second floor, water rising",
  "location_lat": 19.0760,
  "location_lng": 72.8777
}
```
`description` is optional — omit it or send `null` if there's nothing to add.

**Returns (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "victim_name": "Priya Sharma",
  "victim_phone": "+91-9876543210",
  "description": "Trapped on second floor, water rising",
  "location_lat": 19.0760,
  "location_lng": 72.8777,
  "status": "pending",
  "priority_score": null,
  "assigned_volunteer_id": null,
  "created_at": "2026-08-08T10:20:00",
  "updated_at": "2026-08-08T10:20:00"
}
```
`priority_score` starts as `null` — it gets filled in later (see the
`/priority` endpoint below).

---

### `GET /sos/`
List all SOS requests, **most urgent first**.

Sorted by `priority_score` descending. Requests that haven't been scored
yet (`priority_score` is `null`) are listed last, oldest-first, so
nothing gets buried.

**Returns (200 OK):** an array of the same object shape shown above.

---

### `GET /sos/{sos_id}`
Look up one SOS request by its ID.

**Returns (200 OK):** a single SOS request object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /sos/{sos_id}/status`
Move a request through its lifecycle.

**Request body:**
```json
{ "status": "resolved" }
```
Must be one of: `"pending"`, `"assigned"`, `"in_progress"`, `"resolved"`.

**Returns (200 OK):** the updated SOS request object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /sos/{sos_id}/priority`
Set the urgency score for a request.

**Request body:**
```json
{ "priority_score": 87.5 }
```
Higher number = more urgent. No fixed min/max — just a number.

**Returns (200 OK):** the updated SOS request object.
**Errors:** `404` if that ID doesn't exist.

> **Note for frontend devs:** you probably won't call this one directly
> from the UI. It's the hook the AI priority engine (Member 5's work)
> calls automatically after each SOS request comes in, to set how urgent
> it is. It exists as a normal endpoint so it can be tested/demoed
> independently before that engine is wired up.

---

### `PATCH /sos/{sos_id}/assign`
Assign a volunteer to this request. Automatically sets `status` to
`"assigned"`.

**Request body:**
```json
{ "volunteer_user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6" }
```
This must be a **user ID** (from `/users/`) belonging to someone with
role `volunteer` — not a volunteer *profile* ID.

**Returns (200 OK):** the updated SOS request object, with
`assigned_volunteer_id` filled in and `status: "assigned"`.

**Errors:** `404` if the SOS request ID doesn't exist, or if the given
`volunteer_user_id` doesn't match an existing volunteer.

---

## Volunteers

Volunteer-specific profile info (name, phone, skills, live location,
availability). A volunteer profile can only be created for a user account
that's already registered with `role: "volunteer"` — so the flow is
always: `POST /users/register` (role: volunteer) **first**, then
`POST /volunteers/`.

### `POST /volunteers/`
Create a volunteer profile for an already-registered volunteer account.

**Request body:**
```json
{
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "full_name": "Rahul Verma",
  "phone": "+91-9123456780",
  "skills": "First aid, boat driving"
}
```
`skills` is optional. `user_id` must belong to a user whose `role` is
`"volunteer"`.

**Returns (201 Created):**
```json
{
  "id": "b3f1...profile-id",
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "full_name": "Rahul Verma",
  "phone": "+91-9123456780",
  "skills": "First aid, boat driving",
  "is_available": true,
  "current_lat": null,
  "current_lng": null,
  "created_at": "2026-08-08T10:25:00"
}
```

**Errors:** `404` if `user_id` doesn't exist. `400` if that user isn't a
volunteer, or already has a profile.

---

### `GET /volunteers/`
List volunteer profiles.

**Query parameters (optional):**
- `available_only` — `true` to get only volunteers currently marked
  available (e.g. `/volunteers/?available_only=true`), useful when
  looking for someone to assign to a new SOS request. Omit it (or set
  `false`) to get everyone — used by the admin dashboard's full roster.

**Returns (200 OK):** an array of the profile object shown above.

---

### `GET /volunteers/{volunteer_id}`
Look up one volunteer profile by its **profile** ID (not the user ID).

**Returns (200 OK):** a single profile object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /volunteers/{volunteer_id}/availability`
Mark a volunteer available or busy (e.g. a toggle switch in the
volunteer's app).

**Request body:**
```json
{ "is_available": false }
```

**Returns (200 OK):** the updated profile object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /volunteers/{volunteer_id}/location`
Update a volunteer's current GPS position (e.g. sent periodically while
the volunteer's app is open).

**Request body:**
```json
{ "current_lat": 19.0821, "current_lng": 72.8416 }
```

**Returns (200 OK):** the updated profile object.
**Errors:** `404` if that ID doesn't exist.

---

## Shelters

Physical relief camps/shelters: location and how full they are.

### `POST /shelters/`
Register a new shelter.

**Request body:**
```json
{
  "name": "Community Hall - Sector 12",
  "address": "Sector 12 Main Road",
  "location_lat": 19.0330,
  "location_lng": 73.0297,
  "capacity_total": 200,
  "managed_by_user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
`address` and `managed_by_user_id` are optional.

**Returns (201 Created):**
```json
{
  "id": "c2d4...shelter-id",
  "name": "Community Hall - Sector 12",
  "address": "Sector 12 Main Road",
  "location_lat": 19.0330,
  "location_lng": 73.0297,
  "capacity_total": 200,
  "capacity_occupied": 0,
  "is_active": true,
  "managed_by_user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "created_at": "2026-08-08T10:30:00",
  "updated_at": "2026-08-08T10:30:00"
}
```

---

### `GET /shelters/`
List every shelter (including deactivated ones — check the `is_active`
field on each to filter client-side if you only want open shelters).

**Returns (200 OK):** an array of shelter objects shown above.

---

### `GET /shelters/{shelter_id}`
Look up one shelter by its ID.

**Returns (200 OK):** a single shelter object.
**Errors:** `404` if that ID doesn't exist.

---

### `PATCH /shelters/{shelter_id}/capacity`
Update how many people are currently in the shelter.

**Request body:**
```json
{ "capacity_occupied": 150 }
```

**Returns (200 OK):** the updated shelter object.
**Errors:**
- `404` if that ID doesn't exist.
- `400` if the number is negative, or greater than `capacity_total`.

---

### `PATCH /shelters/{shelter_id}/deactivate`
Close/decommission a shelter. This is a **soft delete** — the shelter
row stays in the database (so past capacity history isn't lost), it's
just flagged as inactive.

**Request body:** none — send an empty body.

**Returns (200 OK):** the updated shelter object, with
`"is_active": false`.
**Errors:** `404` if that ID doesn't exist.

> There is no hard-delete endpoint for shelters (or anything else in this
> API) — deactivating is the intended way to "remove" a shelter from
> active use.

---

## Health Check

### `GET /`
A simple check to confirm the server is up. No parameters.

**Returns (200 OK):**
```json
{ "status": "ok", "service": "ResQGrid API" }
```
Handy to `fetch("http://127.0.0.1:8000/")` once at app startup if you
want to show a "backend unreachable" banner when this fails.

---

## Field Reference (enums)

These are the only valid values for certain fields — sending anything
else gives you a `422` error.

**User `role`:**
`"victim"` | `"volunteer"` | `"admin"` | `"ngo"`

**SOS `status`:**
`"pending"` | `"assigned"` | `"in_progress"` | `"resolved"`

**IDs:** every `id` field (and `user_id`, `assigned_volunteer_id`,
`managed_by_user_id`, `volunteer_user_id`) is a UUID string, e.g.
`"3fa85f64-5717-4562-b3fc-2c963f66afa6"` — just treat it as an opaque
string, never try to parse or generate one yourself on the frontend.

**Dates:** `created_at` / `updated_at` are ISO 8601 timestamp strings
(e.g. `"2026-08-08T10:20:00"`) — pass them straight into
`new Date(value)` in JavaScript.
