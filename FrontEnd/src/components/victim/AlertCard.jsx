import { TriangleAlert } from "lucide-react";

export default function AlertCard() {
  return (
    <section className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-8 backdrop-blur-xl">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
          <TriangleAlert
            size={30}
            className="text-amber-300"
          />
        </div>

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Emergency Alert
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Heavy Rainfall Warning
          </h2>

        </div>

      </div>

      <p className="mt-6 leading-7 text-slate-300">
        Continuous heavy rainfall has been reported in your area.
        Avoid flooded roads, stay indoors if possible and keep your
        phone charged for emergency communication.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">

        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            Last Updated:
          </span>{" "}
          5 minutes ago
        </p>

      </div>

    </section>
  );
}