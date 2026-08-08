import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useRequest } from "../../context/RequestContext";
import { createSOSRequest } from "../../api/client";

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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    let coords;
    try {
      coords = await getCurrentPosition();
    } catch {
      // No GPS fix available -- fall back to (0, 0) rather than block
      // submission entirely. The typed "location" field is still sent
      // along in the description so responders aren't left with nothing.
      coords = { lat: 0, lng: 0 };
      showToast("Couldn't get your GPS location -- sending with typed location only.", "info");
    }

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

      setRequestData({ ...form, id: sos.id, status: sos.status });
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
              placeholder="Current Location"
              value={form.location}
              onChange={handleChange}
              className="input-glass rounded-xl p-4"
              required
            />

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