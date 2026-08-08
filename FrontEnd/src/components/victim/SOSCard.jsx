import { Siren, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SOSCard() {
  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Badge */}
      <div className="mb-6 inline-flex rounded-full card-glass px-4 py-2">

        <span className="text-danger text-sm font-semibold tracking-wide">
          EMERGENCY ASSISTANCE
        </span>

      </div>

      {/* Content */}
      <div className="flex items-start gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl card-glass">

          <Siren
            size={34}
            className="text-danger"
          />

        </div>

        <div>

          <h2 className="section-title text-3xl">
            Need Immediate Help?
          </h2>

          <p className="section-subtitle mt-3 max-w-xl leading-7">
            Submit an emergency request with details about your
            situation. Nearby volunteers and relief organizations
            will be notified as soon as your request is received.
          </p>

        </div>

      </div>

      {/* CTA */}
      <Link
        to="/victim/request"
        className="btn-danger mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
      >
        Request Assistance
        <ArrowRight size={20} />
      </Link>

      <p className="text-muted mt-4 text-center text-sm">
        Fill out a short emergency form before your request is dispatched.
      </p>

    </section>
  );
}