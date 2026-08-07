import {
  CheckCircle2,
  LoaderCircle,
  Clock3,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";

export default function ActivityTimeline() {
  const { requestStatus } = useRequest();

  const events = [];

  if (requestStatus !== "idle") {
    events.push({
      title: "Emergency request submitted",
      done: true,
    });

    events.push({
      title: "Location shared with responders",
      done: true,
    });
  }

  if (requestStatus === "searching") {
    events.push({
      title: "Searching for nearby volunteers",
      loading: true,
    });
  }

  if (requestStatus === "assigned") {
    events.push({
      title: "Volunteer accepted your request",
      done: true,
    });

    events.push({
      title: "Responder is on the way",
      current: true,
    });
  }

  if (requestStatus === "idle") {
    return null;
  }

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
        Live Activity
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        Request Timeline
      </h2>

      <div className="mt-10 space-y-6">

        {events.map((event, index) => (

          <div
            key={index}
            className="flex gap-5"
          >

            <div className="flex flex-col items-center">

              {event.loading ? (

                <LoaderCircle
                  size={22}
                  className="animate-spin text-yellow-300"
                />

              ) : event.current ? (

                <Clock3
                  size={22}
                  className="text-sky-300"
                />

              ) : (

                <CheckCircle2
                  size={22}
                  className="text-emerald-300"
                />

              )}

              {index !== events.length - 1 && (
                <div className="mt-2 h-10 w-px bg-white/20"></div>
              )}

            </div>

            <div>

              <p className="font-semibold text-white">
                {event.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}