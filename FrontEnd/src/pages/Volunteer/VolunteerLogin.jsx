import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2 } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import LoginForm from "../../components/volunteer/LoginForm";

export default function VolunteerLogin() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>

      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-secondary transition hover:text-brand"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <section className="text-center">

        <p className="text-brand text-sm font-semibold uppercase tracking-[0.3em]">
          Volunteer Portal
        </p>

        <h1 className="mt-3 text-5xl font-bold text-primary">
          Volunteer Login
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-secondary">
          Sign in to continue responding to emergency requests and
          coordinating disaster relief through ResQGrid.
        </p>

      </section>

      <div className="mx-auto mt-12 max-w-2xl">

        <LoginForm />

      </div>

      <section className="mt-10">

        <div className="card-glass rounded-3xl p-8">

          <h2 className="text-center text-2xl font-bold text-primary">
            Don't have an account?
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <Link
              to="/volunteer/register/individual"
              className="card-glass rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
            >

              <User
                size={36}
                className="mx-auto text-brand"
              />

              <h3 className="mt-4 text-xl font-semibold text-primary">
                Individual
              </h3>

              <p className="mt-2 text-secondary">
                Register as an independent volunteer.
              </p>

            </Link>

            <Link
              to="/volunteer/register/ngo"
              className="card-glass rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
            >

              <Building2
                size={36}
                className="mx-auto text-brand"
              />

              <h3 className="mt-4 text-xl font-semibold text-primary">
                NGO / Organization
              </h3>

              <p className="mt-2 text-secondary">
                Register your organization.
              </p>

            </Link>

          </div>

        </div>

      </section>

    </DashboardLayout>
  );
}