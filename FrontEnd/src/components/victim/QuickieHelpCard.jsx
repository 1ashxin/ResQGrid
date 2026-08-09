import {
  Hospital,
  Tent,
  UtensilsCrossed,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const resources = [
  {
    icon: Hospital,
    name: "City General Hospital",
    type: "Emergency Medical Care",
    distance: "1.8 km",
    phone: "102",
    color: "text-success",
  },
  {
    icon: Tent,
    name: "Relief Camp Alpha",
    type: "Temporary Shelter",
    distance: "2.4 km",
    phone: "Available On Arrival",
    color: "text-warning",
  },
  {
    icon: UtensilsCrossed,
    name: "Community Food Centre",
    type: "Food & Drinking Water",
    distance: "3.1 km",
    phone: "1800-555-101",
    color: "text-brand",
  },
];

export default function QuickieHelpCard() {
  return (
    <section className="card-glass rounded-3xl p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
            Nearby Resources
          </p>

          <h2 className="mt-2 text-3xl font-bold text-primary">
            Assistance Around You
          </h2>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <div
              key={resource.name}
              className="bg-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

                    <Icon
                      size={26}
                      className={resource.color}
                    />

                  </div>

                  <div>

                    <h3 className="text-xl font-semibold text-primary">
                      {resource.name}
                    </h3>

                    <p className="mt-1 text-secondary">
                      {resource.type}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-5">

                      <div className="flex items-center gap-2">

                        <MapPin
                          size={16}
                          className="text-danger"
                        />

                        <span className="text-sm text-muted">
                          {resource.distance}
                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <Phone
                          size={16}
                          className="text-success"
                        />

                        <span className="text-sm text-muted">
                          {resource.phone}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                <ArrowRight
                  size={20}
                  className="text-brand"
                />

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}