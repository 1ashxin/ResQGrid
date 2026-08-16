import {
  Clock3,
  Search,
  UserCheck,
  CheckCircle2,
  Users,
  Building2,
  ShieldAlert,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";

// The counts, priority and timestamp below are all passed in from
// VictimDashboard, which reads them from the backend -- they used to be
// fixed numbers that showed "4 volunteers / 2 NGOs / High" no matter what
// was actually happening.
export default function StatusCard({
  priority = null,
  volunteerCount = 0,
  ngoCount = 0,
  updated = null,
}) {
  const { requestStatus } = useRequest();

  let title = "No Active Request";
  let subtitle =
    "You haven't submitted an emergency request yet.";

  let color = "text-muted";
  let bg = "bg-card";
  let Icon = Clock3;

  if (requestStatus === "searching") {
    title = "Searching for Responders";
    subtitle =
      "Nearby volunteers and partner organizations are being notified.";

    color = "text-warning";
    Icon = Search;
  }

  if (requestStatus === "assigned") {
    title = "Responder Assigned";
    subtitle =
      "A verified volunteer has accepted your request and is on the way.";

    color = "text-success";
    Icon = UserCheck;
  }

  if (requestStatus === "resolved") {
    title = "Request Resolved";
    subtitle =
      "Your emergency request has been marked as resolved by the responder.";

    color = "text-success";
    Icon = CheckCircle2;
  }

  return (
    <section className="card-glass rounded-3xl p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
            Current Status
          </p>

          <h2 className={`mt-3 text-3xl font-bold ${color}`}>
            {title}
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-secondary">
            {subtitle}
          </p>

        </div>

        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${bg}`}>

          <Icon
            size={38}
            className={color}
          />

        </div>

      </div>

      {requestStatus !== "idle" && (

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <InfoCard
            icon={<Users size={20} className="text-brand" />}
            label="Volunteers Available"
            value={volunteerCount}
          />

          <InfoCard
            icon={<Building2 size={20} className="text-success" />}
            label="Partner NGOs"
            value={ngoCount}
          />

          <InfoCard
            icon={<ShieldAlert size={20} className="text-danger" />}
            label="Priority Level"
            value={priority || "Assessing..."}
          />

          <InfoCard
            icon={<Clock3 size={20} className="text-warning" />}
            label="Last Updated"
            value={updated || "—"}
          />

        </div>

      )}

      {requestStatus === "assigned" && (

        <div className="mt-8 rounded-2xl border border-success bg-success/10 p-6">

          <div className="flex items-center gap-4">

            <CheckCircle2
              size={28}
              className="text-success"
            />

            <div>

              <h3 className="text-xl font-semibold text-primary">
                Help Is On The Way
              </h3>

              <p className="mt-1 text-secondary">
                Your assigned responder is travelling towards your
                location. Their live distance is shown below.
              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-card rounded-2xl p-5">

      <div className="flex items-center gap-3">

        {icon}

        <div>

          <p className="text-sm text-muted">
            {label}
          </p>

          <h3 className="mt-1 text-xl font-semibold text-primary">
            {value}
          </h3>

        </div>

      </div>

    </div>
  );
}