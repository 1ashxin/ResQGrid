import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2 } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("individual");

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Backend authentication will go here later

    if (accountType === "individual") {
      navigate("/volunteer/dashboard");
      return;
    }

    navigate("/ngo/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass rounded-3xl p-8"
    >

      {/* Account Type */}

      <h2 className="text-center text-2xl font-bold text-primary">
        Choose Account Type
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <button
          type="button"
          onClick={() => setAccountType("individual")}
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            accountType === "individual"
              ? "btn-primary border-transparent"
              : "border-glass bg-card text-secondary"
          }`}
        >

          <User
            size={32}
            className="mx-auto"
          />

          <p className="mt-3 font-semibold">
            Individual
          </p>

        </button>

        <button
          type="button"
          onClick={() => setAccountType("ngo")}
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            accountType === "ngo"
              ? "btn-primary border-transparent"
              : "border-glass bg-card text-secondary"
          }`}
        >

          <Building2
            size={32}
            className="mx-auto"
          />

          <p className="mt-3 font-semibold">
            NGO
          </p>

        </button>

      </div>

      {/* Email */}

      <div className="mt-8">

        <label className="mb-2 block text-sm font-medium text-secondary">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="input-glass w-full rounded-xl p-4"
          required
        />

      </div>

      {/* Password */}

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-secondary">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="input-glass w-full rounded-xl p-4"
          required
        />

      </div>

      {/* Remember Me */}

      <div className="mt-6 flex items-center justify-between">

        <label className="flex items-center gap-3 text-secondary">

          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />

          Remember Me

        </label>

        <Link
          to="#"
          className="text-brand transition hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        className="btn-primary mt-8 w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
      >
        Sign In
      </button>

    </form>
  );
}