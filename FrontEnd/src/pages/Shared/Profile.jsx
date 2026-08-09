import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  Pencil,
  LogOut,
  HeartHandshake,
  Briefcase,
  Building2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();

  const {
    user,
    role,
    logout,
  } = useAuth();

  const profile = {
    name: user?.name || "Rahul Sharma",
    email: user?.email || "rahul@example.com",
    phone: user?.phone || "+91 9876543210",
    role: role || user?.role || "volunteer",
    joined: user?.created_at || "August 2026",
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  function roleTitle() {
    switch (profile.role.toLowerCase()) {
      case "victim":
        return "Victim";
      case "ngo":
        return "NGO Coordinator";
      case "admin":
        return "Administrator";
      default:
        return "Volunteer";
    }
  }

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl py-8">

        {/* Header */}

        <div className="card-glass rounded-3xl p-8">

          <div className="flex flex-col items-center text-center">

            <div className="rounded-full bg-brand/15 p-6">

              <UserCircle2
                size={70}
                className="text-brand"
              />

            </div>

            <h1 className="mt-6 text-4xl font-bold text-primary">
              {profile.name}
            </h1>

            <p className="mt-2 text-secondary">
              {roleTitle()}
            </p>

            <div className="mt-6 rounded-full bg-success/10 px-5 py-2">

              <span className="font-medium text-success">
                Active Account
              </span>

            </div>

          </div>

        </div>

        {/* Personal Information */}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          <InfoCard
            icon={<Mail className="text-brand" size={22} />}
            title="Email Address"
            value={profile.email}
          />

          <InfoCard
            icon={<Phone className="text-success" size={22} />}
            title="Phone Number"
            value={profile.phone}
          />

          <InfoCard
            icon={<Shield className="text-warning" size={22} />}
            title="Account Role"
            value={roleTitle()}
          />

          <InfoCard
            icon={<CalendarDays className="text-danger" size={22} />}
            title="Member Since"
            value={profile.joined}
          />

        </div>

        {/* Role Specific Information */}

        <div className="mt-10 card-glass rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-primary">
            {roleTitle()} Information
          </h2>

          <p className="mt-2 text-secondary">
            Information related to your role within ResQGrid.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {profile.role.toLowerCase() === "victim" && (
              <>
                <RoleCard
                  icon={<HeartHandshake className="text-danger" size={22} />}
                  title="Emergency Contact"
                  value="+91 98765 11111"
                />

                <RoleCard
                  icon={<HeartHandshake className="text-danger" size={22} />}
                  title="Blood Group"
                  value="B+"
                />

                <RoleCard
                  icon={<HeartHandshake className="text-danger" size={22} />}
                  title="Current Request"
                  value="Flood Emergency"
                />

                <RoleCard
                  icon={<HeartHandshake className="text-danger" size={22} />}
                  title="Status"
                  value="Volunteer Assigned"
                />
              </>
            )}

            {profile.role.toLowerCase() === "volunteer" && (
              <>
                <RoleCard
                  icon={<Briefcase className="text-success" size={22} />}
                  title="Availability"
                  value="Available"
                />

                <RoleCard
                  icon={<Briefcase className="text-success" size={22} />}
                  title="Completed Missions"
                  value="18"
                />

                <RoleCard
                  icon={<Briefcase className="text-success" size={22} />}
                  title="Volunteer Rating"
                  value="4.9 / 5"
                />

                <RoleCard
                  icon={<Briefcase className="text-success" size={22} />}
                  title="Primary Skill"
                  value="Medical Assistance"
                />
              </>
            )}

            {profile.role.toLowerCase() === "ngo" && (
              <>
                <RoleCard
                  icon={<Building2 className="text-brand" size={22} />}
                  title="Organization"
                  value="Helping Hands Foundation"
                />

                <RoleCard
                  icon={<Building2 className="text-brand" size={22} />}
                  title="Registered Volunteers"
                  value="124"
                />

                <RoleCard
                  icon={<Building2 className="text-brand" size={22} />}
                  title="Relief Camps Managed"
                  value="5"
                />

                <RoleCard
                  icon={<Building2 className="text-brand" size={22} />}
                  title="Inventory Status"
                  value="Operational"
                />
              </>
            )}

            {profile.role.toLowerCase() === "admin" && (
              <>
                <RoleCard
                  icon={<Shield className="text-warning" size={22} />}
                  title="Access Level"
                  value="Super Administrator"
                />

                <RoleCard
                  icon={<Shield className="text-warning" size={22} />}
                  title="Managed Users"
                  value="1,284"
                />

                <RoleCard
                  icon={<Shield className="text-warning" size={22} />}
                  title="Platform Status"
                  value="Operational"
                />

                <RoleCard
                  icon={<Shield className="text-warning" size={22} />}
                  title="Permissions"
                  value="Full Access"
                />
              </>
            )}

          </div>

        </div>

        {/* Account Actions */}

        <div className="mt-10 flex flex-wrap gap-4">

          <button
            className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Pencil size={18} />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-danger px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </section>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="card-glass rounded-2xl p-6">

      <div className="mb-4 flex items-center gap-3">

        {icon}

        <h3 className="font-semibold text-primary">
          {title}
        </h3>

      </div>

      <p className="text-lg font-medium text-secondary">
        {value}
      </p>

    </div>
  );
}

function RoleCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-glass bg-card p-5">

      <div className="mb-3 flex items-center gap-3">

        {icon}

        <span className="font-semibold text-primary">
          {title}
        </span>

      </div>

      <p className="text-secondary">
        {value}
      </p>

    </div>
  );
}