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
    color: "text-red-300",
    bg: "bg-red-500/10",
  },
  {
    title: "Volunteers Online",
    value: "124",
    icon: Users,
    color: "text-sky-300",
    bg: "bg-sky-500/10",
  },
  {
    title: "Completed Today",
    value: "37",
    icon: CheckCircle2,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Average Response",
    value: "4 min",
    icon: Timer,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
  },
];

export default function VolunteerStats() {
  return (
    <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
          >

            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}>

              <Icon
                size={28}
                className={stat.color}
              />

            </div>

            <h3 className="mt-6 text-4xl font-bold text-white">
              {stat.value}
            </h3>

            <p className="mt-2 text-slate-300">
              {stat.title}
            </p>

          </div>
        );
      })}

    </section>
  );
}