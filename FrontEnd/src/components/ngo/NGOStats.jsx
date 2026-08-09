import {
  Users,
  TriangleAlert,
  Tent,
  PackageCheck,
} from "lucide-react";

export default function NGOStats({ values }) {
  const stats = [
    {
      title: "Active Volunteers",
      value: values.activeVolunteers,
      icon: Users,
      color: "text-brand",
    },
    {
      title: "Active SOS Requests",
      value: values.activeSOS,
      icon: TriangleAlert,
      color: "text-danger",
    },
    {
      title: "Relief Camps",
      value: values.reliefCamps,
      icon: Tent,
      color: "text-warning",
    },
    {
      // The backend has no "delivered" concept -- Resource only tracks
      // current on-hand quantity, not a cumulative shipped count -- so
      // this shows total stock on hand instead, labeled accordingly.
      title: "Resources On Hand",
      value: values.resourcesOnHand.toLocaleString(),
      icon: PackageCheck,
      color: "text-success",
    },
  ];

  return (
    <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card">

              <Icon
                size={28}
                className={stat.color}
              />

            </div>

            <h2 className="mt-6 text-4xl font-bold text-primary">
              {stat.value}
            </h2>

            <p className="mt-2 text-secondary">
              {stat.title}
            </p>

          </div>
        );
      })}

    </section>
  );
}