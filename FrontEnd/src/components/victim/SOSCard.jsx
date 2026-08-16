import {
  Siren,
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

// `respondersAvailable` is the real count of volunteers currently marked
// available, passed down from VictimDashboard. The card previously showed a
// fixed "124 Online" and an "8-15 Minutes" response estimate that nothing
// in the system actually calculated.
export default function SOSCard({ respondersAvailable = 0 }) {
  return (
    <section className="card-glass rounded-3xl p-8">

      {/* Badge */}
      <div className="mb-6 inline-flex items-center rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white">

        <Siren
          size={16}
          className="mr-2"
        />

        Emergency Assistance

      </div>

      {/* Header */}
      <div className="flex items-start gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger">

          <Siren
            size={34}
            className="text-white"
          />

        </div>

        <div>

          <h2 className="text-3xl font-bold text-primary">
            Need Immediate Help?
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-secondary">
            Submit an emergency request to instantly notify nearby
            volunteers, NGOs and emergency responders. Your request
            will be prioritized based on urgency and location to
            ensure the fastest possible response.
          </p>

        </div>

      </div>

      {/* Quick Information */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <div className="rounded-2xl bg-card p-5">

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={22}
              className="text-brand"
            />

            <div>

              <p className="text-sm text-muted">
                Request Handling
              </p>

              <h3 className="mt-1 text-xl font-semibold text-primary">
                Priority Triaged
              </h3>

            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-card p-5">

          <div className="flex items-center gap-3">

            <Users
              size={22}
              className="text-success"
            />

            <div>

              <p className="text-sm text-muted">
                Responders Available
              </p>

              <h3 className="mt-1 text-xl font-semibold text-primary">
                {respondersAvailable} Online
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* Button */}
      <Link
        to="/victim/request"
        className="btn-danger mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
      >

        Request Emergency Assistance

        <ArrowRight size={20} />

      </Link>

      <p className="mt-5 text-center text-sm text-muted">
        Your emergency request will be securely shared with the nearest
        verified responders and relief organizations.
      </p>

    </section>
  );
}