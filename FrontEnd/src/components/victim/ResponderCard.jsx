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
    <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-emerald-400/5 p-8 backdrop-blur-xl">

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
        Assigned Responder
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">

            <UserRound
              size={40}
              className="text-emerald-300"
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Rahul Sharma
            </h2>

            <p className="mt-1 text-slate-300">
              Medical Volunteer
            </p>

            <div className="mt-3 flex items-center gap-2">

              <Star
                size={18}
                className="fill-yellow-400 text-yellow-400"
              />

              <span>4.9 Rating</span>

            </div>

          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl bg-white/5 p-5">

            <MapPin
              className="mb-2 text-red-300"
            />

            <p className="text-sm text-slate-400">
              Distance
            </p>

            <h3 className="mt-1 font-semibold">
              2.4 km
            </h3>

          </div>

          <div className="rounded-2xl bg-white/5 p-5">

            <Clock3
              className="mb-2 text-sky-300"
            />

            <p className="text-sm text-slate-400">
              ETA
            </p>

            <h3 className="mt-1 font-semibold">
              11 mins
            </h3>

          </div>

        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <button className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-4 font-semibold transition hover:bg-emerald-400">

          <Phone size={20} />

          Call Volunteer

        </button>

        <button className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold transition hover:bg-white/10">

          <MessageCircle size={20} />

          Message Volunteer

        </button>

      </div>

    </section>
  );
}