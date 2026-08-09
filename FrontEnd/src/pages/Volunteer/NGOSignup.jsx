import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";

export default function NGOSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organization: "",
    registration: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Backend registration will be added later

    navigate("/ngo/dashboard");
  }

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-2xl">

        <Link
          to="/volunteer"
          className="mb-8 inline-flex items-center gap-2 text-secondary transition hover:text-brand"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="card-glass rounded-3xl p-10">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-card">

              <Building2
                size={42}
                className="text-brand"
              />

            </div>

            <h1 className="mt-6 text-4xl font-bold text-primary">
              NGO Registration
            </h1>

            <p className="mt-3 text-secondary">
              Register your organization to coordinate volunteers,
              manage resources and respond to emergencies.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Organization Name
              </label>

              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="Helping Hands Foundation"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Registration Number
              </label>

              <input
                type="text"
                name="registration"
                value={form.registration}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="NGO Registration Number"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="organization@email.com"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Contact Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="+91 XXXXX XXXXX"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="Create a password"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-secondary">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
                placeholder="Confirm password"
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
            >
              Register NGO
            </button>

          </form>

          <p className="mt-8 text-center text-secondary">

            Already registered?{" "}

            <Link
              to="/volunteer/login"
              className="text-brand font-semibold hover:underline"
            >
              Sign In
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}