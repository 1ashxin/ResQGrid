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
    <section className="card-glass mt-8 rounded-3xl p-8">

      <p className="section-label text-sm">
        Live Activity
      </p>

      <h2 className="section-title mt-3 text-3xl">
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
                  className="animate-spin text-warning"
                />

              ) : event.current ? (

                <Clock3
                  size={22}
                  className="text-brand"
                />

              ) : (

                <CheckCircle2
                  size={22}
                  className="text-success"
                />

              )}

              {index !== events.length - 1 && (
                <div className="mt-2 h-10 w-px border-glass"></div>
              )}

            </div>

            <div>

              <p className="section-title text-lg">
                {event.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}