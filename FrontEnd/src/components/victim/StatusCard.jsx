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
  let color = "text-slate-300";
  let bg = "bg-slate-500/20";
  let Icon = Clock3;

  if (requestStatus === "searching") {
    title = "Searching for Responders";
    subtitle =
      "Nearby volunteers and organizations are being notified.";
    color = "text-yellow-300";
    bg = "bg-yellow-500/20";
    Icon = Search;
  }

  if (requestStatus === "assigned") {
    title = "Volunteer Assigned";
    subtitle =
      "A nearby responder has accepted your request and is on the way.";
    color = "text-emerald-300";
    bg = "bg-emerald-500/20";
    Icon = UserCheck;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            REQUEST STATUS
          </p>

          <h2 className={`mt-3 text-3xl font-bold ${color}`}>
            {title}
          </h2>

          <p className="mt-4 max-w-xl leading-7 text-slate-300">
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
        <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={24}
              className="text-emerald-300"
            />

            <div>

              <h3 className="font-semibold text-white">
                Help is on the way
              </h3>

              <p className="mt-1 text-slate-300">
                Estimated arrival: 10–15 minutes
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}