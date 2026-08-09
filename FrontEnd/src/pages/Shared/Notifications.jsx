import { useEffect, useState } from "react";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import NotificationCard from "../../components/notifications/NotificationCard";
import { listSOSRequests, listShelters, listResources } from "../../api/client";
import { buildActivityFeed } from "../../utils/activity";
import { formatRelativeTime, parseUtcTimestamp } from "../../utils/sos";

// Same severity buckets NotificationCard already knows how to render
// (danger/success/warning/default) -- everything else falls to "info".
const KIND_TO_CARD_TYPE = {
  "sos-critical": "danger",
  "sos-resolved": "success",
  "shelter-warning": "warning",
  "resource-warning": "warning",
};

// A "new" event is shown as unread until it's more than 30 minutes old --
// there's no backend read-tracking yet, so this is the closest approximation
// to "recent" without persisting per-user read state.
const UNREAD_WINDOW_MS = 30 * 60 * 1000;

function toCardNotification(item) {
  const ageMs = item.timestamp ? Date.now() - parseUtcTimestamp(item.timestamp).getTime() : Infinity;
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    time: item.timestamp ? formatRelativeTime(item.timestamp) : "",
    type: KIND_TO_CARD_TYPE[item.kind] || "info",
    unread: ageMs < UNREAD_WINDOW_MS,
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

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
        setNotifications(
          buildActivityFeed(sosRequests, shelters, resources)
            .slice(0, 20)
            .map(toCardNotification)
        );
      } catch {
        // Leave whatever was already loaded on screen rather than clearing
        // it out on a transient failed refresh.
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  }

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-primary">
              Notifications
            </h1>

            <p className="mt-2 text-secondary">
              Stay updated with the latest activity across ResQGrid.
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl bg-card px-5 py-3 font-medium text-secondary transition hover:bg-brand hover:text-white"
            >
              <ArrowLeft size={18} />
              Home
            </Link>

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>

          </div>

        </div>

        {/* Notifications */}

        <div className="space-y-5">

          {notifications.length > 0 ? (
            notifications.map((notification) => (

              <NotificationCard
                key={notification.id}
                {...notification}
              />

            ))
          ) : (
            <div className="card-glass rounded-2xl p-10 text-center">

              <h3 className="text-xl font-semibold text-primary">
                No Notifications
              </h3>

              <p className="mt-2 text-secondary">
                You're all caught up -- nothing needs your attention right now.
              </p>

            </div>
          )}

        </div>

      </section>

    </DashboardLayout>
  );
}
