import {
  Hospital,
  Tent,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

const resources = [
  {
    icon: Hospital,
    title: "Nearest Hospital",
    distance: "1.8 km",
    color: "text-emerald-300",
  },
  {
    icon: Tent,
    title: "Relief Camp",
    distance: "2.4 km",
    color: "text-amber-300",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Distribution",
    distance: "3.1 km",
    color: "text-sky-300",
  },
];

export default function QuickieHelpCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Nearby Assistance
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Help Around You
          </h2>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <div
              key={resource.title}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-sky-300/30 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Icon
                    size={24}
                    className={resource.color}
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {resource.distance} away
                  </p>

                </div>

              </div>

              <ArrowRight
                size={20}
                className="text-slate-400"
              />

            </div>
          );
        })}

      </div>

    </section>
  );
}