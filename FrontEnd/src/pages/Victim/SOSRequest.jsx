import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useRequest } from "../../context/RequestContext";
import { createSOSRequest } from "../../api/client";
import LocationPicker from "../../components/shared/LocationPicker";

// Wraps the browser's geolocation API in a promise, with a short timeout --
// SOS submission shouldn't hang forever waiting on a GPS fix that may never
// come (e.g. permission denied, indoors, older device).
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

export default function SOSRequest() {
  const navigate = useNavigate();

  const {
    setRequestStatus,
    setRequestData,
  } = useRequest();

  const { showToast } = useNotification();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    people: "",
    emergency: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Where help will actually be sent. Seeded from the browser's own
  // geolocation as a first guess, but always correctable -- on a laptop
  // that guess comes from Wi-Fi/IP lookup rather than GPS and can land
  // kilometres away, and during a demo the whole team is in one room.
  const [coords, setCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [recenterKey, setRecenterKey] = useState(0);

  function locateMe() {
    setGpsStatus("locating");
    getCurrentPosition()
      .then((position) => {
        setCoords(position);
        setRecenterKey((k) => k + 1);
        setGpsStatus("done");
      })
      .catch(() => {
        setGpsStatus("failed");
        showToast(
          "Couldn't detect your location. Tap the map to set it manually.",
          "info"
        );
      });
  }

  // One attempt on open, so the common case needs no interaction.
  useEffect(() => {
    locateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Never submit without real coordinates. Sending (0, 0) as a fallback
    // would drop a live emergency into the Gulf of Guinea on every map, so
    // the request is held back until a point has been set -- by GPS, by
    // tapping the map, or by picking a city.
    if (!coords) {
      showToast(
        "Set your location on the map first -- responders need a point to head to.",
        "error"
      );
      return;
    }

    setSubmitting(true);

    // The backend doesn't have dedicated columns for emergency type/people
    // count yet, so they're folded into the free-text description.
    const description = [
      form.emergency && `Emergency: ${form.emergency}`,
      form.people && `People needing help: ${form.people}`,
      form.location && `Reported location: ${form.location}`,
      form.notes,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const sos = await createSOSRequest({
        victim_name: form.name,
        victim_phone: form.phone,
        description,
        location_lat: coords.lat,
        location_lng: coords.lng,
      });

      // Coordinates are kept alongside the form fields so the dashboard can
      // centre the live map on the victim and measure real distances to
      // shelters, rather than showing invented ones.
      setRequestData({
        ...form,
        id: sos.id,
        status: sos.status,
        lat: coords.lat,
        lng: coords.lng,
      });
      setRequestStatus("searching");

      showToast("Emergency request submitted successfully!", "success");

      setTimeout(() => {
        showToast("Searching for nearby responders...", "info");
      }, 700);

      navigate("/victim");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Couldn't reach the server. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-primary min-h-screen py-12">

      <div className="mx-auto max-w-3xl px-6">

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-secondary transition hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Form Card */}

        <div className="card-glass rounded-3xl p-10">

          <h1 className="section-title text-4xl">
            Emergency Assistance Request
          </h1>

          <p className="section-subtitle mt-3">
            Fill in the details below so nearby volunteers can assist you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Landmark / Address Details"
              value={form.location}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
              required
            />

            <div className="rounded-2xl border border-white/10 p-5">

              <p className="text-sm font-semibold text-primary">
                Pinpoint Your Location
              </p>

              <p className="mt-1 text-xs text-muted">
                Responders are sent to this exact point. Drag the pin or tap
                the map if the detected spot isn't right.
              </p>

              <div className="mt-4">
                <LocationPicker
                  value={coords}
                  onChange={setCoords}
                  onUseGPS={locateMe}
                  gpsStatus={gpsStatus}
                  recenterKey={recenterKey}
                />
              </div>

            </div>

            <input
              type="number"
              name="people"
              placeholder="People Requiring Help"
              value={form.people}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
            />

            <select
              name="emergency"
              value={form.emergency}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
              required
            >
              <option value="" className="bg-[#223449] text-white">
                Select Emergency
              </option>

              <option value="Medical" className="bg-[#223449] text-white">
                Medical
              </option>

              <option value="Flood" className="bg-[#223449] text-white">
                Flood
              </option>

              <option value="Fire" className="bg-[#223449] text-white">
                Fire
              </option>

              <option value="Earthquake" className="bg-[#223449] text-white">
                Earthquake
              </option>

              <option value="Food & Water" className="bg-[#223449] text-white">
                Food & Water
              </option>

              <option value="Shelter Needed" className="bg-[#223449] text-white">
                Shelter Needed
              </option>
            </select>

            <textarea
              name="notes"
              placeholder="Additional Information"
              value={form.notes}
              onChange={handleChange}
              rows={5}
              className="input-glass rounded-xl p-4"
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn-danger w-full rounded-2xl py-4 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Emergency Request"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}