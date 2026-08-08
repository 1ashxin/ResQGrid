import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function RecenterMap({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(
        [userLocation.latitude, userLocation.longitude],
        15,
        {
          duration: 1.5,
        }
      );
    }
  }, [userLocation, map]);

  return null;
}

export default function LocationMap({ userLocation }) {
  const mapCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [19.076, 72.8777];

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{
        height: "450px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap userLocation={userLocation} />

      {userLocation && (
        <Marker
          position={[
            userLocation.latitude,
            userLocation.longitude,
          ]}
        >
          <Popup>
            <strong>Your Location</strong>
            <br />
            Latitude: {userLocation.latitude.toFixed(5)}
            <br />
            Longitude: {userLocation.longitude.toFixed(5)}
            <br />
            Accuracy: {Math.round(userLocation.accuracy)} m
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}