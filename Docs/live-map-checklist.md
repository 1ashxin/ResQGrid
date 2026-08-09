# Live Response Map — Implementation Checklist

Both the Volunteer dashboard and Admin dashboard currently show a **fake, hand-drawn
map** (a styled `<div>` with hardcoded pin positions and city-name labels — no real
coordinates, no mapping library). This doc covers replacing both with a real live map
using **Leaflet + OpenStreetMap** — free, no API key or billing account needed.

React is on **v19.2.8** in this project, so use `react-leaflet` **v5+** (v4 and earlier
are React 18-only and won't work here).

---

## Shared setup (needed for both maps)

**Install:**
```bash
npm install leaflet react-leaflet
```

**Two bundler gotchas — fix once, in whichever file the map lives in:**

```js
import "leaflet/dist/leaflet.css"; // required or the map renders broken/blank
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: icon, shadowUrl: iconShadow });
```
Without this, Leaflet's default marker icons either don't render or 404 — the default
icon paths don't resolve correctly through Vite's bundler.

**No API key needed** — OpenStreetMap tiles are free, attribution is required:
```jsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>
```

**Real data is already available — nothing to build on the backend.** Call these from
`FrontEnd/src/api/client.js`:

| Function | Returns | Key fields |
|---|---|---|
| `listSOSRequests()` | all SOS requests | `location_lat`, `location_lng`, `status`, `priority_score`, `victim_name` |
| `listVolunteers()` | all volunteer profiles | `current_lat`, `current_lng` (null until they've granted location once), `is_available`, `full_name` |
| `listShelters()` | all shelters | `location_lat`, `location_lng`, `capacity_total`, `capacity_occupied` |

Poll on the same `setInterval(..., 15000)` pattern already used everywhere else in the
app (see `VolunteerDashboard.jsx`, `AdminDashboard.jsx`) so the map updates live without
a manual refresh.

`priority_score` is a real 0–100 number now (Member 5's priority engine went live
today). To color-code markers by urgency, reuse `scoreToPriorityTier()` from
`FrontEnd/src/utils/sos.js` — same CRITICAL/HIGH/MEDIUM/LOW/PENDING tiers used
everywhere else, so the map stays visually consistent with the rest of the app.

---

## Member 2 — Volunteer dashboard map

**Replace:** `FrontEnd/src/components/shared/ResponseMap.jsx`
(rendered from `FrontEnd/src/pages/Volunteer/VolunteerDashboard.jsx`)

- [ ] `npm install leaflet react-leaflet`, add the CSS import + icon fix above
- [ ] Fetch `listSOSRequests()`, filter to `status === "pending"` (same filter
      `VolunteerDashboard.jsx` already applies) — these are the ones the volunteer
      needs to see
- [ ] Center the map on the volunteer's own position. `VolunteerDashboard.jsx` already
      grabs this via `navigator.geolocation` in its location-push effect — that same
      `{lat, lng}` is what `<MapContainer center={[lat, lng]}>` needs
- [ ] One marker per pending SOS request at `[location_lat, location_lng]`, with a
      `<Popup>` showing victim name / description / priority
- [ ] Optional: a distinct marker/icon for the volunteer's own position, so they can
      see themselves relative to requests
- [ ] Color markers by priority tier (see shared setup above)

## Member 6 (Swara) — Admin dashboard map

**Replace:** the "LIVE DISASTER MAP" section inside the Dashboard tab of
`FrontEnd/src/pages/Admin/AdminDashboard.jsx`

- [ ] Same install + CSS/icon fix as above
- [ ] `AdminDashboard.jsx` already fetches `sosRequests`, `volunteers`, and `shelters`
      every 15s — reuse that state instead of adding new fetches
- [ ] Three marker layers (color-coded, not necessarily separate toggles):
  - SOS requests — red, colored by priority tier
  - Volunteers — green, only ones with non-null `current_lat`/`current_lng`
  - Shelters — blue/orange based on occupancy percentage
- [ ] Since this covers the whole operation (not one person's neighborhood), fit the
      map bounds around all markers rather than centering on one location —
      `map.fitBounds(...)` in Leaflet
- [ ] Click/hover a marker → popup with the same detail fields already shown in the
      corresponding admin table tab (SOS Requests / Volunteers / Shelters), so the map
      stays consistent with the rest of the dashboard

---

## Optional: avoid duplicate work

Both maps need the same Leaflet setup (CSS import, icon fix, priority-color logic). It
might be worth agreeing on a small shared helper (e.g. a `useSosMarkerIcon()` hook or a
shared marker-color function) in `FrontEnd/src/components/shared/`, so that logic isn't
written twice — but that's a call for whoever picks this up, not a hard requirement.

---

## Timing note

Feature Freeze is **Aug 10** per the project plan ("no new features, fix broken links
only" after that point) — so this is really a today-or-tomorrow-morning task if it's
going to make it in before the freeze.
