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
import {
  listSOSRequests,
  listVolunteers,
  listShelters,
  assignVolunteer,
  updateSOSStatus,
} from "../../api/client";
import { updateVolunteerLocation } from "../../services/api";
import { transformSOSRequest, haversineKm } from "../../utils/sos";
import { transformVolunteer, transformShelter } from "../../utils/entities";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  // Bumped after accepting or completing a mission to re-sync immediately
  // instead of waiting out the rest of the 15s poll.
  const [refreshTick, setRefreshTick] = useState(0);

  const isVolunteer = !!user && user.role === "volunteer";

  useEffect(() => {
    if (!isVolunteer) return;

    let cancelled = false;

    async function loadDashboardData(isInitialLoad) {
      try {
        const [rawSOS, rawVolunteers, rawShelters] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
          listShelters(),
        ]);
        if (cancelled) return;
        const transformed = rawSOS.map(transformSOSRequest);
        setAllRequests(transformed);
        setRequests(transformed.filter((sos) => sos.rawStatus === "pending"));
        setVolunteers(rawVolunteers);
        setShelters(rawShelters);

        // The mission in progress is whatever the backend says is assigned
        // to this volunteer -- not something remembered only in this tab.
        // Held purely in local state it vanished on any refresh or page
        // change: an assigned request is filtered out of the pending list,
        // so the "Complete Mission" button disappeared with it and the
        // request was stuck as assigned with no way to close it.
        setActiveMission(
          transformed.find(
            (sos) =>
              sos.assignedVolunteerId === user.id &&
              (sos.rawStatus === "assigned" || sos.rawStatus === "in_progress")
          ) || null
        );
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
  }, [isVolunteer, refreshTick]);

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

  // Map layers. An accepted mission stays on the map even though it's no
  // longer "pending", so the volunteer can still see where they're headed.
  const mapRequests = activeMission
    ? [activeMission, ...requests.filter((r) => r.id !== activeMission.id)]
    : requests;

  // Own marker is drawn separately from myPosition, so drop it from the
  // volunteer layer to avoid stacking two markers on the same spot.
  const mapVolunteers = volunteers
    .filter((v) => v.user_id !== user.id)
    .map((v) => transformVolunteer(v, allRequests));

  const mapShelters = shelters.map(transformShelter);

  const nearestShelterKm =
    myPosition && mapShelters.length > 0
      ? Math.min(
          ...mapShelters
            .filter((s) => s.lat != null && s.lng != null)
            .map((s) => haversineKm(myPosition.lat, myPosition.lng, s.lat, s.lng))
        )
      : null;

  const mapSummary = [
    { title: "Open Requests", value: requests.length },
    { title: "Responders Online", value: volunteers.length },
    { title: "Shelters Mapped", value: mapShelters.length },
    {
      title: "Nearest Shelter",
      value:
        nearestShelterKm != null && Number.isFinite(nearestShelterKm)
          ? `${nearestShelterKm.toFixed(1)} km`
          : "Locating...",
    },
  ];

  async function handleAccept(request) {
    try {
      await assignVolunteer(request.id, user.id);
      // Shown straight away so the hand-off feels instant; the refresh
      // below replaces it with the backend's own version a moment later.
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      setActiveMission(request);
      showToast("You have accepted the emergency request.", "success");
      setRefreshTick((tick) => tick + 1);
    } catch {
      showToast("Couldn't accept the request. Please try again.", "error");
    }
  }

  async function handleComplete() {
    try {
      await updateSOSStatus(activeMission.id, "resolved");
      setActiveMission(null);
      showToast("Mission marked as completed.", "success");
      setRefreshTick((tick) => tick + 1);
    } catch {
      // Keep the mission on screen when the update fails -- clearing it
      // here used to leave the volunteer with no way back to it.
      showToast("Couldn't update the request status. Please try again.", "error");
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

        <ResponseMap
          subtitle="Live emergencies, fellow responders and nearby shelters around your current position."
          sosRequests={mapRequests}
          volunteers={mapVolunteers}
          shelters={mapShelters}
          myPosition={myPosition}
          myLabel="Your position"
          summary={mapSummary}
        />

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
