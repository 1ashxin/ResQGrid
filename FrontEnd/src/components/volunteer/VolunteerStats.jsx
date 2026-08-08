import {
  TriangleAlert,
  Users,
  CheckCircle2,
  Timer,
} from "lucide-react";

const stats = [
  {
    title: "Nearby Requests",
    value: "08",
    icon: TriangleAlert,
    color: "text-danger",
  },
  {
    title: "Volunteers Online",
    value: "124",
    icon: Users,
    color: "text-brand",
  },
  {
    title: "Completed Today",
    value: "37",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    title: "Average Response",
    value: "4 min",
    icon: Timer,
    color: "text-warning",
  },
];

export default function VolunteerStats() {
  return (
    <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >

            <div className="card-glass flex h-14 w-14 items-center justify-center rounded-2xl">

              <Icon
                size={28}
                className={stat.color}
              />

            </div>

            <h3 className="section-title mt-6 text-4xl">
              {stat.value}
            </h3>

            <p className="section-subtitle mt-2">
              {stat.title}
            </p>

          </div>
        );
      })}

    </section>
  );
}