import { useState } from "react";
import LocationPanel from "../../components/location/LocationPanel";
import LocationMap from "../../components/location/LocationMap";

export default function VictimDashboard() {
  const [userLocation, setUserLocation] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px 60px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "14px",
            }}
          >
            <span>●</span>
            Emergency Location
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Share your location
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#94a3b8",
              fontSize: "16px",
              lineHeight: "1.6",
              maxWidth: "700px",
            }}
          >
            Help responders find you faster by sharing your current
            location with ResQGrid.
          </p>
        </div>

        {/* Location action card */}
        <div
          style={{
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "14px",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            background: "rgba(30, 41, 59, 0.65)",
          }}
        >
          <LocationPanel onLocationReceived={setUserLocation} />
        </div>

        {/* Map */}
        <div
          style={{
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          }}
        >
          <LocationMap userLocation={userLocation} />
        </div>
      </div>
    </div>
  );
}