import { useState, useEffect } from "react";
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

import { useNotification } from "../../context/NotificationContext";
import { listSOSRequests, updateSOSStatus } from "../../api/client";
import { transformSOSRequest } from "../../utils/sos";

export default function VolunteerDashboard() {
  const { showToast } = useNotification();
  const [requests, setRequests] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
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
  }, []);

  // There's no volunteer login/identity system in the frontend yet, so we
  // can't call the real /sos/{id}/assign endpoint (it needs a specific
  // volunteer's user_id). This still does a real, meaningful state change
  // -- pending -> in_progress -- visible to the admin dashboard too; full
  // per-volunteer assignment needs volunteer auth built first.
  async function handleAccept(requestId) {
    setAcceptingId(requestId);
    try {
      await updateSOSStatus(requestId, "in_progress");
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

      <div className="mt-10">
        <ResponseMap />
      </div>

      <section className="mt-12">

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