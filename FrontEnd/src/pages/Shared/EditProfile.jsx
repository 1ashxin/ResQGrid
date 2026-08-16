import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

export default function EditProfile() {
  const navigate = useNavigate();

  // Load existing profile if available
  const savedProfile = JSON.parse(
    localStorage.getItem("resqgrid_profile") || "{}"
  );

  const [form, setForm] = useState({
    name: savedProfile.name || "",
    email: savedProfile.email || "",
    phone: savedProfile.phone || "",
    address: savedProfile.address || "",
    role: savedProfile.role || "Volunteer",
    primarySkill: savedProfile.primarySkill || "",
  });

  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    localStorage.setItem(
      "resqgrid_profile",
      JSON.stringify(form)
    );

    setSaved(true);

    setTimeout(() => {
      navigate("/profile");
    }, 700);
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mb-8 flex items-center gap-2 text-secondary transition hover:text-brand"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="section-label text-sm">
            Profile Settings
          </p>

          <h1 className="mt-3 text-4xl font-bold text-primary">
            Edit Profile
          </h1>

          <p className="mt-3 text-secondary">
            Update your personal information and ResQGrid profile details.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-glass rounded-3xl p-8 md:p-10"
        >

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <User
                  size={20}
                  className="text-brand"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Keep your contact information up to date.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="input-glass w-full rounded-xl py-4 pl-12 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="input-glass w-full rounded-xl py-4 pl-12 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="input-glass w-full rounded-xl py-4 pl-12 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary">
                  Role
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input-glass w-full appearance-none rounded-xl py-4 pl-12 pr-4"
                  >
                    <option value="Victim">
                      Victim
                    </option>

                    <option value="Volunteer">
                      Volunteer
                    </option>

                    <option value="NGO">
                      NGO
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Address */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <MapPin
                  size={20}
                  className="text-brand"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Address
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Your current location or operating address.
                </p>
              </div>
            </div>

            <textarea
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your current address"
              className="input-glass mt-6 w-full resize-none rounded-xl p-4"
            />
          </div>

          {/* Volunteer Information */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <Briefcase
                  size={20}
                  className="text-brand"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Volunteer Information
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Update your primary area of contribution.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-secondary">
                Primary Skill
              </label>

              <select
                name="primarySkill"
                value={form.primarySkill}
                onChange={handleChange}
                className="input-glass w-full rounded-xl p-4"
              >
                <option value="Medical Assistance">
                  Medical Assistance
                </option>

                <option value="Search & Rescue">
                  Search & Rescue
                </option>

                <option value="Logistics">
                  Logistics
                </option>

                <option value="Food Distribution">
                  Food Distribution
                </option>

                <option value="Shelter Management">
                  Shelter Management
                </option>

                <option value="Crowd Control">
                  Crowd Control
                </option>
              </select>
            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="mt-8 rounded-xl border border-success/20 bg-success/10 p-4 text-sm font-medium text-success">
              Profile updated successfully.
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full rounded-2xl bg-card px-6 py-4 font-semibold text-primary transition hover:-translate-y-0.5 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-1 sm:w-auto"
            >
              <Save size={18} />
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}