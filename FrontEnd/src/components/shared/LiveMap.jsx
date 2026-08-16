import { useEffect } from "react";

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


// Automatically fit map around all active locations
function MapUpdater({ sosRequests, volunteers, shelters, myPosition }) {
  const map = useMap();

  useEffect(() => {
    const locations = [
      ...sosRequests
        .filter((sos) => sos.locationLat != null && sos.locationLng != null)
        .map((sos) => [sos.locationLat, sos.locationLng]),

      ...volunteers.filter(hasCoords).map((v) => [v.lat, v.lng]),

      ...shelters.filter(hasCoords).map((s) => [s.lat, s.lng]),

      ...(myPosition ? [[myPosition.lat, myPosition.lng]] : []),
    ];

    if (locations.length === 0) {
      return;
    }

    if (locations.length === 1) {
      map.setView(locations[0], 13);
      return;
    }

    map.fitBounds(locations, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }, [sosRequests, volunteers, shelters, myPosition, map]);

  return null;
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

      <MapUpdater
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
