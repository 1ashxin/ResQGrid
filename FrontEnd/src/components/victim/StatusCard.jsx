import {
  Clock3,
  Search,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";

export default function StatusCard() {
  const { requestStatus } = useRequest();

  let title = "No Active Request";
  let subtitle = "You haven't submitted an emergency request yet.";
  let color = "text-muted";
  let bg = "bg-card";
  let Icon = Clock3;

  if (requestStatus === "searching") {
    title = "Searching for Responders";
    subtitle =
      "Nearby volunteers and organizations are being notified.";
    color = "text-warning";
    bg = "bg-card";
    Icon = Search;
  }

  if (requestStatus === "assigned") {
    title = "Volunteer Assigned";
    subtitle =
      "A nearby responder has accepted your request and is on the way.";
    color = "text-success";
    bg = "bg-card";
    Icon = UserCheck;
  }

  return (
    <section className="card-glass rounded-3xl p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="section-label text-sm">
            Request Status
          </p>

          <h2 className={`section-title mt-3 text-3xl ${color}`}>
            {title}
          </h2>

          <p className="section-subtitle mt-4 max-w-xl leading-7">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${bg}`}
        >
          <Icon
            size={38}
            className={color}
          />
        </div>

      </div>

      {requestStatus === "assigned" && (

        <div className="card-glass mt-8 rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={24}
              className="text-success"
            />

            <div>

              <h3 className="section-title text-lg">
                Help is on the way
              </h3>

              <p className="section-subtitle mt-1">
                Estimated arrival: 10–15 minutes
              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}