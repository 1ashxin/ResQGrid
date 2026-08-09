import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, createNGOProfile } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const services = [
  "Medical Aid",
  "Search & Rescue",
  "Food Distribution",
  "Shelter Management",
  "Logistics",
  "Community Relief",
  "Child Care",
  "Psychological Support",
];

export default function NGOForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    organizationName: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    volunteers: "",
    operationAreas: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
    services: [],
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function toggleService(service) {
    if (form.services.includes(service)) {
      setForm({
        ...form,
        services: form.services.filter((item) => item !== service),
      });
    } else {
      setForm({
        ...form,
        services: [...form.services, service],
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await registerUser({
        email: form.email,
        password: form.password,
        role: "ngo",
      });
      await createNGOProfile({
        user_id: user.id,
        org_name: form.organizationName,
        registration_number: form.registrationNumber,
        contact_person: form.contactPerson,
        phone: form.phone,
        address: form.address || null,
        volunteer_count: form.volunteers ? Number(form.volunteers) : null,
        operation_areas: form.operationAreas || null,
        emergency_contact: form.emergencyContact || null,
        services: form.services.join(", ") || null,
      });
      login(user);
      navigate("/ngo/dashboard");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data?.detail || "That email is already registered.");
      } else {
        setError("Couldn't reach the server. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass rounded-3xl p-10 space-y-10"
    >
      {/* Organization Information */}

      <section>

        <h2 className="section-title text-2xl">
          Organization Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <input
            name="organizationName"
            placeholder="Organization Name"
            value={form.organizationName}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            name="contactPerson"
            placeholder="Contact Person"
            value={form.contactPerson}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Official Email"
            value={form.email}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

        </div>

        <textarea
          rows={4}
          name="address"
          placeholder="Office Address"
          value={form.address}
          onChange={handleChange}
          className="input-glass mt-6 w-full rounded-xl p-4"
        />

      </section>

      {/* Services */}

      <section>

        <h2 className="section-title text-2xl">
          Services Offered
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => (

            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`rounded-xl border p-4 transition-all duration-300 ${
                form.services.includes(service)
                  ? "btn-primary border-transparent"
                  : "border-glass bg-card text-secondary"
              }`}
            >
              {service}
            </button>

          ))}

        </div>

      </section>

      {/* Organization Details */}

      <section>

        <h2 className="section-title text-2xl">
          Organization Details
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <input
            type="number"
            name="volunteers"
            placeholder="Number of Volunteers"
            value={form.volunteers}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
          />

          <input
            name="operationAreas"
            placeholder="Areas of Operation"
            value={form.operationAreas}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
          />

          <input
            name="emergencyContact"
            placeholder="Emergency Contact Number"
            value={form.emergencyContact}
            onChange={handleChange}
            className="input-glass rounded-xl p-4 md:col-span-2"
          />

        </div>

      </section>

      {/* Security */}

      <section>

        <h2 className="section-title text-2xl">
          Security
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

        </div>

      </section>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Registering..." : "Register Organization"}
      </button>

    </form>
  );
}