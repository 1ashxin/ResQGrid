import { Building2, BadgeCheck } from "lucide-react";

export default function NGOHeader() {
  return (
    <section>

      <p className="text-brand text-sm font-semibold uppercase tracking-[0.3em]">
        NGO Dashboard
      </p>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-5xl font-bold text-primary">
            Disaster Response Command Center
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-secondary">
            Coordinate volunteers, allocate resources, monitor active
            emergencies and manage disaster relief operations from one
            centralized platform.
          </p>

        </div>

        <div className="card-glass flex items-center gap-5 rounded-3xl px-6 py-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success">

            <Building2
              size={34}
              className="text-white"
            />

          </div>

          <div>

            <p className="text-sm text-secondary">
              Organization Status
            </p>

            <div className="mt-1 flex items-center gap-2">

              <BadgeCheck
                size={18}
                className="text-success"
              />

              <span className="text-xl font-bold text-primary">
                Verified
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}