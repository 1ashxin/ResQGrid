import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  registerUser,
  createVolunteerProfile,
} from "../../api/client";

const skills = [
  "Medical",
  "Search & Rescue",
  "Logistics",
  "Food Distribution",
  "Shelter Management",
  "Crowd Control",
];

const availabilityOptions = [
  "Full Time",
  "Weekends",
  "On Call",
];

export default function IndividualForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    emergencyContact: "",
    availability: "Full Time",
    skills: [],
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function toggleSkill(skill) {
    if (form.skills.includes(skill)) {
      setForm({
        ...form,
        skills: form.skills.filter((s) => s !== skill),
      });
    } else {
      setForm({
        ...form,
        skills: [...form.skills, skill],
      });
    }
  }

  function selectAvailability(option) {
    setForm({
      ...form,
      availability: option,
    });

    setAvailabilityOpen(false);
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
      // Create the user account
      const user = await registerUser({
        email: form.email,
        password: form.password,
        role: "volunteer",
      });

      // Create the volunteer profile
      await createVolunteerProfile({
        user_id: user.id,
        full_name: form.name,
        phone: form.phone,
        skills: form.skills.join(", ") || null,
      });

      // Log the new volunteer in
      login(user);

      // Go to volunteer dashboard
      navigate("/volunteer/dashboard");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response.data?.detail ||
            "That email is already registered."
        );
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
      className="space-y-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10"
    >
      {/* Personal Information */}
      <div>
        <h2 className="section-title text-2xl">
          Personal Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
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

          <input
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={form.emergencyContact}
            onChange={handleChange}
            className="input-glass rounded-xl p-4"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
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
      </div>

      {/* Address */}
      <div>
        <h2 className="section-title text-2xl">
          Address
        </h2>

        <textarea
          rows={4}
          name="address"
          placeholder="Current Address"
          value={form.address}
          onChange={handleChange}
          className="input-glass mt-6 w-full rounded-xl p-4"
        />
      </div>

      {/* Skills */}
      <div>
        <h2 className="section-title text-2xl">
          Skills
        </h2>

        <p className="mt-2 text-sm text-muted">
          Select the skills you can contribute during emergencies.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => {
            const selected = form.skills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  selected
                    ? "border-transparent bg-brand text-white shadow-lg"
                    : "border-glass bg-card text-secondary hover:border-brand hover:text-primary"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h2 className="section-title text-2xl">
          Availability
        </h2>

        <p className="mt-2 text-sm text-muted">
          Tell us when you are generally available to respond.
        </p>

        <div className="relative mt-6">
          {/* Selected option */}
          <button
            type="button"
            onClick={() =>
              setAvailabilityOpen(!availabilityOpen)
            }
            className="input-glass flex w-full items-center justify-between rounded-xl p-4 text-left text-primary transition-all duration-200 hover:border-brand"
          >
            <span>{form.availability}</span>

            <ChevronDown
              size={20}
              className={`text-secondary transition-transform duration-200 ${
                availabilityOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Custom dropdown */}
          {availabilityOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#344b63] shadow-2xl">
              {availabilityOptions.map((option) => {
                const selected =
                  form.availability === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      selectAvailability(option)
                    }
                    className={`block w-full px-5 py-4 text-left transition-colors duration-200 ${
                      selected
                        ? "bg-brand text-white"
                        : "text-primary hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Registering..."
          : "Register as Volunteer"}
      </button>
    </form>
  );
}