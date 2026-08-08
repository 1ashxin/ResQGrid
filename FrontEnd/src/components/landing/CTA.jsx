import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-12">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
          Get Started
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
          Ready to Make a Difference When Every Second Counts?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          Whether you're seeking urgent assistance or volunteering to help
          your community, ResQGrid brings everyone together through one
          coordinated emergency response platform.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">

          <Link
            to="/victim"
            className="flex items-center gap-2 rounded-2xl bg-[#FF6B6B] px-8 py-4 font-semibold transition duration-300 hover:scale-105 hover:bg-[#ff7b7b]"
          >
            Request Assistance
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/volunteer"
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition duration-300 hover:bg-white/10"
          >
            Join as a Volunteer
            <Users size={18} />
          </Link>

        </div>

      </div>

    </section>
  );
}