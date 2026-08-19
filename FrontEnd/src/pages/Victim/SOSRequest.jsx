import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Siren } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useRequest } from "../../context/RequestContext";
import { createSOSRequest, updateSOSPriority } from "../../api/client";
import LocationPicker from "../../components/shared/LocationPicker";
import { watchBestPosition } from "../../utils/geolocation";

// ---- One-tap emergency SOS ------------------------------------------------
// What the panic button sends in place of the fields nobody filled in.
//
// The description keeps the same "Label: value" shape the form below uses,
// because utils/sos.js reads those lines back out for the admin and
// volunteer boards. Without them the request would render as a wall of raw
// text where every other row shows an emergency type.
const PANIC_DESCRIPTION = [
  "Emergency: Unspecified — one-tap SOS",
  "People needing help: Unknown",
  "Sent from the emergency button. The victim did not stop to enter any",
  "details, so nothing is known about their situation. Treat as critical",
  "until someone makes contact.",
].join("\n");

// The backend requires both of these (schemas.SOSRequestCreate), and a
// panic press has neither. They are written out in full rather than left
// blank so a dispatcher reading the board sees "we don't know" instead of
// an empty cell that looks like a display bug.
const PANIC_VICTIM_NAME = "Unidentified — one-tap SOS";
const PANIC_VICTIM_PHONE = "Not provided";

// A panic press carries no words for the priority engine to score, and the
// engine only counts keywords -- so left alone this would land near the
// bottom of the admin board, which is the opposite of what the button is
// for. 60 puts it at the top of HIGH: ahead of every described supply
// request, still behind any request whose own text earned CRITICAL. Set
// explicitly rather than relying on the wording above happening to contain
// a scoring keyword, which would break silently if anyone reworded it.
const PANIC_PRIORITY_SCORE = 60;

// How long the button waits for the location watch (already running since
// the page opened) to produce a fix before giving up.
const PANIC_FIX_TIMEOUT_MS = 12000;

// Turns a failed submission into something a victim can act on.
//
// Two traps here. The rate limiter's 429 reports itself as `error`, not
// `detail` -- that body is written by slowapi's own handler, not FastAPI's
// -- so reading only `detail` reported a refused submission as "couldn't
// reach the server, please try again", which is both untrue and the worst
// advice available: retrying is the one thing that cannot work. And the
// raw text it sends ("Rate limit exceeded: 10 per 1 hour") is written for
// whoever tuned the limit, not for someone who needs help now.
function submissionErrorMessage(err) {
  if (err.response?.status === 429) {
    return "Too many requests have been sent from this connection recently. If this is life-threatening, call your local emergency number now.";
  }

  return (
    err.response?.data?.detail ||
    err.response?.data?.error ||
    "Couldn't reach the server. Please try again."
  );
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

  // Where help will actually be sent. The pin places itself and keeps
  // correcting as the device narrows the fix down (see utils/geolocation),
  // so in the normal case nobody has to touch the map at all. Manual
  // adjustment is the fallback for a bad fix or a demo, not the workflow.
  const [coords, setCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [recenterKey, setRecenterKey] = useState(0);
  const stopWatchRef = useRef(null);

  const [sendingPanic, setSendingPanic] = useState(false);

  // A mirror of `coords` that waitForFix can read. The panic handler is
  // async, so by the time it looks the state variable captured in its
  // closure is whatever it was when the button was pressed -- i.e. still
  // null, even though a fix has since arrived.
  const coordsRef = useRef(null);
  const fixPollRef = useRef(null);

  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

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
    return () => {
      stopWatchRef.current?.();
      if (fixPollRef.current) clearInterval(fixPollRef.current);
    };
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

  // Resolves with the best fix available, or null if none arrives in time.
  // The watch started on mount is usually already done by the time anyone
  // presses the button; this only actually waits in the first few seconds
  // after the page opens.
  function waitForFix(timeoutMs = PANIC_FIX_TIMEOUT_MS) {
    return new Promise((resolve) => {
      if (coordsRef.current) {
        resolve(coordsRef.current);
        return;
      }

      const startedAt = Date.now();

      fixPollRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt;

        if (coordsRef.current || elapsed > timeoutMs) {
          clearInterval(fixPollRef.current);
          fixPollRef.current = null;
          resolve(coordsRef.current);
        }
      }, 250);
    });
  }

  // One press, no fields, no confirmation step -- for someone who cannot
  // afford the twenty seconds the form below takes. Everything the backend
  // needs that we don't have is filled with the explicit placeholders above.
  async function handleEmergencySOS() {
    setSendingPanic(true);

    try {
      // A location is the one thing that genuinely cannot be defaulted: a
      // request with no point on the map gives responders nowhere to go.
      let fix = coordsRef.current;

      if (!fix) {
        // Permission was refused or the device has no way to locate itself.
        // Waiting would just burn twelve seconds before failing anyway.
        if (gpsStatus === "failed") {
          showToast(
            "Location is switched off, so this can't be sent instantly. Set your location on the map below and submit the form.",
            "error"
          );
          return;
        }

        showToast("Getting your location — hold on…", "info");
        fix = await waitForFix();
      }

      if (!fix) {
        showToast(
          "Couldn't get your location in time. Tap the map below to set it, then submit.",
          "error"
        );
        return;
      }

      const sos = await createSOSRequest({
        victim_name: PANIC_VICTIM_NAME,
        victim_phone: PANIC_VICTIM_PHONE,
        description: PANIC_DESCRIPTION,
        location_lat: fix.lat,
        location_lng: fix.lng,
      });

      // Best effort, and deliberately not awaited into the failure path
      // below: the request is already filed, which is the part that matters.
      // If this call fails the request simply keeps the score the priority
      // engine gave it rather than the pinned one.
      try {
        await updateSOSPriority(sos.id, PANIC_PRIORITY_SCORE);
      } catch {
        // Ignored on purpose -- see above.
      }

      setRequestData({
        ...form,
        id: sos.id,
        status: sos.status,
        lat: fix.lat,
        lng: fix.lng,
        emergency: "Unspecified — one-tap SOS",
      });
      setRequestStatus("searching");

      showToast("Emergency SOS sent. Help is being alerted now.", "success");

      navigate("/victim");
    } catch (err) {
      showToast(submissionErrorMessage(err), "error");
    } finally {
      setSendingPanic(false);
    }
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
      showToast(submissionErrorMessage(err), "error");
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

          {/* One-tap SOS. Sits above the form on purpose: someone who needs
              this cannot be asked to scroll past six fields to find it. */}
          <div className="mt-8 rounded-2xl border border-white/10 p-6">

            <button
              type="button"
              onClick={handleEmergencySOS}
              disabled={sendingPanic}
              className="btn-danger flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >

              <Siren size={22} />

              {sendingPanic ? "Sending SOS…" : "Send Emergency SOS Now"}

            </button>

            <p className="mt-4 text-center text-sm text-muted">
              Sends immediately using your current location, with no details
              and no confirmation. Use this if you can't fill in the form —
              a responder will call to find out more.
            </p>

          </div>

          <div className="mt-8 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs uppercase tracking-wider text-muted">
              or send full details
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

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