import {
  UserRound,
  Phone,
  MapPin,
  BadgeCheck,
} from "lucide-react";

const volunteers = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Medical Volunteer",
    location: "Navi Mumbai",
    phone: "+91 98765 43210",
    status: "Available",
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Search & Rescue",
    location: "Panvel",
    phone: "+91 99887 65432",
    status: "Assigned",
  },
  {
    id: 3,
    name: "Arjun Patel",
    role: "Logistics",
    location: "Vashi",
    phone: "+91 97654 32109",
    status: "Available",
  },
];

export default function VolunteerManagement() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
          Volunteer Management
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          Active Volunteer Teams
        </h2>

      </div>

      <div className="space-y-5">

        {volunteers.map((volunteer) => (

          <div
            key={volunteer.id}
            className="card-glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card">

                  <UserRound
                    size={34}
                    className="text-brand"
                  />

                </div>

                <div>

                  <h3 className="text-2xl font-semibold text-primary">
                    {volunteer.name}
                  </h3>

                  <p className="text-secondary">
                    {volunteer.role}
                  </p>

                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-3">

                <Info
                  icon={<MapPin size={18} className="text-danger" />}
                  label="Location"
                  value={volunteer.location}
                />

                <Info
                  icon={<Phone size={18} className="text-success" />}
                  label="Phone"
                  value={volunteer.phone}
                />

                <Info
                  icon={<BadgeCheck size={18} className="text-brand" />}
                  label="Status"
                  value={volunteer.status}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

function Info({ icon, label, value }) {
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