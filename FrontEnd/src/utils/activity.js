// Turns the raw SOS/shelter/resource arrays (straight from api/client.js) into
// a single "what's happening" feed, sorted most-recent-first. Shared by the
// admin notification bell, the Notifications page, and the History page so
// the derivation logic only exists once instead of three times.

import { extractFromDescription, scoreToPriorityTier } from "./sos";

const CAPACITY_WARNING_THRESHOLD = 0.85;

function formatLatLng(lat, lng) {
  if (lat == null || lng == null) return null;
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

export function buildActivityFeed(sosRequests = [], shelters = [], resources = []) {
  const items = [];

  for (const sos of sosRequests) {
    const emergency = extractFromDescription(sos.description, "Emergency") || "Emergency";
    const location = formatLatLng(sos.location_lat, sos.location_lng);

    if (sos.status === "resolved") {
      items.push({
        id: `sos-resolved-${sos.id}`,
        kind: "sos-resolved",
        title: "SOS request resolved",
        description: `${sos.victim_name}'s ${emergency.toLowerCase()} request was marked resolved.`,
        location,
        timestamp: sos.updated_at,
      });
    } else if (sos.status === "assigned" || sos.status === "in_progress") {
      items.push({
        id: `sos-progress-${sos.id}`,
        kind: "sos-progress",
        title: sos.status === "in_progress" ? "Response in progress" : "Volunteer assigned",
        description: `${sos.victim_name}'s ${emergency.toLowerCase()} request is being handled.`,
        location,
        timestamp: sos.updated_at,
      });
    } else if (scoreToPriorityTier(sos.priority_score) === "CRITICAL") {
      items.push({
        id: `sos-critical-${sos.id}`,
        kind: "sos-critical",
        title: "Critical SOS detected",
        description: `${emergency} reported by ${sos.victim_name}.`,
        location,
        timestamp: sos.created_at,
      });
    } else {
      items.push({
        id: `sos-new-${sos.id}`,
        kind: "sos-new",
        title: "New SOS request",
        description: `${emergency} reported by ${sos.victim_name}.`,
        location,
        timestamp: sos.created_at,
      });
    }
  }

  for (const shelter of shelters) {
    if (!shelter.is_active || !shelter.capacity_total) continue;
    const pct = shelter.capacity_occupied / shelter.capacity_total;
    if (pct >= CAPACITY_WARNING_THRESHOLD) {
      items.push({
        id: `shelter-${shelter.id}`,
        kind: "shelter-warning",
        title: pct >= 1 ? "Shelter at full capacity" : "Shelter nearing capacity",
        description: `${shelter.name} is at ${Math.min(100, Math.round(pct * 100))}% capacity.`,
        location: shelter.address || formatLatLng(shelter.location_lat, shelter.location_lng),
        timestamp: shelter.updated_at,
      });
    }
  }

  for (const resource of resources) {
    if (resource.status !== "low") continue;
    items.push({
      id: `resource-${resource.id}`,
      kind: "resource-warning",
      title: "Resource running low",
      description: `${resource.name} is low (${Number(resource.quantity).toLocaleString()} ${resource.unit} left).`,
      location: null,
      timestamp: resource.updated_at,
    });
  }

  return items.sort(
    (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  );
}
