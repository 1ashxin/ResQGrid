import {
  TriangleAlert,
  MapPin,
  Users,
  Clock3,
  ArrowRight,
} from "lucide-react";

export default function RequestCard({
  request,
  onAccept,
}) {
  function priorityClasses(priority) {
    switch (priority) {
      case "High":
        return "bg-danger text-white";
      case "Medium":
        return "bg-warning text-primary";
      default:
        return "bg-success text-white";
    }
  }

  return (
    <div className="card-glass rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3">

            <TriangleAlert
              size={28}
              className="text-danger"
            />

            <h2 className="text-2xl font-bold text-primary">
              {request.emergency}
            </h2>

          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <Info
              icon={<MapPin size={18} className="text-brand" />}
              title="Location"
              value={request.location}
            />

            <Info
              icon={<Users size={18} className="text-success" />}
              title="People"
              value={request.people}
            />

            <Info
              icon={<Clock3 size={18} className="text-warning" />}
              title="Reported"
              value={request.time}
            />

            <Info
              icon={<MapPin size={18} className="text-danger" />}
              title="Distance"
              value={request.distance}
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-col items-center gap-5">

          <div
            className={`rounded-full px-5 py-2 font-semibold ${priorityClasses(
              request.priority
            )}`}
          >
            {request.priority} Priority
          </div>

          <button
            onClick={() => onAccept(request)}
            className="btn-primary flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            Accept Request

            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}

function Info({ icon, title, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1">
        {icon}
      </div>

      <div>

        <p className="text-sm text-muted">
          {title}
        </p>

        <h3 className="mt-1 font-semibold text-primary">
          {value}
        </h3>

      </div>

    </div>
  );
}