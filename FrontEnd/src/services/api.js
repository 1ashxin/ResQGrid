const API_BASE_URL = "http://localhost:8000";

// Update volunteer location in real-time via PostGIS backend endpoint.
// Endpoint is keyed by user_id in the URL (not the body) and uses PATCH,
// matching BackEnd/app/routers/geo.py -- fixed here to match what the
// backend actually exposes.
export const updateVolunteerLocation = async (userId, latitude, longitude) => {
  const response = await fetch(`${API_BASE_URL}/geo/volunteers/${userId}/location`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_lat: parseFloat(latitude),
      current_lng: parseFloat(longitude),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update location");
  }

  return await response.json();
};

// Fetch PostGIS-calculated nearest volunteers to a specific SOS request
export const getNearestVolunteers = async (sosId, limit = 5, radiusMeters = 10000) => {
  const response = await fetch(
    `${API_BASE_URL}/geo/sos/${sosId}/nearest-volunteers?limit=${limit}&radius_meters=${radiusMeters}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch nearest volunteers");
  }

  return await response.json();
};
