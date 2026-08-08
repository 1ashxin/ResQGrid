import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Clock3,
  UserRound,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";

export default function ResponderCard() {
  const { requestStatus } = useRequest();

  if (requestStatus !== "assigned") return null;

  return (
    <section className="card-glass mt-8 rounded-3xl p-8">

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
              Rahul Sharma
            </h2>

            <p className="section-subtitle mt-1">
              Medical Volunteer
            </p>

            <div className="mt-3 flex items-center gap-2">

              <Star
                size={18}
                className="fill-yellow-400 text-warning"
              />

              <span className="text-secondary">
                4.9 Rating
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
              Distance
            </p>

            <h3 className="section-title mt-1">
              2.4 km
            </h3>

          </div>

          <div className="card-glass rounded-2xl p-5">

            <Clock3
              className="mb-2 text-brand"
            />

            <p className="text-muted text-sm">
              ETA
            </p>

            <h3 className="section-title mt-1">
              11 mins
            </h3>

          </div>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <button className="btn-success flex items-center justify-center gap-3 rounded-2xl py-4 font-semibold">

          <Phone size={20} />

          Call Volunteer

        </button>

        <button className="card-glass text-primary flex items-center justify-center gap-3 rounded-2xl py-4 font-semibold transition hover:scale-[1.02]">

          <MessageCircle size={20} />

          Message Volunteer

        </button>

      </div>

    </section>
  );
}