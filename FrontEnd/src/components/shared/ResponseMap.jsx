import {
  MapPin,
  Hospital,
  Tent,
  Truck,
  UserRound,
} from "lucide-react";

export default function ResponseMap() {
  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="section-label text-sm">
            Live Response Map
          </p>

          <h2 className="section-title mt-2 text-3xl">
            Disaster Coordination
          </h2>

          <p className="section-subtitle mt-3 max-w-2xl">
            Track the victim, assigned volunteer and nearby emergency
            resources in real time.
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

        {/* Grid */}
        <div className="absolute inset-0 opacity-10">

          <div className="h-full w-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:45px_45px]" />

        </div>

        {/* Route */}
        <svg className="absolute inset-0 h-full w-full">

          <line
            x1="52%"
            y1="42%"
            x2="25%"
            y2="60%"
            stroke="#6EE7B7"
            strokeWidth="3"
            strokeDasharray="10 8"
            className="animate-pulse"
          />

        </svg>

        {/* Hospital */}
        <Marker
          icon={<Hospital size={22} />}
          color="bg-sky-500"
          label="Hospital"
          position="right-[15%] top-[18%]"
        />

        {/* Relief Camp */}
        <Marker
          icon={<Tent size={22} />}
          color="bg-yellow-500"
          label="Relief Camp"
          position="left-[18%] top-[20%]"
        />

        {/* Supply Vehicle */}
        <Marker
          icon={<Truck size={22} />}
          color="bg-violet-500"
          label="Supply"
          position="right-[28%] bottom-[18%]"
        />

        {/* Volunteer */}
        <div className="absolute left-[52%] top-[42%]">

          <div className="absolute inset-0 scale-[2.2] animate-ping rounded-full bg-green-500/30"></div>

          <Marker
            icon={<UserRound size={22} />}
            color="bg-green-500"
            label="Volunteer"
          />

        </div>

        {/* Victim */}
        <div className="absolute left-[25%] top-[60%]">

          <div className="absolute inset-0 scale-[2.4] animate-ping rounded-full bg-red-500/30"></div>

          <Marker
            icon={<MapPin size={22} />}
            color="bg-red-500"
            label="Victim"
          />

        </div>

      </div>

      {/* Status Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <InfoCard
          title="Victim"
          value="Emergency Active"
        />

        <InfoCard
          title="Volunteer"
          value="2.4 km Away"
        />

        <InfoCard
          title="ETA"
          value="11 Minutes"
        />

        <InfoCard
          title="Status"
          value="En Route"
        />

      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-5">

        <Legend color="bg-red-500" label="Victim" />

        <Legend color="bg-green-500" label="Volunteer" />

        <Legend color="bg-sky-500" label="Hospital" />

        <Legend color="bg-yellow-500" label="Relief Camp" />

        <Legend color="bg-violet-500" label="Supply Vehicle" />

      </div>

    </section>
  );
}

function Marker({ icon, color, label, position = "" }) {
  return (
    <div className={`absolute ${position}`}>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${color} text-white shadow-xl`}
      >
        {icon}
      </div>

      <div className="mt-2 rounded-full bg-black/40 px-3 py-1 text-center text-xs text-white backdrop-blur-md">
        {label}
      </div>

    </div>
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