import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

import VolunteerHeader from "../../components/volunteer/VolunteerHeader";
import VolunteerStats from "../../components/volunteer/VolunteerStats";
import RequestCard from "../../components/volunteer/RequestCard";

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
import { listSOSRequests, listVolunteers, assignVolunteer, updateSOSStatus } from "../../api/client";
import { updateVolunteerLocation } from "../../services/api";
import { transformSOSRequest, haversineKm } from "../../utils/sos";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [myPosition, setMyPosition] = useState(null);

  const isVolunteer = !!user && user.role === "volunteer";

  useEffect(() => {
    if (!isVolunteer) return;

    let cancelled = false;

    async function loadDashboardData(isInitialLoad) {
      try {
        const [rawSOS, rawVolunteers] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
        ]);
        if (cancelled) return;
        const transformed = rawSOS.map(transformSOSRequest);
        setAllRequests(transformed);
        setRequests(transformed.filter((sos) => sos.rawStatus === "pending"));
        setVolunteers(rawVolunteers);
      } catch {
        if (!cancelled && isInitialLoad) {
          showToast("Couldn't load requests from the backend. Is it running?", "error");
        }
      }
    }

    loadDashboardData(true);
    const interval = setInterval(() => loadDashboardData(false), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVolunteer]);

  // Pushes this volunteer's live GPS location to the PostGIS-backed
  // endpoint (services/api.js) every 20s, so "nearest volunteer" queries
  // have fresh data to work with. Fails silently -- no point alarming the
  // volunteer with an error toast if it ever hiccups.
  useEffect(() => {
    if (!isVolunteer || !navigator.geolocation) return;

    function pushLocation() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          updateVolunteerLocation(user.id, pos.coords.latitude, pos.coords.longitude).catch(() => {
            console.warn("Location sync failed");
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
    return <Navigate to="/volunteer/login" replace />;
  }

  // Distance can only be computed once we know the volunteer's own
  // position (from the geolocation effect above) -- until then, requests
  // stay in the backend's default order (priority, then oldest first)
  // and show no distance rather than a made-up one.
  const requestsWithDistance = myPosition
    ? requests
        .map((r) => ({
          ...r,
          distanceKm: haversineKm(myPosition.lat, myPosition.lng, r.locationLat, r.locationLng),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
    : requests;

  const myProfile = volunteers.find((v) => v.user_id === user.id);

  const today = new Date();
  const resolvedToday = allRequests.filter(
    (r) =>
      r.rawStatus === "resolved" &&
      new Date(r.updatedAt).toDateString() === today.toDateString()
  );
  const resolved = allRequests.filter((r) => r.rawStatus === "resolved");
  const avgResponseMinutes =
    resolved.length > 0
      ? Math.round(
          resolved.reduce(
            (sum, r) => sum + (new Date(r.updatedAt) - new Date(r.createdAt)) / 60000,
            0
          ) / resolved.length
        )
      : null;

  const statValues = {
    nearbyRequests: requests.length,
    volunteersOnline: volunteers.length,
    completedToday: resolvedToday.length,
    avgResponse: avgResponseMinutes != null ? `${avgResponseMinutes} min` : "N/A",
  };

  async function handleAccept(request) {
    try {
      await assignVolunteer(request.id, user.id);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setActiveMission(request);
      showToast("You have accepted the emergency request.", "success");
    } catch {
      showToast("Couldn't accept the request. Please try again.", "error");
    }
  }

  async function handleComplete() {
    try {
      await updateSOSStatus(activeMission.id, "resolved");
      showToast("Mission marked as completed.", "success");
    } catch {
      showToast("Couldn't update the request status. Please try again.", "error");
    } finally {
      setActiveMission(null);
    }
  }

  return (
    <DashboardLayout>

      <VolunteerHeader isAvailable={myProfile ? myProfile.is_available : true} />

      <VolunteerStats values={statValues} />

      <section className="mt-12">

        {!activeMission && (

          <>
            <div className="mb-8">

              <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
                Incoming Requests
              </p>

              <h2 className="mt-2 text-4xl font-bold text-primary">
                Nearby Emergencies
              </h2>

            </div>

            {requests.length === 0 && (
              <div className="card-glass rounded-3xl p-8 text-center text-secondary">
                No pending requests right now.
              </div>
            )}

            <div className="space-y-6">

              {requestsWithDistance.map((request) => (

                <RequestCard
                  key={request.id}
                  request={{
                    ...request,
                    emergency: request.request,
                    phone: request.victimPhone,
                    distance:
                      request.distanceKm != null
                        ? `${request.distanceKm.toFixed(1)} km`
                        : "Unknown",
                  }}
                  onAccept={handleAccept}
                />

              ))}

            </div>

          </>

        )}

        {activeMission && (

          <div className="card-glass rounded-3xl p-8">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="rounded-3xl bg-danger p-5">

                  <Flame
                    size={36}
                    className="text-white"
                  />

                </div>

                <div>

                  <p className="text-brand text-sm uppercase tracking-[0.25em]">
                    Current Mission
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-primary">
                    {activeMission.request}
                  </h2>

                  <p className="mt-2 text-secondary">
                    You have accepted this emergency request.
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-success px-5 py-2 font-semibold text-white">
                Assigned
              </div>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <InfoCard
                icon={<Users className="text-brand" />}
                title="People Requiring Help"
                value={activeMission.people}
              />

              <InfoCard
                icon={<MapPin className="text-danger" />}
                title="Location"
                value={activeMission.location}
              />

              <InfoCard
                icon={<Phone className="text-success" />}
                title="Contact Number"
                value={activeMission.victimPhone}
              />

              <InfoCard
                title="Victim Name"
                value={activeMission.victimName}
              />

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <button className="btn-success rounded-2xl py-4 font-semibold">
                Call Victim
              </button>

              <button className="btn-primary rounded-2xl py-4 font-semibold">
                Navigate
              </button>

            </div>

            <button
              onClick={handleComplete}
              className="btn-danger mt-6 w-full rounded-2xl py-4 font-semibold"
            >
              <CheckCircle2 size={18} className="mr-2 inline" />
              Complete Mission
            </button>

          </div>

        )}

      </section>

      <div className="mt-12">

        <ResponseMap />

      </div>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-card rounded-2xl p-5">

      {icon && <div className="mb-3">{icon}</div>}

      <p className="text-sm text-muted">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-primary">
        {value}
      </h3>

    </div>
  );
}
