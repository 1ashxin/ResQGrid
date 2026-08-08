import { Siren, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SOSCard() {
  return (
    <section className="rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-500/15 to-red-600/10 p-8 backdrop-blur-xl">

      <div className="mb-6 inline-flex rounded-full border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm font-semibold tracking-wide text-red-200">
        EMERGENCY ASSISTANCE
      </div>

      <div className="flex items-start gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20">
          <Siren
            size={34}
            className="text-red-300"
          />
        </div>

        <div>

          <h2 className="text-3xl font-bold text-white">
            Need Immediate Help?
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-slate-300">
            Submit an emergency request with details about your situation.
            Nearby volunteers and relief organizations will be notified as
            soon as your request is received.
          </p>

        </div>

      </div>

      <Link
        to="/victim/request"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#ff7b7b]"
      >
        Request Assistance
        <ArrowRight size={20} />
      </Link>

      <p className="mt-4 text-center text-sm text-slate-400">
        Fill out a short emergency form before your request is dispatched.
      </p>

    </section>
  );
}