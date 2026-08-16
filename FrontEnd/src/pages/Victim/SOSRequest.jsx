import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useRequest } from "../../context/RequestContext";
import { createSOSRequest } from "../../api/client";
import LocationPicker from "../../components/shared/LocationPicker";
import { watchBestPosition } from "../../utils/geolocation";

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

  // Where help will actually be sent. The pin places itself and keeps
  // correcting as the device narrows the fix down (see utils/geolocation),
  // so in the normal case nobody has to touch the map at all. Manual
  // adjustment is the fallback for a bad fix or a demo, not the workflow.
  const [coords, setCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [recenterKey, setRecenterKey] = useState(0);
  const stopWatchRef = useRef(null);

  function locateMe() {
    setGpsStatus("locating");
    stopWatchRef.current?.();

    stopWatchRef.current = watchBestPosition({
      onUpdate: (fix) => {
        setCoords(fix);
        // Follow the pin while it's still self-correcting -- each update is
        // strictly more accurate than the last.
        setRecenterKey((k) => k + 1);
        setGpsStatus("done");
      },
      onError: () => {
        setGpsStatus("failed");
        showToast(
          "Couldn't detect your location. Tap the map to set it manually.",
          "info"
        );
      },
    });
  }

  // Starts locating the moment the form opens, so a fix is usually ready
  // before the rest of the form is filled in.
  useEffect(() => {
    locateMe();
    return () => stopWatchRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Any hand-placed point wins: stop the watch so an incoming fix can't
  // silently drag the pin back off the spot someone just chose.
  function setCoordsManually(next, options = {}) {
    stopWatchRef.current?.();
    stopWatchRef.current = null;
    setGpsStatus("manual");
    setCoords({ lat: next.lat, lng: next.lng, accuracy: null });
    if (options.recenter) setRecenterKey((k) => k + 1);
  }

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
                Responders are sent to this exact point. It sharpens on its
                own for a few seconds — only correct it if it looks wrong.
              </p>

              <div className="mt-4">
                <LocationPicker
                  value={coords}
                  onChange={setCoordsManually}
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