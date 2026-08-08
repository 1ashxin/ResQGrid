import { User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import VolunteerPortalCard from "../../components/volunteer/VolunteerPortalCard";

export default function VolunteerPortal() {
  return (
    <DashboardLayout>

      <section>

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.3em]">
          Volunteer Portal
        </p>

        <h1 className="mt-3 text-5xl font-bold text-primary">
          Join the ResQGrid Response Network
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Become part of a coordinated disaster response ecosystem.
          Whether you're an individual volunteer or an NGO, ResQGrid
          helps you respond faster, coordinate better and save lives.
        </p>

      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">

        <VolunteerPortalCard
          icon={User}
          title="Individual Volunteer"
          description="Join as an independent volunteer and respond directly to nearby emergency requests."
          features={[
            "Respond to SOS requests",
            "Assist disaster victims",
            "Real-time emergency alerts",
            "Verified volunteer profile",
          ]}
          buttonText="Continue as Individual"
          to="/volunteer/register/individual"
        />

        <VolunteerPortalCard
          icon={Building2}
          title="NGO / Organization"
          description="Coordinate disaster relief, manage volunteers and organize emergency resources."
          features={[
            "Manage volunteers",
            "Coordinate relief camps",
            "Distribute resources",
            "Track disaster operations",
          ]}
          buttonText="Continue as NGO"
          to="/volunteer/register/ngo"
        />

      </section>

      <section className="mt-14">

        <div className="card-glass rounded-3xl p-8 text-center">

          <h2 className="text-2xl font-bold text-primary">
            Already registered?
          </h2>

          <p className="mt-3 text-secondary">
            Sign in to access your volunteer dashboard and continue helping communities.
          </p>

          <Link
            to="/volunteer/login"
            className="btn-primary mt-8 inline-flex items-center justify-center rounded-2xl px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            Sign In
          </Link>

        </div>

      </section>

    </DashboardLayout>
  );
}