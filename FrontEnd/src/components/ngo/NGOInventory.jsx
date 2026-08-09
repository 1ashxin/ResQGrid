import {
  Droplets,
  Package,
  Pill,
  Bed,
} from "lucide-react";

// Icons are a display-only concept -- the backend just stores a resource
// name, so this maps known names to an icon, falling back to a generic
// box for anything an NGO/admin adds that isn't in this list.
const RESOURCE_ICONS = {
  "Drinking Water": Droplets,
  "Food Packets": Package,
  "Medical Kits": Pill,
  "Emergency Tents": Bed,
};

const RESOURCE_COLORS = {
  Healthy: "text-success",
  Moderate: "text-warning",
  Low: "text-danger",
};

export default function NGOInventory({ resources }) {
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

        {resources.map((resource) => {
          const Icon = RESOURCE_ICONS[resource.item] || Package;
          const color = RESOURCE_COLORS[resource.status] || "text-brand";

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
                      className={color}
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