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
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} day ago`;
}

// priority_score is set later by Member 5's AI priority engine -- it's
// null for every request until that's wired up, so everything currently
// buckets into "PENDING" rather than a real severity tier.
export function scoreToPriorityTier(score) {
  if (score == null) return "PENDING";
  if (score >= 80) return "CRITICAL";
  if (score >= 50) return "HIGH";
  return "MEDIUM";
}

export const SOS_STATUS_LABELS = {
  pending: "Unassigned",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export function transformSOSRequest(sos) {
  return {
    id: sos.id,
    priority: scoreToPriorityTier(sos.priority_score),
    request: extractFromDescription(sos.description, "Emergency") || sos.description || "SOS Request",
    location: `${sos.location_lat.toFixed(3)}, ${sos.location_lng.toFixed(3)}`,
    people: extractFromDescription(sos.description, "People needing help") || "-",
    status: SOS_STATUS_LABELS[sos.status] || sos.status,
    rawStatus: sos.status,
    time: formatRelativeTime(sos.created_at),
    victimName: sos.victim_name,
    victimPhone: sos.victim_phone,
    assignedVolunteerId: sos.assigned_volunteer_id,
  };
}
