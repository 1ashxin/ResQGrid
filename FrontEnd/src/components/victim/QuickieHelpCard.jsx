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
    color: "text-success",
  },
  {
    icon: Tent,
    title: "Relief Camp",
    distance: "2.4 km",
    color: "text-warning",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Distribution",
    distance: "3.1 km",
    color: "text-brand",
  },
];

export default function QuickieHelpCard() {
  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="section-label text-sm">
            Nearby Assistance
          </p>

          <h2 className="section-title mt-2 text-3xl">
            Help Around You
          </h2>

        </div>

      </div>

      {/* Resources */}

      <div className="mt-8 space-y-4">

        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <div
              key={resource.title}
              className="card-glass flex items-center justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="flex items-center gap-4">

                <div className="card-glass flex h-12 w-12 items-center justify-center rounded-xl">

                  <Icon
                    size={24}
                    className={resource.color}
                  />

                </div>

                <div>

                  <h3 className="section-title text-lg">
                    {resource.title}
                  </h3>

                  <p className="text-muted text-sm">
                    {resource.distance} away
                  </p>

                </div>

              </div>

              <ArrowRight
                size={20}
                className="text-muted transition-transform duration-300 group-hover:translate-x-1"
              />

            </div>
          );
        })}

      </div>

    </section>
  );
}