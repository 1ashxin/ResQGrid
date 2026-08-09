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


// Automatically fit map around all active locations
function MapUpdater({ sosRequests, volunteers, shelters }) {
  const map = useMap();

  useEffect(() => {
    const locations = [
      // SOS locations
      ...sosRequests
        .filter(
          (sos) =>
            sos.locationLat != null &&
            sos.locationLng != null
        )
        .map((sos) => [
          sos.locationLat,
          sos.locationLng,
        ]),

      // Volunteer locations
      ...volunteers
        .filter(
          (volunteer) =>
            volunteer.lat != null &&
            volunteer.lng != null
        )
        .map((volunteer) => [
          volunteer.lat,
          volunteer.lng,
        ]),

      // Shelter locations
      ...shelters
        .filter(
          (shelter) =>
            shelter.lat != null &&
            shelter.lng != null
        )
        .map((shelter) => [
          shelter.lat,
          shelter.lng,
        ]),
    ];

    // No locations available
    if (locations.length === 0) {
      return;
    }

    // Only one location
    if (locations.length === 1) {
      map.setView(locations[0], 13);
      return;
    }

    // Multiple locations
    map.fitBounds(locations, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }, [sosRequests, volunteers, shelters, map]);

  return null;
}


function AdminLiveMap({
  sosRequests,
  volunteers,
  shelters,
}) {
  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={12}
      className="h-full w-full"
    >

      {/* Automatically fit map around SOS,
          volunteers and shelters */}
      <MapUpdater
        sosRequests={sosRequests}
        volunteers={volunteers}
        shelters={shelters}
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
        .filter(
          (sos) =>
            sos.locationLat != null &&
            sos.locationLng != null
        )
        .map((sos) => (
          <Marker
            key={sos.id}
            position={[
              sos.locationLat,
              sos.locationLng,
            ]}
            icon={sosIcon}
          >
            <Popup>
              <strong>🚨 SOS Request</strong>

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

      {volunteers
        .filter(
          (volunteer) =>
            volunteer.lat != null &&
            volunteer.lng != null
        )
        .map((volunteer, index) => (
          <CircleMarker
            key={`${volunteer.name}-${index}`}
            center={[
              volunteer.lat,
              volunteer.lng,
            ]}
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

              Status: {volunteer.status}

              <br />

              Task: {volunteer.task}
            </Popup>
          </CircleMarker>
        ))}


      {/* ========================= */}
      {/* SHELTER MARKERS */}
      {/* ========================= */}

      {shelters
        .filter(
          (shelter) =>
            shelter.lat != null &&
            shelter.lng != null
        )
        .map((shelter, index) => (
          <CircleMarker
            key={`${shelter.name}-${index}`}
            center={[
              shelter.lat,
              shelter.lng,
            ]}
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

              Status: {shelter.status}

              <br />

              Occupied: {shelter.occupied}

              <br />

              Capacity: {shelter.capacity}
            </Popup>
          </CircleMarker>
        ))}

    </MapContainer>
  );
}


export default AdminLiveMap;