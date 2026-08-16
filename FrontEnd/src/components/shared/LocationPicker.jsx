import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { Crosshair, MapPin } from "lucide-react";

import LocationLabel from "./LocationLabel";
import { describeAccuracy } from "../../utils/geolocation";

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});


// Cities that have seeded shelters behind them, so a request placed here
// has real nearby relief camps to match against. Handy when the whole team
// is demoing from one room and needs requests spread across the country.
//
// Deliberately offset a kilometre or two from the shelter itself: an
// emergency reported at the exact coordinates of a relief camp would sit
// on top of that marker and report a nearest shelter "0.0 km away".
const PRESETS = [
  { name: "Delhi", lat: 28.6841, lng: 77.1225 },
  { name: "Guwahati", lat: 26.1645, lng: 91.7562 },
  { name: "Chennai", lat: 13.0627, lng: 80.2507 },
  { name: "Kochi", lat: 9.9512, lng: 76.2873 },
  { name: "Kolkata", lat: 22.5526, lng: 88.3439 },
  { name: "Bengaluru", lat: 12.9916, lng: 77.6146 },
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
  const accuracy = describeAccuracy(value?.accuracy);

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
            onClick={() =>
              onChange({ lat: preset.lat, lng: preset.lng }, { recenter: true })
            }
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

          {/* How sure the device is. Seeing the uncertainty makes it obvious
              whether the pin is worth correcting or already spot on. */}
          {value && value.accuracy != null && value.accuracy > 50 && (
            <Circle
              center={[value.lat, value.lng]}
              radius={value.accuracy}
              pathOptions={{
                color: "#38bdf8",
                fillColor: "#38bdf8",
                fillOpacity: 0.12,
                weight: 1,
              }}
            />
          )}

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

            {accuracy && (
              <span
                className={`mt-1 block text-xs ${
                  accuracy.trusted ? "text-success" : "text-warning"
                }`}
              >
                {accuracy.text}
                {!accuracy.trusted &&
                  " Drag the pin if it's off — a phone with GPS will be far more precise."}
              </span>
            )}

            {gpsStatus === "manual" && (
              <span className="mt-1 block text-xs text-muted">
                Location set by hand.
              </span>
            )}
          </span>
        ) : (
          <span>
            {gpsStatus === "locating"
              ? "Finding your location..."
              : "Tap the map, pick a city, or use your location to set where help should be sent."}
          </span>
        )}
      </div>

    </div>
  );
}
