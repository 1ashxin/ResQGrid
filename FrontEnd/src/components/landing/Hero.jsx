import { ArrowRight, Users, Activity, HeartHandshake, Tent } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-32 pt-36 lg:px-12 lg:pt-44">

      {/* Background Glow */}
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-red-400/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          <div className="inline-flex items-center rounded-full border border-sky-300/20 bg-white/5 px-4 py-2 text-sm font-medium text-sky-200 backdrop-blur-sm">
            Intelligent Disaster Relief Coordination
          </div>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-7xl">
            From{" "}
            <span className="text-sky-300">Chaos</span>
            <br />
            to{" "}
            <span className="text-[#FF7C7C]">Coordination.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-200">
            ResQGrid connects victims, volunteers, NGOs, and emergency
            responders through one intelligent platform, ensuring help reaches
            the right people faster when every second matters.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              to="/victim"
              className="flex items-center gap-2 rounded-2xl bg-[#FF7C7C] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#ff9191]"
            >
              Request Assistance
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/volunteer"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              Become a Volunteer
              <Users size={18} />
            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center lg:justify-end">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Live Response
              </h2>

              <div className="flex items-center gap-2">

                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>

                <span className="text-sm font-semibold text-green-400">
                  Operational
                </span>

              </div>

            </div>

            <p className="mt-2 text-slate-300">
              Current platform overview
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

                <div className="flex items-center gap-3">

                  <Activity className="text-green-400" size={22} />

                  <span className="text-slate-200">
                    Active Requests
                  </span>

                </div>

                <span className="text-xl font-bold text-red-300">
                  84
                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

                <div className="flex items-center gap-3">

                  <HeartHandshake className="text-sky-300" size={22} />

                  <span className="text-slate-200">
                    Volunteers Online
                  </span>

                </div>

                <span className="text-xl font-bold text-green-400">
                  412
                </span>

              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

                <div className="flex items-center gap-3">

                  <Tent className="text-yellow-300" size={22} />

                  <span className="text-slate-200">
                    Relief Camps
                  </span>

                </div>

                <span className="text-xl font-bold text-sky-300">
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