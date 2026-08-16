import {
  Phone,
  MapPin,
  UserRound,
  BadgeCheck,
} from "lucide-react";

// Shows the volunteer who actually accepted this request. Everything here
// comes from the backend volunteer profile passed in by VictimDashboard --
// this card used to display a fixed "Rahul Sharma, 4.9 rating, 2.4 km,
// 11 mins" regardless of who was really assigned.
//
// There is no ratings system and no routing/ETA service in the backend, so
// neither is shown: distance is straight-line (haversine) and labelled as
// such rather than dressed up as a driving ETA.
export default function ResponderCard({ volunteer, distanceKm = null }) {
  if (!volunteer) {
    return (
      <section className="card-glass rounded-3xl p-8">

        <p className="section-label text-success text-sm">
          Assigned Responder
        </p>

        <p className="section-subtitle mt-4">
          A responder has accepted your request. Their details will appear
          here as soon as their profile loads.
        </p>

      </section>
    );
  }

  return (
    <section className="card-glass rounded-3xl p-8">

      <p className="section-label text-success text-sm">
        Assigned Responder
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Volunteer Info */}

        <div className="flex items-center gap-5">

          <div className="card-glass flex h-20 w-20 items-center justify-center rounded-full">

            <UserRound
              size={40}
              className="text-success"
            />

          </div>

          <div>

            <h2 className="section-title text-3xl">
              {volunteer.full_name}
            </h2>

            {volunteer.skills && (
              <p className="section-subtitle mt-1">
                {volunteer.skills}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2">

              <BadgeCheck
                size={18}
                className="text-success"
              />

              <span className="text-secondary">
                Verified Volunteer
              </span>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="card-glass rounded-2xl p-5">

            <MapPin
              className="mb-2 text-danger"
            />

            <p className="text-muted text-sm">
              Distance Away
            </p>

            <h3 className="section-title mt-1">
              {distanceKm != null ? `${distanceKm.toFixed(1)} km` : "Locating..."}
            </h3>

          </div>

          <div className="card-glass rounded-2xl p-5">

            <Phone
              className="mb-2 text-brand"
            />

            <p className="text-muted text-sm">
              Contact
            </p>

            <h3 className="section-title mt-1">
              {volunteer.phone || "Not provided"}
            </h3>

          </div>

        </div>

      </div>

      {/* Action Button */}

      {volunteer.phone && (

        <div className="mt-8">

          <a
            href={`tel:${volunteer.phone}`}
            className="btn-success flex items-center justify-center gap-3 rounded-2xl py-4 font-semibold"
          >

            <Phone size={20} />

            Call Volunteer

          </a>

        </div>

      )}

    </section>
  );
}
