import {
  Droplets,
  Package,
  Pill,
  Bed,
} from "lucide-react";

const inventory = [
  {
    item: "Water Kits",
    available: 520,
    status: "Healthy",
    icon: Droplets,
    color: "text-brand",
  },
  {
    item: "Food Packs",
    available: 240,
    status: "Moderate",
    icon: Package,
    color: "text-warning",
  },
  {
    item: "Medical Kits",
    available: 82,
    status: "Low",
    icon: Pill,
    color: "text-danger",
  },
  {
    item: "Emergency Shelters",
    available: 48,
    status: "Healthy",
    icon: Bed,
    color: "text-success",
  },
];

export default function NGOInventory() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
          Resource Inventory
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          Available Resources
        </h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {inventory.map((resource) => {
          const Icon = resource.icon;

          return (

            <div
              key={resource.item}
              className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card">

                    <Icon
                      size={28}
                      className={resource.color}
                    />

                  </div>

                  <div>

                    <h3 className="text-xl font-semibold text-primary">
                      {resource.item}
                    </h3>

                    <p className="text-secondary">
                      {resource.available} Available
                    </p>

                  </div>

                </div>

                <StatusBadge status={resource.status} />

              </div>

            </div>

          );
        })}

      </div>

    </section>
  );
}

function StatusBadge({ status }) {
  let classes = "bg-success text-white";

  if (status === "Moderate") {
    classes = "bg-warning text-primary";
  }

  if (status === "Low") {
    classes = "bg-danger text-white";
  }

  return (
    <div className={`rounded-full px-4 py-2 text-sm font-semibold ${classes}`}>
      {status}
    </div>
  );
}