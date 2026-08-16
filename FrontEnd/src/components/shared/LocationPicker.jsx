import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { Crosshair, MapPin } from "lucide-react";

import LocationLabel from "./LocationLabel";

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});


// Cities that have seeded shelters behind them, so a request placed here
// has real nearby relief camps to match against. Handy when the whole team
// is demoing from one room and needs requests spread across the country.
const PRESETS = [
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
];


function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}


// Recentres the map when the value changes from the outside (GPS arriving,
// a preset being chosen) without fighting the user's own panning: a click
// on the map sets the value too, and re-centring on that would yank the
// view, so only externally-driven changes move the camera.
function Recenter({ position, trigger }) {
  const map = useMap();
  const lastTrigger = useRef(trigger);

  useEffect(() => {
    if (!position || trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    map.setView([position.lat, position.lng], 14);
  }, [position, trigger, map]);

  return null;
}


// Lets someone confirm or correct where they actually are. Browser
// geolocation on a laptop is resolved from Wi-Fi/IP rather than GPS and is
// routinely off by kilometres, so the detected point is a starting guess,
// not the final answer -- drag/click to correct it.
export default function LocationPicker({
  value,
  onChange,
  onUseGPS,
  gpsStatus = "idle",
  recenterKey = 0,
}) {
  const center = value ? [value.lat, value.lng] : [22.9734, 78.6569]; // India

  return (
    <div className="space-y-4">

      <div className="flex flex-wrap items-center gap-3">

        <button
          type="button"
          onClick={onUseGPS}
          className="card-glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary"
        >
          <Crosshair size={16} />
          {gpsStatus === "locating" ? "Locating..." : "Use my location"}
        </button>

        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange({ lat: preset.lat, lng: preset.lng })}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-secondary transition hover:bg-white/5 hover:text-primary"
          >
            {preset.name}
          </button>
        ))}

      </div>

      <div className="h-64 overflow-hidden rounded-2xl border border-white/10">
        <MapContainer
          center={center}
          zoom={value ? 14 : 4}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <ClickHandler onPick={onChange} />

          <Recenter position={value} trigger={recenterKey} />

          {value && (
            <Marker
              position={[value.lat, value.lng]}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  onChange({ lat, lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex items-start gap-2 text-sm text-secondary">
        <MapPin size={16} className="mt-0.5 shrink-0 text-danger" />
        {value ? (
          <span>
            <LocationLabel
              lat={value.lat}
              lng={value.lng}
              fallback="Resolving address..."
            />
            <span className="text-muted">
              {" "}
              ({value.lat.toFixed(5)}, {value.lng.toFixed(5)})
            </span>
          </span>
        ) : (
          <span>
            Tap the map, pick a city, or use your location to set where help
            should be sent.
          </span>
        )}
      </div>

    </div>
  );
}
