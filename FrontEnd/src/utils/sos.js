// Shared helpers for turning a raw SOSRequestOut (from the backend) into
// the shapes the Admin and Volunteer dashboards render. Kept in one place
// so both stay consistent instead of drifting apart.

// The backend doesn't have dedicated "people affected" or "emergency type"
// columns yet -- SOSRequest.jsx folds them into the free-text description
// as "Emergency: X" / "People needing help: N" lines, so this pulls them
// back out for display. Falls back gracefully if a request wasn't created
// through that form (e.g. via /docs directly).
export function extractFromDescription(description, label) {
  if (!description) return null;
  const match = description.match(new RegExp(`${label}: (.+)`));
  return match ? match[1] : null;
}

export function formatRelativeTime(isoString) {
  // The backend serializes timestamps as naive UTC -- no "Z" or offset
  // suffix (they come from Python's datetime.utcnow()). Without this,
  // `new Date(...)` parses the string as local time instead of UTC, which
  // silently shifts every "time ago" by the viewer's UTC offset (e.g. ~5.5
  // hours off in IST).
  const utcString = /[Zz]|[+-]\d\d:?\d\d$/.test(isoString) ? isoString : `${isoString}Z`;
  const diffMs = Date.now() - new Date(utcString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} day ago`;
}

// priority_score now comes from Member 5's priority engine
// (core_security_and_logic/priority_engine.py), computed at SOS creation
// time. These thresholds mirror that engine's own priority_category()
// exactly, so the tier shown here always matches what the score means.
// null still means "not yet scored" (e.g. rows created before this was
// wired up, or via a direct API call that bypassed create_sos_request).
export function scoreToPriorityTier(score) {
  if (score == null) return "PENDING";
  if (score >= 70) return "CRITICAL";
  if (score >= 40) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}

export const SOS_STATUS_LABELS = {
  pending: "Unassigned",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// Mirrors BackEnd/app/geo.py's haversine_km exactly, so a distance computed
// here means the same thing as one computed server-side.
const EARTH_RADIUS_KM = 6371.0;

export function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}

export function transformSOSRequest(sos) {
  return {
    id: sos.id,
    priority: scoreToPriorityTier(sos.priority_score),
    request: extractFromDescription(sos.description, "Emergency") || sos.description || "SOS Request",
    location: `${sos.location_lat.toFixed(3)}, ${sos.location_lng.toFixed(3)}`,
    // Kept alongside the formatted `location` string above so distance can
    // be computed client-side against a volunteer's live position -- the
    // formatted string alone isn't enough to do math with.
    locationLat: sos.location_lat,
    locationLng: sos.location_lng,
    people: extractFromDescription(sos.description, "People needing help") || "-",
    status: SOS_STATUS_LABELS[sos.status] || sos.status,
    rawStatus: sos.status,
    time: formatRelativeTime(sos.created_at),
    // Raw timestamps, kept alongside `time` (a formatted display string)
    // so callers can do real date math -- e.g. "resolved today" counts or
    // average time-to-resolution.
    createdAt: sos.created_at,
    updatedAt: sos.updated_at,
    victimName: sos.victim_name,
    victimPhone: sos.victim_phone,
    assignedVolunteerId: sos.assigned_volunteer_id,
  };
}
