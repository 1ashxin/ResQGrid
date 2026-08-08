import { ShieldCheck } from "lucide-react";

export default function VolunteerHeader() {
  return (
    <section className="mb-12">

      <p className="section-label text-sm">
        Volunteer Dashboard
      </p>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="section-title text-5xl">
            Emergency Response Center
          </h1>

          <p className="section-subtitle mt-4 max-w-3xl text-lg leading-8">
            Review nearby emergency requests, coordinate with victims,
            and provide rapid disaster assistance through ResQGrid.
          </p>

        </div>

        <div className="card-glass flex items-center gap-4 rounded-3xl px-6 py-5">

          <ShieldCheck
            size={36}
            className="text-success"
          />

          <div>

            <p className="text-muted text-sm">
              Volunteer Status
            </p>

            <h3 className="section-title text-xl text-success">
              Available
            </h3>

          </div>

        </div>

      </div>

    </section>
  );
}