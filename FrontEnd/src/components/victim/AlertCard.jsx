import { TriangleAlert } from "lucide-react";

export default function AlertCard() {
  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="card-glass flex h-14 w-14 items-center justify-center rounded-2xl">

          <TriangleAlert
            size={30}
            className="text-warning"
          />

        </div>

        <div>

          <p className="section-label text-warning text-sm">
            Emergency Alert
          </p>

          <h2 className="section-title mt-1 text-2xl">
            Heavy Rainfall Warning
          </h2>

        </div>

      </div>

      {/* Alert Content */}

      <p className="section-subtitle mt-6 leading-7">
        Continuous heavy rainfall has been reported in your area.
        Avoid flooded roads, stay indoors if possible and keep your
        phone charged for emergency communication.
      </p>

      {/* Last Updated */}

      <div className="card-glass mt-6 rounded-2xl p-4">

        <p className="text-secondary text-sm">

          <span className="section-title">
            Last Updated:
          </span>{" "}

          5 minutes ago

        </p>

      </div>

    </section>
  );
}