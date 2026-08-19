import { useState, useEffect } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import VictimHeader from "../../components/victim/VictimHeader";
import SOSCard from "../../components/victim/SOSCard";
import StatusCard from "../../components/victim/StatusCard";
import ActivityTimeline from "../../components/victim/ActivityTimeline";
import ResponderCard from "../../components/victim/ResponderCard";
import ResponseMap from "../../components/shared/ResponseMap";
import QuickieHelpCard from "../../components/victim/QuickieHelpCard";

import { useRequest } from "../../context/RequestContext";
import {
  getSOSRequest,
  listVolunteers,
  listShelters,
  listNGOProfiles,
} from "../../api/client";
import {
  scoreToPriorityTier,
  formatRelativeTime,
  haversineKm,
} from "../../utils/sos";
import { transformShelter } from "../../utils/entities";

export default function VictimDashboard() {
  const { requestStatus, requestData, setRequestStatus } = useRequest();

  const [liveRequest, setLiveRequest] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [ngoCount, setNgoCount] = useState(0);

  const requestId = requestData?.id ?? null;

  // Everything on this page reflects real backend state, so it re-polls on
  // the same 15s cadence the other dashboards use. Volunteers/shelters/NGOs
  // are fetched even with no active request, since the "nearby help" and
  // "responders available" panels are useful before submitting an SOS too.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rawVolunteers, rawShelters, rawNGOs] = await Promise.all([
          listVolunteers(),
          listShelters(),
          listNGOProfiles(),
        ]);
        if (cancelled) return;
        setVolunteers(rawVolunteers);
        setShelters(rawShelters);
        setNgoCount(rawNGOs.length);
      } catch {
        // Network hiccup -- keep whatever we last had rather than blanking
        // the page or showing placeholder numbers.
      }

      if (!requestId) return;

      try {
        const sos = await getSOSRequest(requestId);
        if (cancelled) return;
        setLiveRequest(sos);
        // Keep the shared status in step with the backend, so a volunteer
        // accepting the request updates this page without a reload.
        if (sos.status === "assigned" || sos.status === "in_progress") {
          setRequestStatus("assigned");
        } else if (sos.status === "resolved") {
          setRequestStatus("resolved");
        }
      } catch {
        // Leave the last known request state in place.
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const victimPosition =
    liveRequest?.location_lat != null && liveRequest?.location_lng != null
      ? { lat: liveRequest.location_lat, lng: liveRequest.location_lng }
      : requestData?.lat != null && requestData?.lng != null
        ? { lat: requestData.lat, lng: requestData.lng }
        : null;

  const availableVolunteers = volunteers.filter((v) => v.is_available);

  const mapShelters = shelters.map(transformShelter);

  // Shelters sorted by real distance from the victim -- the "nearby help"
  // panel previously listed three fixed places with invented distances.
  const nearbyShelters = victimPosition
    ? mapShelters
        .filter((s) => s.lat != null && s.lng != null)
        .map((s) => ({
          ...s,
          distanceKm: haversineKm(victimPosition.lat, victimPosition.lng, s.lat, s.lng),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 3)
    : [];

  const assignedVolunteer = liveRequest?.assigned_volunteer_id
    ? volunteers.find((v) => v.user_id === liveRequest.assigned_volunteer_id)
    : null;

  const responderDistanceKm =
    assignedVolunteer &&
    assignedVolunteer.current_lat != null &&
    assignedVolunteer.current_lng != null &&
    victimPosition
      ? haversineKm(
          victimPosition.lat,
          victimPosition.lng,
          assignedVolunteer.current_lat,
          assignedVolunteer.current_lng
        )
      : null;

  const mapRequests =
    liveRequest && liveRequest.location_lat != null
      ? [
          {
            id: liveRequest.id,
            locationLat: liveRequest.location_lat,
            locationLng: liveRequest.location_lng,
            request: liveRequest.description || "Your emergency request",
            priority: scoreToPriorityTier(liveRequest.priority_score),
            status: liveRequest.status,
          },
        ]
      : [];

  return (
    <DashboardLayout>

      <VictimHeader />

      {/* Emergency Request */}
      <section className="mt-10">
        <SOSCard respondersAvailable={availableVolunteers.length} />
      </section>

      {/* Request Status */}
      <section className="mt-8">
        <StatusCard
          priority={
            liveRequest ? scoreToPriorityTier(liveRequest.priority_score) : null
          }
          volunteerCount={availableVolunteers.length}
          ngoCount={ngoCount}
          updated={
            liveRequest ? formatRelativeTime(liveRequest.updated_at) : null
          }
        />
      </section>

      {/* Live Activity Timeline */}
      <section className="mt-8">
        <ActivityTimeline />
      </section>

      {/* Assigned Responder */}
      {requestStatus === "assigned" && (
        <section className="mt-8">
          <ResponderCard
            volunteer={assignedVolunteer}
            distanceKm={responderDistanceKm}
            status={liveRequest?.status}
          />
        </section>
      )}

      {/* Live Response Map */}
      <section className="mt-8">
        <ResponseMap
          title="Help Around You"
          subtitle="Your reported location, nearby shelters and responders currently on the map."
          sosRequests={mapRequests}
          shelters={mapShelters}
          myPosition={victimPosition}
          myLabel="Your location"
        />
      </section>

      {/* Quick Help */}
      <section className="mt-8">
        <QuickieHelpCard shelters={nearbyShelters} />
      </section>

    </DashboardLayout>
  );
}
