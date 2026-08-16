import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import LocationLabel from "./LocationLabel";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";


// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});


// Custom SOS icon
const sosIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: bold;
      box-shadow: 0 0 18px rgba(239, 68, 68, 0.8);
    ">
      SOS
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});


// Fallback view (Pune) used only until real markers arrive -- MapUpdater
// re-centres on the actual data as soon as any of it loads.
const DEFAULT_CENTER = [18.5204, 73.8567];
const DEFAULT_ZOOM = 12;

function hasCoords(item) {
  return item.lat != null && item.lng != null;
}


function hasSOSCoords(sos) {
  return sos.locationLat != null && sos.locationLng != null;
}


// Fits the map around everything on it -- but only when the set of markers
// actually changes, never on a plain refresh.
//
// The dashboards rebuild these arrays from scratch every 15s poll, so
// depending on the arrays themselves re-ran this on every poll and threw
// away whatever the user had panned or zoomed to, roughly every 15 seconds.
// Keying off a signature of *what* is on the map (SOS ids, marker counts,
// whether we have an own-position yet) means a newly reported emergency
// still pulls the view to include it, while a volunteer's GPS drifting a
// few metres -- or no change at all -- leaves the view alone.
function MapController({ sosRequests, volunteers, shelters, myPosition }) {
  const map = useMap();
  const lastSignature = useRef(null);

  const signature = [
    sosRequests.filter(hasSOSCoords).map((s) => s.id).sort().join(","),
    volunteers.filter(hasCoords).length,
    shelters.filter(hasCoords).length,
    myPosition ? "me" : "",
  ].join("|");

  function collectLocations() {
    return [
      ...sosRequests.filter(hasSOSCoords).map((s) => [s.locationLat, s.locationLng]),
      ...volunteers.filter(hasCoords).map((v) => [v.lat, v.lng]),
      ...shelters.filter(hasCoords).map((s) => [s.lat, s.lng]),
      ...(myPosition ? [[myPosition.lat, myPosition.lng]] : []),
    ];
  }

  function fitAll() {
    const locations = collectLocations();

    if (locations.length === 0) return;

    if (locations.length === 1) {
      map.setView(locations[0], 13);
      return;
    }

    map.fitBounds(locations, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }

  useEffect(() => {
    if (signature === lastSignature.current) return;
    lastSignature.current = signature;
    fitAll();
    // Deliberately keyed on the signature alone: the marker arrays change
    // identity on every poll, and depending on them is what caused the
    // constant re-zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map]);

  // Leaflet's own control classes handle pointer events, so clicks here
  // don't fall through and pan the map underneath.
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          type="button"
          onClick={fitAll}
          title="Fit the map around every marker"
          className="block cursor-pointer border-none bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
        >
          Recenter
        </button>
      </div>
    </div>
  );
}


// The single real Leaflet map used across the app. Every marker list is
// optional, so a dashboard can show only the layers it actually has data
// for (e.g. a victim sees shelters and their own position, an admin sees
// everything).
function LiveMap({
  sosRequests = [],
  volunteers = [],
  shelters = [],
  myPosition = null,
  myLabel = "You are here",
}) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >

      <MapController
        sosRequests={sosRequests}
        volunteers={volunteers}
        shelters={shelters}
        myPosition={myPosition}
      />


      {/* OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />


      {/* ========================= */}
      {/* SOS MARKERS */}
      {/* ========================= */}

      {sosRequests
        .filter((sos) => sos.locationLat != null && sos.locationLng != null)
        .map((sos) => (
          <Marker
            key={sos.id}
            position={[sos.locationLat, sos.locationLng]}
            icon={sosIcon}
          >
            <Popup>
              <strong>🚨 SOS Request</strong>

              <br />

              Location:{" "}
              <LocationLabel
                lat={sos.locationLat}
                lng={sos.locationLng}
                fallback={`${sos.locationLat.toFixed(3)}, ${sos.locationLng.toFixed(3)}`}
              />

              <br />

              Emergency: {sos.request}

              <br />

              Priority: {sos.priority || "Unknown"}

              <br />

              Status: {sos.status || "Unknown"}

              <br />

              People needing help: {sos.people || "-"}
            </Popup>
          </Marker>
        ))}


      {/* ========================= */}
      {/* VOLUNTEER MARKERS */}
      {/* ========================= */}

      {volunteers.filter(hasCoords).map((volunteer, index) => (
        <CircleMarker
          key={`${volunteer.name}-${index}`}
          center={[volunteer.lat, volunteer.lng]}
          radius={8}
          pathOptions={{
            color: "green",
            fillColor: "green",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <strong>🟢 Volunteer</strong>

            <br />

            Name: {volunteer.name}

            <br />

            Location:{" "}
            <LocationLabel
              lat={volunteer.lat}
              lng={volunteer.lng}
              fallback={`${volunteer.lat.toFixed(3)}, ${volunteer.lng.toFixed(3)}`}
            />

            <br />

            Status: {volunteer.status}

            <br />

            Task: {volunteer.task}
          </Popup>
        </CircleMarker>
      ))}


      {/* ========================= */}
      {/* SHELTER MARKERS */}
      {/* ========================= */}

      {shelters.filter(hasCoords).map((shelter, index) => (
        <CircleMarker
          key={`${shelter.name}-${index}`}
          center={[shelter.lat, shelter.lng]}
          radius={9}
          pathOptions={{
            color: "gold",
            fillColor: "gold",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <strong>🏠 Shelter</strong>

            <br />

            Name: {shelter.name}

            <br />

            Location: {shelter.location}

            <br />

            Status: {shelter.status}

            <br />

            Occupied: {shelter.occupied}

            <br />

            Capacity: {shelter.capacity}
          </Popup>
        </CircleMarker>
      ))}


      {/* ========================= */}
      {/* VIEWER'S OWN POSITION */}
      {/* ========================= */}

      {myPosition && (
        <CircleMarker
          center={[myPosition.lat, myPosition.lng]}
          radius={10}
          pathOptions={{
            color: "#38bdf8",
            fillColor: "#38bdf8",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>📍 {myLabel}</strong>

            <br />

            <LocationLabel
              lat={myPosition.lat}
              lng={myPosition.lng}
              fallback={`${myPosition.lat.toFixed(3)}, ${myPosition.lng.toFixed(3)}`}
            />
          </Popup>
        </CircleMarker>
      )}

    </MapContainer>
  );
}


export default LiveMap;
