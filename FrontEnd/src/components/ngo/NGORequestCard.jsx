import {
  TriangleAlert,
  MapPin,
  Users,
  Clock3,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function NGORequestCard({ requests }) {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
          Incoming Requests
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          Emergency Coordination
        </h2>

      </div>

      {requests.length === 0 && (
        <p className="card-glass rounded-3xl p-8 text-center text-secondary">
          No active emergency requests right now.
        </p>
      )}

      <div className="space-y-6">

        {requests.map((request) => (

          <div
            key={request.id}
            className="card-glass rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
          >

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <TriangleAlert
                    size={28}
                    className="text-danger"
                  />

                  <h2 className="text-3xl font-bold text-primary">
                    {request.emergency}
                  </h2>

                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <InfoRow
                    icon={<MapPin size={18} className="text-brand" />}
                    label="Location"
                    value={request.location}
                  />

                  <InfoRow
                    icon={<Users size={18} className="text-success" />}
                    label="People Affected"
                    value={request.people}
                  />

                  <InfoRow
                    icon={<Clock3 size={18} className="text-warning" />}
                    label="Reported"
                    value={request.reported}
                  />

                  <InfoRow
                    icon={<Shield size={18} className="text-brand" />}
                    label="Assigned Team"
                    value={request.team}
                  />

                </div>

              </div>

              <div className="flex flex-col items-center gap-5">

                <div
                  className={`rounded-full px-5 py-2 font-semibold ${
                    request.priority === "High"
                      ? "bg-danger text-white"
                      : "bg-warning text-primary"
                  }`}
                >
                  {request.priority} Priority
                </div>

                <button className="btn-primary flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1">

                  Assign Team

                  <ArrowRight size={18} />

                </button>

              </div>

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

        <p className="mt-1 font-semibold text-primary">
          {value}
        </p>

      </div>

    </div>
  );
}