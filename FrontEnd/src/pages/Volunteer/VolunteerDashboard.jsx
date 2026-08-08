import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import VolunteerHeader from "../../components/volunteer/VolunteerHeader";
import VolunteerStats from "../../components/volunteer/VolunteerStats";
import ResponseMap from "../../components/shared/ResponseMap";

import {
  Users,
  MapPin,
  Phone,
  Flame,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { listSOSRequests, assignVolunteer } from "../../api/client";
import { updateVolunteerLocation } from "../../services/api";
import { transformSOSRequest } from "../../utils/sos";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [requests, setRequests] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  const isVolunteer = !!user && user.role === "volunteer";

  useEffect(() => {
    if (!isVolunteer) return;

    let cancelled = false;

    async function loadPendingRequests(isInitialLoad) {
      try {
        const rawSOS = await listSOSRequests();
        if (cancelled) return;
        const pending = rawSOS
          .map(transformSOSRequest)
          .filter((sos) => sos.rawStatus === "pending");
        setRequests(pending);
      } catch {
        if (!cancelled && isInitialLoad) {
          showToast("Couldn't load requests from the backend. Is it running?", "error");
        }
      }
    }

    loadPendingRequests(true);
    const interval = setInterval(() => loadPendingRequests(false), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVolunteer]);

  // Pushes this volunteer's live GPS location to the PostGIS-backed
  // endpoint (services/api.js) every 20s, so "nearest volunteer" queries
  // have fresh data to work with once PostGIS is fully set up. This fails
  // silently for now -- the current_location column it writes to doesn't
  // exist in schema.sql yet (Member 4's setup, still in progress), so
  // every call 500s until that lands. No point alarming the volunteer
  // with an error toast for something outside their control.
  useEffect(() => {
    if (!isVolunteer || !navigator.geolocation) return;

    function pushLocation() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateVolunteerLocation(user.id, pos.coords.latitude, pos.coords.longitude).catch(() => {
            console.warn("PostGIS location sync not available yet (needs Member 4's schema setup)");
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    pushLocation();
    const interval = setInterval(pushLocation, 20000);
    return () => clearInterval(interval);
  }, [isVolunteer, user?.id]);

  if (!isVolunteer) {
    return <Navigate to="/login" replace />;
  }

  async function handleAccept(requestId) {
    setAcceptingId(requestId);
    try {
      await assignVolunteer(requestId, user.id);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      showToast("You have accepted the emergency request.", "success");
    } catch {
      showToast("Couldn't accept the request. Please try again.", "error");
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <DashboardLayout>

      <VolunteerHeader />

      <VolunteerStats />

      {/* Incoming Requests */}
      <section className="mt-10">

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Incoming Requests
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Nearby Emergencies
          </h2>

        </div>

        {requests.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">

            <CheckCircle2
              size={60}
              className="mx-auto text-emerald-300"
            />

            <h3 className="mt-6 text-3xl font-bold">
              No Active Requests
            </h3>

            <p className="mt-3 text-slate-300">
              New SOS requests will automatically appear here.
            </p>

          </div>

        )}

        <div className="space-y-8">

          {requests.map((requestData) => (

            <div
              key={requestData.id}
              className="rounded-3xl border border-red-400/20 bg-white/5 p-8 backdrop-blur-xl"
            >

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-5">

                  <div className="rounded-3xl bg-red-500/15 p-5">

                    <Flame
                      size={36}
                      className="text-red-300"
                    />

                  </div>

                  <div>

                    <h2 className="text-3xl font-bold">
                      {requestData.request}
                    </h2>

                    <p className="mt-2 text-slate-300">
                      {requestData.time}
                    </p>

                  </div>

                </div>

                <div className="rounded-full bg-red-500/20 px-5 py-2 font-semibold text-red-300">
                  {requestData.priority}
                </div>

              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">

                <InfoCard
                  icon={<Users className="text-sky-300" />}
                  title="People Requiring Help"
                  value={requestData.people}
                />

                <InfoCard
                  icon={<MapPin className="text-red-300" />}
                  title="Location"
                  value={requestData.location}
                />

                <InfoCard
                  icon={<Phone className="text-emerald-300" />}
                  title="Contact Number"
                  value={requestData.victimPhone}
                />

                <InfoCard
                  title="Victim Name"
                  value={requestData.victimName}
                />

              </div>

              <button
                onClick={() => handleAccept(requestData.id)}
                disabled={acceptingId === requestData.id}
                className="mt-10 w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {acceptingId === requestData.id ? "Accepting..." : "Accept Request"}
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* Live Response Map */}
      <div className="mt-12">
        <ResponseMap />
      </div>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6">

      {icon && <div className="mb-3">{icon}</div>}

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-white">
        {value}
      </h3>

    </div>
  );
}