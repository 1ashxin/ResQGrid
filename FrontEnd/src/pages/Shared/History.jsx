import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryCard from "../../components/history/HistoryCard";
import { listSOSRequests, listShelters, listResources } from "../../api/client";
import { buildActivityFeed } from "../../utils/activity";
import { formatRelativeTime } from "../../utils/sos";

// Maps an activity feed item's `kind` (see utils/activity.js) to the status
// word HistoryCard uses to pick its icon ("completed"/"pending", anything
// else falls back to a warning icon).
const KIND_TO_STATUS = {
  "sos-resolved": "Completed",
  "sos-progress": "In Progress",
  "sos-critical": "Pending",
  "sos-new": "Pending",
  "shelter-warning": "Warning",
  "resource-warning": "Warning",
};

function toHistoryEntry(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.timestamp ? formatRelativeTime(item.timestamp) : "",
    status: KIND_TO_STATUS[item.kind] || "Pending",
  };
}

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [sosRequests, shelters, resources] = await Promise.all([
          listSOSRequests(),
          listShelters(),
          listResources(),
        ]);
        if (cancelled) return;
        setHistory(
          buildActivityFeed(sosRequests, shelters, resources)
            .slice(0, 20)
            .map(toHistoryEntry)
        );
      } catch {
        // Leave whatever was already loaded rather than wiping the list
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

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Activity History
          </h1>

          <p className="mt-2 text-secondary">
            Review recent requests, missions and activity across ResQGrid.
          </p>

        </div>

        {/* Timeline */}

        <div className="space-y-5">

          {history.length > 0 ? (
            history.map((item) => (

              <HistoryCard
                key={item.id}
                {...item}
              />

            ))
          ) : (
            <div className="card-glass rounded-2xl p-10 text-center">

              <h3 className="text-xl font-semibold text-primary">
                No Activity Yet
              </h3>

              <p className="mt-2 text-secondary">
                Recent requests and missions will show up here.
              </p>

            </div>
          )}

        </div>

      </section>

    </DashboardLayout>
  );
}
