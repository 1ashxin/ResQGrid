import { useState } from "react";
import { useNavigate } from "react-router-dom";

const skills = [
  "Medical",
  "Search & Rescue",
  "Logistics",
  "Food Distribution",
  "Shelter Management",
  "Crowd Control",
];

export default function IndividualForm() {
  const navigate = useNavigate();

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

  function handleSubmit(e) {
    e.preventDefault();

    // TODO:
    // axios.post("/api/volunteer/register", form);

    navigate("/volunteer/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass rounded-3xl p-10 space-y-8"
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {skills.map((skill) => (

            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-xl border p-4 transition ${
                form.skills.includes(skill)
                  ? "btn-primary border-transparent"
                  : "border-glass bg-card text-secondary"
              }`}
            >
              {skill}
            </button>

          ))}

        </div>

      </div>

      {/* Availability */}

      <div>

        <h2 className="section-title text-2xl">
          Availability
        </h2>

        <select
          name="availability"
          value={form.availability}
          onChange={handleChange}
          className="input-glass mt-6 w-full rounded-xl p-4"
        >

          <option>Full Time</option>
          <option>Weekends</option>
          <option>On Call</option>

        </select>

      </div>

      {/* Submit */}

      <button
        type="submit"
        className="btn-primary w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
      >
        Register as Volunteer
      </button>

    </form>
  );
}