import {
  Tent,
  MapPin,
  Users,
  ShieldCheck,
} from "lucide-react";

const camps = [
  {
    id: 1,
    name: "Camp Alpha",
    location: "Nerul",
    people: 126,
    services: "Medical • Food • Shelter",
    status: "Operational",
  },
  {
    id: 2,
    name: "Camp Bravo",
    location: "Panvel",
    people: 83,
    services: "Food • Water",
    status: "Operational",
  },
  {
    id: 3,
    name: "Camp Charlie",
    location: "Vashi",
    people: 57,
    services: "Medical • Shelter",
    status: "Limited Capacity",
  },
];

export default function ReliefCampCard() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
          Relief Operations
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          Active Relief Camps
        </h2>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {camps.map((camp) => (

          <div
            key={camp.id}
            className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card">

                <Tent
                  size={28}
                  className="text-warning"
                />

              </div>

              <StatusBadge status={camp.status} />

            </div>

            <h3 className="mt-6 text-2xl font-bold text-primary">
              {camp.name}
            </h3>

            <div className="mt-6 space-y-4">

              <InfoRow
                icon={<MapPin size={18} className="text-brand" />}
                label="Location"
                value={camp.location}
              />

              <InfoRow
                icon={<Users size={18} className="text-success" />}
                label="People Sheltered"
                value={camp.people}
              />

              <InfoRow
                icon={<ShieldCheck size={18} className="text-warning" />}
                label="Services"
                value={camp.services}
              />

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1">
        {icon}
      </div>

      <div>

        <p className="text-sm text-muted">
          {label}
        </p>

        <p className="font-semibold text-primary">
          {value}
        </p>

      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const classes =
    status === "Operational"
      ? "bg-success text-white"
      : "bg-warning text-primary";

  return (
    <div className={`rounded-full px-4 py-2 text-sm font-semibold ${classes}`}>
      {status}
    </div>
  );
}