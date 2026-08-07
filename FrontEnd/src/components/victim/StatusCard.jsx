import {
  Clock3,
  CheckCircle2,
  LoaderCircle,
  MapPin,
} from "lucide-react";

export default function StatusCard({ active }) {
  if (!active) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Current Request
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              No Active Request
            </h2>

          </div>

          <div className="rounded-full bg-slate-500/20 px-4 py-2 text-sm font-semibold text-slate-300">
            Inactive
          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">

          <p className="text-slate-300">
            You currently have no emergency request.
            Press <span className="font-semibold text-white">Send Emergency Alert</span> if you require immediate assistance.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Current Request
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Searching for Volunteers
          </h2>

        </div>

        <div className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-300">
          Searching...
        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white/5 p-5">

          <LoaderCircle
            size={28}
            className="mb-3 animate-spin text-amber-300"
          />

          <p className="text-sm text-slate-400">
            Status
          </p>

          <h3 className="mt-2 text-xl font-semibold text-white">
            Finding Nearby Volunteers
          </h3>

        </div>

        <div className="rounded-2xl bg-white/5 p-5">

          <Clock3
            size={28}
            className="mb-3 text-sky-300"
          />

          <p className="text-sm text-slate-400">
            Request Time
          </p>

          <h3 className="mt-2 text-xl font-semibold text-white">
            Just Now
          </h3>

        </div>

        <div className="rounded-2xl bg-white/5 p-5">

          <MapPin
            size={28}
            className="mb-3 text-red-300"
          />

          <p className="text-sm text-slate-400">
            Location
          </p>

          <h3 className="mt-2 text-xl font-semibold text-white">
            Sharing Location
          </h3>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">

        <div className="flex items-center gap-3">

          <LoaderCircle
            size={20}
            className="animate-spin text-amber-300"
          />

          <p className="text-slate-200">
            Your request has been received. We are notifying nearby volunteers and emergency responders.
          </p>

        </div>

      </div>

    </section>
  );
}