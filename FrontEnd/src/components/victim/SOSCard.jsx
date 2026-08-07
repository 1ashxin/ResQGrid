import {
  Siren,
  ArrowRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

export default function SOSCard({ status, onSend }) {
  const isIdle = status === "idle";
  const isSearching = status === "searching";
  const isAssigned = status === "assigned";

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
            Send an SOS Request
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-slate-300">
            Notify nearby volunteers, NGOs, hospitals and emergency
            responders with a single tap. Your request will be
            prioritized and routed to the nearest available teams.
          </p>

        </div>

      </div>

      {isIdle && (
        <button
          onClick={onSend}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6B6B] py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#ff7b7b]"
        >
          Send Emergency Alert
          <ArrowRight size={20} />
        </button>
      )}

      {isSearching && (
        <button
          disabled
          className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-white"
        >
          <LoaderCircle
            size={22}
            className="animate-spin"
          />
          Sending SOS Request...
        </button>
      )}

      {isAssigned && (
        <button
          disabled
          className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
        >
          <CheckCircle2 size={22} />
          SOS Request Accepted
        </button>
      )}

      <p className="mt-4 text-center text-sm text-slate-400">
        Use this only if you require immediate emergency assistance.
      </p>

    </section>
  );
}