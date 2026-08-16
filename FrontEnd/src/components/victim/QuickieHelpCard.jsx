import {
  Tent,
  MapPin,
  Users,
} from "lucide-react";

// Lists the shelters genuinely closest to the victim, with distances
// measured from their reported coordinates. This previously showed three
// invented places ("City General Hospital, 1.8 km", etc.) that existed
// nowhere in the system and never changed.
export default function QuickieHelpCard({ shelters = [] }) {
  return (
    <section className="card-glass rounded-3xl p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
            Nearby Resources
          </p>

          <h2 className="mt-2 text-3xl font-bold text-primary">
            Assistance Around You
          </h2>

        </div>

      </div>

      {shelters.length === 0 ? (

        <p className="section-subtitle mt-8">
          Nearby shelters will appear here once your location has been
          shared with responders.
        </p>

      ) : (

        <div className="mt-8 space-y-5">

          {shelters.map((shelter) => (

            <div
              key={shelter.name}
              className="bg-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="flex gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">

                  <Tent
                    size={26}
                    className="text-warning"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-semibold text-primary">
                    {shelter.name}
                  </h3>

                  <p className="mt-1 text-secondary">
                    {shelter.location}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-5">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={16}
                        className="text-danger"
                      />

                      <span className="text-sm text-muted">
                        {shelter.distanceKm != null
                          ? `${shelter.distanceKm.toFixed(1)} km away`
                          : "Distance unknown"}
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <Users
                        size={16}
                        className="text-success"
                      />

                      <span className="text-sm text-muted">
                        {Math.max(0, shelter.capacity - shelter.occupied)} of{" "}
                        {shelter.capacity} spaces free
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}
