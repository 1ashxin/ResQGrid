import { useEffect, useState } from "react";
import { reverseGeocode } from "../../utils/geocode";

// Resolves a lat/lng pair into a human-readable "Locality, City, State"
// label, showing `fallback` (e.g. the raw coordinate string, or a stored
// address) until the lookup resolves -- or permanently, if it fails or the
// coordinate can't be matched to a named place.
export default function LocationLabel({ lat, lng, fallback }) {
  const [name, setName] = useState(null);

  useEffect(() => {
    setName(null);
    if (lat == null || lng == null) return;

    let cancelled = false;
    reverseGeocode(lat, lng).then((resolved) => {
      if (!cancelled) setName(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return name || fallback;
}
