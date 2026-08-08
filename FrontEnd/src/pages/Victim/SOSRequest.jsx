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
    <main className="min-h-screen bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <h1 className="text-4xl font-bold">
            Emergency Assistance Request
          </h1>

          <p className="mt-3 text-slate-300">
            Fill in the details below so nearby volunteers can assist you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              name="location"
              placeholder="Current Location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              required
            />

            <input
              type="number"
              name="people"
              placeholder="People Requiring Help"
              value={form.people}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
            />

            <select
              name="emergency"
              value={form.emergency}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-sky-400"
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
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#FF6B6B] py-4 text-lg font-semibold transition hover:bg-[#ff7d7d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Emergency Request"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}