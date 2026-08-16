import {
  Clock3,
  Target,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

// Every figure here is computed from live backend data by NGODashboard.
// These were previously fixed marketing numbers ("4 min", "96%", "18 Zones",
// "24") that never moved regardless of what the system was doing.
export default function NGOAnalytics({
  avgResponse = "N/A",
  resolutionRate = "N/A",
  activeCamps = 0,
  availableVolunteers = 0,
}) {
  const analytics = [
    {
      title: "Average Response Time",
      value: avgResponse,
      icon: Clock3,
      color: "text-brand",
    },
    {
      title: "Requests Resolved",
      value: resolutionRate,
      icon: Target,
      color: "text-success",
    },
    {
      title: "Active Relief Camps",
      value: activeCamps,
      icon: TrendingUp,
      color: "text-warning",
    },
    {
      title: "Volunteers Available",
      value: availableVolunteers,
      icon: ShieldCheck,
      color: "text-brand",
    },
  ];

  return (
    <section className="mt-12">

      <div className="mb-8">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
          Operations Analytics
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          Performance Overview
        </h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {analytics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card">

                <Icon
                  size={28}
                  className={item.color}
                />

              </div>

              <h3 className="mt-6 text-4xl font-bold text-primary">
                {item.value}
              </h3>

              <p className="mt-2 text-secondary">
                {item.title}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}