import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SearchResultCard from "../../components/search/SearchResultCard";
import { listVolunteers, listNGOProfiles, listSOSRequests } from "../../api/client";
import { SOS_STATUS_LABELS } from "../../utils/sos";

function formatLatLng(lat, lng) {
  if (lat == null || lng == null) return "Location unknown";
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

function volunteerToResult(volunteer) {
  return {
    id: `volunteer-${volunteer.id}`,
    name: volunteer.full_name,
    role: "Volunteer",
    location: formatLatLng(volunteer.current_lat, volunteer.current_lng),
    status: volunteer.is_available ? "Available" : "On Mission",
  };
}

function ngoToResult(ngo) {
  return {
    id: `ngo-${ngo.id}`,
    name: ngo.org_name,
    role: "NGO",
    location: ngo.address || ngo.operation_areas || "Location unknown",
    status: "Registered",
  };
}

function sosToResult(sos) {
  return {
    id: `sos-${sos.id}`,
    name: sos.victim_name,
    role: "Victim",
    location: formatLatLng(sos.location_lat, sos.location_lng),
    status: SOS_STATUS_LABELS[sos.status] || sos.status,
  };
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [volunteers, ngos, sosRequests] = await Promise.all([
          listVolunteers(),
          listNGOProfiles(),
          listSOSRequests(),
        ]);
        if (cancelled) return;
        setResults([
          ...volunteers.map(volunteerToResult),
          ...ngos.map(ngoToResult),
          ...sosRequests.map(sosToResult),
        ]);
      } catch {
        // Leave whatever was already loaded rather than wiping results
        // out on a transient failed refresh.
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredResults = normalizedQuery
    ? results.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.role.toLowerCase().includes(normalizedQuery) ||
          item.location.toLowerCase().includes(normalizedQuery)
      )
    : results;

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Search
          </h1>

          <p className="mt-2 text-secondary">
            Search volunteers, NGOs and victims across ResQGrid.
          </p>

        </div>

        {/* Search Bar */}

        <div className="card-glass mb-8 rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <SearchIcon
              size={22}
              className="text-secondary"
            />

            <input
              type="text"
              placeholder="Search by name, role or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-primary outline-none placeholder:text-secondary"
            />

          </div>

        </div>

        {/* Results */}

        <div className="space-y-5">

          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <SearchResultCard
                key={item.id}
                {...item}
              />
            ))
          ) : (
            <div className="card-glass rounded-2xl p-10 text-center">

              <h3 className="text-xl font-semibold text-primary">
                No Results Found
              </h3>

              <p className="mt-2 text-secondary">
                Try searching for another volunteer, NGO or victim.
              </p>

            </div>
          )}

        </div>

      </section>
    </DashboardLayout>
  );
}
