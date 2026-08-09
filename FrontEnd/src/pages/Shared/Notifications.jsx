import { useState } from "react";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import NotificationCard from "../../components/notifications/NotificationCard";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New SOS Request",
      description: "Flood emergency reported in Sector 12.",
      time: "2 min ago",
      type: "danger",
      unread: true,
    },
    {
      id: 2,
      title: "Volunteer Assigned",
      description: "Rahul Sharma accepted Request #104.",
      time: "10 min ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "Inventory Updated",
      description: "Medical supplies restocked.",
      time: "35 min ago",
      type: "warning",
      unread: false,
    },
    {
      id: 4,
      title: "Camp Status",
      description: "Camp Alpha has reached 80% capacity.",
      time: "Yesterday",
      type: "info",
      unread: false,
    },
    {
      id: 5,
      title: "Weather Alert",
      description: "Heavy rainfall expected within the next 3 hours.",
      time: "Yesterday",
      type: "danger",
      unread: true,
    },
  ]);

  function markAllRead() {
    setNotifications(
      notifications.map((item) => ({
        ...item,
        unread: false,
      }))
    );
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

          {notifications.map((notification) => (

            <NotificationCard
              key={notification.id}
              {...notification}
            />

          ))}

        </div>

      </section>

    </DashboardLayout>
  );
}