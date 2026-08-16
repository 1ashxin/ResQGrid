// Reverse geocoding via OpenStreetMap's Nominatim -- free, no API key,
// consistent with the OSM tiles already used for the Leaflet map
// (LiveMap.jsx). Volunteers and SOS requests only ever have raw
// lat/lng (no stored address), so this turns those coordinates into a
// "Locality, City, State" label for display.
//
// Nominatim's usage policy caps unauthenticated use at ~1 request/sec, so
// lookups are serialized through a queue with a spacing delay, and results
// are cached by rounded coordinate (~100m) so the same spot is never
// looked up twice, even across repeated dashboard polls.

const cache = new Map();
let queue = Promise.resolve();
const MIN_REQUEST_GAP_MS = 1100;

function cacheKey(lat, lng) {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

function formatAddress(address) {
  if (!address) return null;

  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.village ||
    address.town ||
    null;
  const city = address.city || address.town || address.county || null;
  const state = address.state || null;

  const parts = [];
  if (locality && locality !== city) parts.push(locality);
  if (city) parts.push(city);
  if (state) parts.push(state);

  return parts.length ? parts.join(", ") : null;
}

async function fetchReverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);
  const data = await res.json();
  return formatAddress(data.address);
}

// Resolves to a "Locality, City, State" string, or null if the lookup
// fails or the coordinate can't be matched to a named place.
export function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) return Promise.resolve(null);

  const key = cacheKey(lat, lng);
  if (cache.has(key)) return cache.get(key);

  const result = queue.then(() => fetchReverseGeocode(lat, lng)).catch(() => null);

  queue = result.then(
    () => new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_GAP_MS)),
    () => new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_GAP_MS))
  );

  cache.set(key, result);
  return result;
}
