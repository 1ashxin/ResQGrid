import axios from "axios";

// Falls back to the local backend's default address if VITE_API_URL isn't
// set. To point at a different backend (e.g. a teammate's machine, or a
// deployed server), create a .env file in FrontEnd/ with:
//   VITE_API_URL=http://127.0.0.1:8000
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ---------- Users ----------

export function registerUser(payload) {
  return api.post("/users/register", payload).then((res) => res.data);
}

export function loginUser(payload) {
  return api.post("/users/login", payload).then((res) => res.data);
}

// ---------- SOS requests ----------

export function createSOSRequest(payload) {
  return api.post("/sos/", payload).then((res) => res.data);
}

export function listSOSRequests() {
  return api.get("/sos/").then((res) => res.data);
}

export function getSOSRequest(sosId) {
  return api.get(`/sos/${sosId}`).then((res) => res.data);
}

export function updateSOSStatus(sosId, status) {
  return api.patch(`/sos/${sosId}/status`, { status }).then((res) => res.data);
}

export function assignVolunteer(sosId, volunteerUserId) {
  return api
    .patch(`/sos/${sosId}/assign`, { volunteer_user_id: volunteerUserId })
    .then((res) => res.data);
}

export function nearestVolunteers(sosId, limit = 5) {
  return api
    .get(`/sos/${sosId}/nearest-volunteers`, { params: { limit } })
    .then((res) => res.data);
}

// ---------- Volunteers ----------

export function listVolunteers(availableOnly = false) {
  return api
    .get("/volunteers/", { params: { available_only: availableOnly } })
    .then((res) => res.data);
}

export function createVolunteerProfile(payload) {
  return api.post("/volunteers/", payload).then((res) => res.data);
}

export function updateVolunteerAvailability(volunteerId, isAvailable) {
  return api
    .patch(`/volunteers/${volunteerId}/availability`, { is_available: isAvailable })
    .then((res) => res.data);
}

export function updateVolunteerLocation(volunteerId, lat, lng) {
  return api
    .patch(`/volunteers/${volunteerId}/location`, { current_lat: lat, current_lng: lng })
    .then((res) => res.data);
}

// ---------- Shelters ----------

export function listShelters() {
  return api.get("/shelters/").then((res) => res.data);
}

export function nearbyShelters(lat, lng, radiusKm = 10) {
  return api
    .get("/shelters/nearby", { params: { lat, lng, radius_km: radiusKm } })
    .then((res) => res.data);
}
