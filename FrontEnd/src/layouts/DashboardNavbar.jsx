import {
  Bell,
  Search,
  UserCircle2,
  Circle,
  LogOut,
  Settings,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  let roleTitle = "Dashboard";
  let dashboardLink = "/";
  let resourceText = "Resources";
  let resourceLink = "/help";

  if (location.pathname.startsWith("/victim")) {
    roleTitle = "Victim Dashboard";
    dashboardLink = "/victim";
    resourceText = "Emergency Help";
    resourceLink = "/help";
  }

  if (location.pathname.startsWith("/volunteer")) {
    roleTitle = "Volunteer Dashboard";
    dashboardLink = "/volunteer/dashboard";
    resourceText = "Current Mission";
    resourceLink = "/history";
  }

  if (location.pathname.startsWith("/ngo")) {
    roleTitle = "NGO Dashboard";
    dashboardLink = "/ngo/dashboard";
    resourceText = "Resources";
    resourceLink = "/search";
  }

  if (location.pathname.startsWith("/admin")) {
    roleTitle = "Admin Dashboard";
    dashboardLink = "/admin";
    resourceText = "System";
    resourceLink = "/search";
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="border-b border-white/10 bg-background/90 backdrop-blur-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-4"
        >
          <img
            src={logo}
            alt="ResQGrid"
            className="h-12 w-12 object-contain"
          />

          <div>

            <h1 className="section-title text-xl tracking-wide">
              ResQGrid
            </h1>

            <p className="section-subtitle text-xs">
              From Chaos to Coordination
            </p>

            <p className="mt-1 text-sm font-medium text-brand">
              {roleTitle}
            </p>

          </div>

        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-3 lg:flex">

          <Link
            to="/"
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            Home
          </Link>

          <Link
            to={dashboardLink}
            className="rounded-xl bg-card px-5 py-2 font-semibold text-primary"
          >
            Dashboard
          </Link>

          <Link
            to={resourceLink}
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            {resourceText}
          </Link>

        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-3">

          {/* Search */}

          <Link
            to="/search"
            className="rounded-xl bg-card p-3 transition-all duration-300 hover:scale-105"
          >
            <Search
              size={20}
              className="text-secondary"
            />
          </Link>

          {/* Notifications */}

          <Link
            to="/notifications"
            className="relative rounded-xl bg-card p-3 transition-all duration-300 hover:scale-105"
          >
            <Bell
              size={20}
              className="text-secondary"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
              3
            </span>

          </Link>

          {/* Status */}

          <div className="hidden items-center gap-2 rounded-full bg-success/10 px-4 py-2 md:flex">

            <Circle
              size={10}
              fill="currentColor"
              className="text-success"
            />

            <span className="text-sm font-medium text-success">
              Operational
            </span>

          </div>

          {/* Profile */}

          <Link
            to="/profile"
            className="rounded-xl bg-card p-2 transition-all duration-300 hover:scale-105"
          >
            <UserCircle2
              size={34}
              className="text-brand"
            />
          </Link>

          {/* Settings */}

          <Link
            to="/settings"
            className="rounded-xl bg-card p-3 transition-all duration-300 hover:scale-105"
          >
            <Settings
              size={20}
              className="text-secondary"
            />
          </Link>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl bg-danger px-5 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 lg:flex"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}