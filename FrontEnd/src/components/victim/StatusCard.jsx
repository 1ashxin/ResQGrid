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

export default function StatusCard() {
  const { requestStatus } = useRequest();

  let title = "No Active Request";
  let subtitle =
    "You haven't submitted an emergency request yet.";

  let color = "text-muted";
  let bg = "bg-card";
  let Icon = Clock3;

  let volunteerCount = 0;
  let ngoCount = 0;
  let priority = "—";
  let updated = "—";

  if (requestStatus === "searching") {
    title = "Searching for Responders";
    subtitle =
      "Nearby volunteers and partner organizations are being notified.";

    color = "text-warning";
    bg = "bg-card";
    Icon = Search;

    volunteerCount = 4;
    ngoCount = 2;
    priority = "High";
    updated = "Just Now";
  }

  if (requestStatus === "assigned") {
    title = "Responder Assigned";
    subtitle =
      "A verified volunteer has accepted your request and is on the way.";

    color = "text-success";
    bg = "bg-card";
    Icon = UserCheck;

    volunteerCount = 4;
    ngoCount = 2;
    priority = "High";
    updated = "30 Seconds Ago";
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
            label="Volunteers Notified"
            value={volunteerCount}
          />

          <InfoCard
            icon={<Building2 size={20} className="text-success" />}
            label="NGOs Notified"
            value={ngoCount}
          />

          <InfoCard
            icon={<ShieldAlert size={20} className="text-danger" />}
            label="Priority Level"
            value={priority}
          />

          <InfoCard
            icon={<Clock3 size={20} className="text-warning" />}
            label="Last Updated"
            value={updated}
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
                location. Estimated arrival time is 10–15 minutes.
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