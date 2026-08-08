import { ShieldCheck } from "lucide-react";

export default function VolunteerHeader() {
  return (
    <section>

      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
        Volunteer Dashboard
      </p>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-5xl font-bold text-white">
            Emergency Response Center
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Review nearby emergency requests, coordinate with victims,
            and provide rapid disaster assistance through ResQGrid.
          </p>

        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-5">

          <ShieldCheck
            size={36}
            className="text-emerald-300"
          />

          <div>

            <p className="text-sm text-slate-300">
              Volunteer Status
            </p>

            <h3 className="text-xl font-bold text-white">
              Available
            </h3>

          </div>

        </div>

      </div>

    </section>
  );
}