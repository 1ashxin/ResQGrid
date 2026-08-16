import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { listSOSRequests, listVolunteers, listShelters, listResources } from "../../api/client";
import { transformSOSRequest } from "../../utils/sos";

import DashboardLayout from "../../layouts/DashboardLayout";

import NGOHeader from "../../components/ngo/NGOHeader";
import NGOStats from "../../components/ngo/NGOStats";
import NGORequestCard from "../../components/ngo/NGORequestCard";
import NGOInventory from "../../components/ngo/NGOInventory";
import VolunteerManagement from "../../components/ngo/VolunteerManagement";
import ReliefCampCard from "../../components/ngo/ReliefCampCard";
import NGOAnalytics from "../../components/ngo/NGOAnalytics";

const RESOURCE_STATUS_LABELS = {
  good: "Healthy",
  moderate: "Moderate",
  low: "Low",
};

function transformResource(resource) {
  return {
    item: resource.name,
    available: `${Number(resource.quantity).toLocaleString()} ${resource.unit}`,
    status: RESOURCE_STATUS_LABELS[resource.status] || resource.status,
  };
}

function transformVolunteer(volunteer) {
  return {
    id: volunteer.id,
    name: volunteer.full_name,
    role: volunteer.skills || "General Volunteer",
    location:
      volunteer.current_lat != null && volunteer.current_lng != null
        ? `${volunteer.current_lat.toFixed(3)}, ${volunteer.current_lng.toFixed(3)}`
        : "Unknown",
    phone: volunteer.phone,
    status: volunteer.is_available ? "Available" : "Assigned",
  };
}

// Shelters are what this dashboard calls "relief camps" -- same table,
// NGO-facing vocabulary. Only active ones are shown, since the section is
// titled "Active Relief Camps".
function transformCamp(shelter) {
  const percentage = Math.round(
    (shelter.capacity_occupied / shelter.capacity_total) * 100
  );
  return {
    id: shelter.id,
    name: shelter.name,
    location:
      shelter.address ||
      `${shelter.location_lat.toFixed(3)}, ${shelter.location_lng.toFixed(3)}`,
    people: shelter.capacity_occupied,
    // The backend doesn't track which services a shelter offers -- no
    // field for it in the schema -- so this stays a generic placeholder
    // rather than fabricating specifics per camp.
    services: "Medical • Food • Shelter",
    status: percentage >= 85 ? "Limited Capacity" : "Operational",
  };
}

export default function NGODashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [sosRequests, setSosRequests] = useState([]);
  const [rawVolunteers, setRawVolunteers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [resources, setResources] = useState([]);
  const [rawResources, setRawResources] = useState([]);

  const isNgo = !!user && user.role === "ngo";

  useEffect(() => {
    if (!isNgo) return;

    let cancelled = false;

    async function loadDashboardData(isInitialLoad) {
      try {
        const [rawSOS, volunteers, rawShelters, rawResources] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
          listShelters(),
          listResources(),
        ]);
        if (cancelled) return;

        setSosRequests(rawSOS.map(transformSOSRequest));
        setRawVolunteers(volunteers);
        setCamps(rawShelters.filter((s) => s.is_active).map(transformCamp));
        setResources(rawResources.map(transformResource));
        setRawResources(rawResources);
      } catch {
        // Only surface a toast on the initial load, not on every failed
        // background refresh -- otherwise a down backend spams a new
        // toast every 15 seconds.
        if (!cancelled && isInitialLoad) {
          showToast("Couldn't load live data from the backend. Is it running?", "error");
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
  }, [isNgo]);

  if (!isNgo) {
    return <Navigate to="/volunteer/login" replace />;
  }

  const volunteers = rawVolunteers.map(transformVolunteer);
  const activeRequests = sosRequests.filter((r) => r.rawStatus !== "resolved");

  const requests = activeRequests.map((r) => {
    const assignedVolunteer = rawVolunteers.find(
      (v) => v.user_id === r.assignedVolunteerId
    );
    return {
      id: r.id,
      emergency: r.request,
      location: r.location,
      people: r.people,
      reported: r.time,
      priority: r.priority,
      team: assignedVolunteer ? assignedVolunteer.full_name : "Unassigned",
    };
  });

  // Real operational analytics, derived from the same live data the rest of
  // this dashboard renders.
  const resolvedRequests = sosRequests.filter((r) => r.rawStatus === "resolved");

  const avgResponseMinutes =
    resolvedRequests.length > 0
      ? Math.round(
          resolvedRequests.reduce(
            (sum, r) => sum + (new Date(r.updatedAt) - new Date(r.createdAt)) / 60000,
            0
          ) / resolvedRequests.length
        )
      : null;

  const analyticsValues = {
    avgResponse: avgResponseMinutes != null ? `${avgResponseMinutes} min` : "N/A",
    resolutionRate:
      sosRequests.length > 0
        ? `${Math.round((resolvedRequests.length / sosRequests.length) * 100)}%`
        : "N/A",
    activeCamps: camps.length,
    availableVolunteers: rawVolunteers.filter((v) => v.is_available).length,
  };

  const statValues = {
    activeVolunteers: volunteers.length,
    activeSOS: activeRequests.length,
    reliefCamps: camps.length,
    // Sums raw quantity across every resource type regardless of unit (L,
    // kits, packets, ...) -- a rough total, not a per-unit breakdown.
    resourcesOnHand: rawResources.reduce((sum, r) => sum + Number(r.quantity), 0),
  };

  return (
    <DashboardLayout>

      <NGOHeader />

      <NGOStats values={statValues} />

      <NGORequestCard requests={requests} />

      <NGOInventory resources={resources} />

      <VolunteerManagement volunteers={volunteers} />

      <ReliefCampCard camps={camps} />

      <NGOAnalytics {...analyticsValues} />

    </DashboardLayout>
  );
}
