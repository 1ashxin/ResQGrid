import {
  User,
  Bell,
  Globe,
  Shield,
  Info,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import SettingCard from "../../components/settings/SettingCard";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Settings
          </h1>

          <p className="mt-2 text-secondary">
            Manage your account preferences and application settings.
          </p>

        </div>

        {/* Settings */}

        <div className="space-y-5">

          <SettingCard
            icon={<User className="text-brand" size={22} />}
            title="Account"
            description="Manage your profile information."
          />

          <SettingCard
            icon={<Bell className="text-warning" size={22} />}
            title="Notifications"
            description="Configure notification preferences."
          />

          <SettingCard
            icon={<Globe className="text-success" size={22} />}
            title="Language"
            description="Choose your preferred language."
          />

          <SettingCard
            icon={<Shield className="text-danger" size={22} />}
            title="Privacy & Security"
            description="Update your privacy settings."
          />

          <SettingCard
            icon={<Info className="text-brand" size={22} />}
            title="About ResQGrid"
            description="Application version and information."
          />

        </div>

        {/* Logout */}

        <div className="mt-10">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl bg-danger px-6 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </section>

    </DashboardLayout>
  );
}