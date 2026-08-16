import LiveMap from "./LiveMap";

// The "Live Response Map" section shown on the Volunteer and Victim
// dashboards. This is the same real Leaflet map the admin dashboard uses
// (LiveMap) wrapped in the dashboard's section styling -- it replaces an
// earlier hand-drawn placeholder that positioned icons at fixed CSS
// percentages and showed invented distances/ETAs.
//
// Every data prop is optional so a dashboard only lights up the layers it
// actually has; the summary cards below the map are derived from that same
// data rather than hardcoded.
export default function ResponseMap({
  title = "Disaster Coordination",
  subtitle = "Track live emergencies, responders and nearby shelters in real time.",
  sosRequests = [],
  volunteers = [],
  shelters = [],
  myPosition = null,
  myLabel = "You are here",
  summary = [],
}) {
  const hasAnything =
    sosRequests.length > 0 ||
    volunteers.length > 0 ||
    shelters.length > 0 ||
    myPosition != null;

  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="section-label text-sm">
            Live Response Map
          </p>

          <h2 className="section-title mt-2 text-3xl">
            {title}
          </h2>

          <p className="section-subtitle mt-3 max-w-2xl">
            {subtitle}
          </p>

        </div>

        <div className="card-glass flex items-center gap-2 rounded-full px-5 py-2">

          <span className="h-3 w-3 animate-pulse rounded-full bg-success"></span>

          <span className="font-semibold text-success">
            LIVE
          </span>

        </div>

      </div>

      {/* Map */}
      <div className="relative mt-8 h-[520px] overflow-hidden rounded-3xl bg-secondary">

        {hasAnything ? (
          <LiveMap
            sosRequests={sosRequests}
            volunteers={volunteers}
            shelters={shelters}
            myPosition={myPosition}
            myLabel={myLabel}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-secondary">
            Waiting for live location data...
          </div>
        )}

      </div>

      {/* Summary */}
      {summary.length > 0 && (

        <div className="mt-8 grid gap-5 md:grid-cols-4">

          {summary.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              value={card.value}
            />
          ))}

        </div>

      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-5">

        <Legend color="bg-red-500" label="SOS Request" />

        <Legend color="bg-green-500" label="Volunteer" />

        <Legend color="bg-yellow-400" label="Shelter" />

        {myPosition && <Legend color="bg-sky-400" label={myLabel} />}

      </div>

    </section>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">

      <div className={`h-4 w-4 rounded-full ${color}`}></div>

      <span className="text-secondary text-sm">
        {label}
      </span>

    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="card-glass rounded-2xl p-5">

      <p className="text-muted text-sm">
        {title}
      </p>

      <h3 className="section-title mt-2 text-lg">
        {value}
      </h3>

    </div>
  );
}
