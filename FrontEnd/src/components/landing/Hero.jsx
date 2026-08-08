import {
  ArrowRight,
  Users,
  Activity,
  HeartHandshake,
  Tent,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20">

      {/* Background Glow */}
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl"></div>

      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-red-400/10 blur-3xl"></div>

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

                <div className="h-3 w-3 rounded-full bg-success animate-pulse"></div>

                <span className="text-success text-sm font-semibold">
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

                <span className="text-danger text-xl font-bold">
                  84
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

                <span className="text-success text-xl font-bold">
                  412
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

                <span className="text-brand text-xl font-bold">
                  26
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}