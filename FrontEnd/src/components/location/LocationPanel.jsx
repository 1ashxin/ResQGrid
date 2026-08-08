import { useState } from "react";

export default function LocationPanel({ onLocationReceived }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    let finished = false;

    const finishWithError = (message) => {
      if (finished) return;

      finished = true;
      setLoading(false);
      setError(message);
    };

    // Safety timeout in case the browser never returns a response.
    const timeout = setTimeout(() => {
      finishWithError(
        "Location request timed out. Please check that Windows location services are enabled."
      );
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (finished) return;

        finished = true;
        clearTimeout(timeout);

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        onLocationReceived(location);
        setLoading(false);
        setSuccess(true);
      },

      (locationError) => {
        clearTimeout(timeout);

        if (locationError.code === 1) {
          finishWithError(
            "Location permission was denied. Please allow location access for localhost."
          );
        } else if (locationError.code === 2) {
          finishWithError(
            "Your location could not be determined. Check your device location settings."
          );
        } else if (locationError.code === 3) {
          finishWithError(
            "Location request timed out. Please try again."
          );
        } else {
          finishWithError(
            "Unable to retrieve your location. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            📍 Your current position
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Your location helps nearby responders reach you faster.
          </p>
        </div>

        <button
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            padding: "11px 18px",
            borderRadius: "9px",
            border: "none",
            background: loading ? "#475569" : "#ef4444",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.2s",
          }}
        >
          {loading ? "Locating you..." : "📍 Share My Location"}
        </button>
      </div>

      {success && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(34, 197, 94, 0.1)",
            color: "#86efac",
            fontSize: "13px",
          }}
        >
          ✓ Location detected successfully.
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#fca5a5",
            fontSize: "13px",
          }}
        >
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
  
