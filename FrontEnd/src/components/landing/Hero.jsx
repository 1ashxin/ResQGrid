import { useState, useEffect } from "react";
import {
  ArrowRight,
  Users,
  Activity,
  HeartHandshake,
  Tent,
} from "lucide-react";
import { Link } from "react-router-dom";

import { listSOSRequests, listVolunteers, listShelters } from "../../api/client";

export default function Hero() {
  // The "Live Response" panel is exactly what it claims to be -- these three
  // counts come from the backend. They used to be fixed numbers (84 / 412 /
  // 26) that stayed put no matter what the platform actually held.
  const [live, setLive] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [sos, volunteers, shelters] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
          listShelters(),
        ]);
        if (cancelled) return;
        setLive({
          activeRequests: sos.filter((r) => r.status !== "resolved").length,
          volunteersOnline: volunteers.filter((v) => v.is_available).length,
          reliefCamps: shelters.filter((s) => s.is_active).length,
        });
      } catch {
        if (!cancelled) setLive(null);
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const show = (value) => (live ? value : "--");

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-36">

      {/* Background Glow */}
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-red-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          <div className="card-glass inline-flex items-center rounded-full px-4 py-2">
            <span className="section-label text-sm">
              Intelligent Disaster Relief Coordination
            </span>
          </div>

          <h1 className="section-title mt-8 text-6xl leading-tight lg:text-7xl">
            From{" "}
            <span className="text-brand">
              Chaos
            </span>

            <br />

            to{" "}
            <span className="text-danger">
              Coordination.
            </span>
          </h1>

          <p className="section-subtitle mt-8 max-w-xl text-lg leading-8">
            ResQGrid connects victims, volunteers, NGOs and emergency
            responders through one intelligent platform, ensuring help
            reaches the right people faster when every second matters.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/victim"
              className="btn-danger flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Request Assistance
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/volunteer"
              className="card-glass flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold text-primary transition-all duration-300 hover:-translate-y-1"
            >
              Become a Volunteer
              <Users size={18} />
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex justify-center lg:justify-end">

          <div className="card-glass w-full max-w-md rounded-3xl p-8 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="section-title text-2xl">
                Live Response
              </h2>

              <div className="flex items-center gap-2">

                <div className="h-3 w-3 animate-pulse rounded-full bg-success" />

                <span className="text-sm font-semibold text-success">
                  Operational
                </span>

              </div>

            </div>

            <p className="section-subtitle mt-2">
              Current platform overview
            </p>

            <div className="mt-8 space-y-5">

              <div className="card-glass flex items-center justify-between rounded-2xl p-4">

                <div className="flex items-center gap-3">

                  <Activity
                    className="text-success"
                    size={22}
                  />

                  <span className="text-secondary">
                    Active Requests
                  </span>

                </div>

                <span className="text-xl font-bold text-danger">
                  {show(live?.activeRequests)}
                </span>

              </div>

              <div className="card-glass flex items-center justify-between rounded-2xl p-4">

                <div className="flex items-center gap-3">

                  <HeartHandshake
                    className="text-brand"
                    size={22}
                  />

                  <span className="text-secondary">
                    Volunteers Online
                  </span>

                </div>

                <span className="text-xl font-bold text-success">
                  {show(live?.volunteersOnline)}
                </span>

              </div>

              <div className="card-glass flex items-center justify-between rounded-2xl p-4">

                <div className="flex items-center gap-3">

                  <Tent
                    className="text-warning"
                    size={22}
                  />

                  <span className="text-secondary">
                    Relief Camps
                  </span>

                </div>

                <span className="text-xl font-bold text-brand">
                  {show(live?.reliefCamps)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}