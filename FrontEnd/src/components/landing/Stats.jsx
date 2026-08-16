import { useState, useEffect } from "react";

import {
  Users,
  Siren,
  Tent,
  Clock3,
} from "lucide-react";

import { listSOSRequests, listVolunteers, listShelters } from "../../api/client";

// These four figures are read from the live system rather than written by
// hand -- the landing page used to advertise "412+ volunteers / 84 requests
// / 26 camps / < 5 min", none of which had any relationship to what the
// platform actually held.
//
// If the backend can't be reached the cards fall back to "--" instead of
// inventing numbers, since this is the public-facing page.
export default function Stats() {
  const [values, setValues] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [sos, volunteers, shelters] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
          listShelters(),
        ]);
        if (cancelled) return;

        const resolved = sos.filter((r) => r.status === "resolved");
        const avgMinutes =
          resolved.length > 0
            ? Math.round(
                resolved.reduce(
                  (sum, r) =>
                    sum + (new Date(r.updated_at) - new Date(r.created_at)) / 60000,
                  0
                ) / resolved.length
              )
            : null;

        setValues({
          volunteers: volunteers.length,
          requests: sos.length,
          camps: shelters.filter((s) => s.is_active).length,
          avgResponse: avgMinutes != null ? `${avgMinutes} min` : "N/A",
        });
      } catch {
        if (!cancelled) setValues(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      icon: Users,
      value: values ? values.volunteers : "--",
      label: "Registered Volunteers",
      color: "text-sky-300",
    },
    {
      icon: Siren,
      value: values ? values.requests : "--",
      label: "Emergency Requests",
      color: "text-red-300",
    },
    {
      icon: Tent,
      value: values ? values.camps : "--",
      label: "Relief Camps",
      color: "text-amber-300",
    },
    {
      icon: Clock3,
      value: values ? values.avgResponse : "--",
      label: "Average Response Time",
      color: "text-emerald-300",
    },
  ];

  return (
    <section
      id="stats"
      className="px-6 py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Impact At A Glance
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Built for Fast, Reliable Emergency Response
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Every request, every volunteer, and every resource is tracked
            in real time to help communities respond more efficiently when
            every second counts.
          </p>

        </div>

        {/* Stats */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-300/30 hover:bg-white/10"
              >

                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ${stat.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-5xl font-bold text-white">
                  {stat.value}
                </h3>

                <p className="mt-4 text-slate-300">
                  {stat.label}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
