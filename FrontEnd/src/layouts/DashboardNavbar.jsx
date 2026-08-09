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
  const { logout } = useAuth();

  // ----------------------------
  // Defaults
  // ----------------------------

  let dashboardLink = "/";
  let pageTitle = "Dashboard";

  let actionText = "Action";
  let actionLink = "/";

  let resourcesText = "Resources";
  let resourcesLink = "/search";

  // ----------------------------
  // Victim
  // ----------------------------

  if (location.pathname.startsWith("/victim")) {
    dashboardLink = "/victim";

    actionText = "Request SOS";
    actionLink = "/victim/request";

    resourcesText = "Resources";
    resourcesLink = "/help";
  }

  // ----------------------------
  // Volunteer
  // ----------------------------

  if (location.pathname.startsWith("/volunteer")) {
    dashboardLink = "/volunteer/dashboard";

    actionText = "History";
    actionLink = "/history";

    resourcesText = "Resources";
    resourcesLink = "/search";
  }

  // ----------------------------
  // NGO
  // ----------------------------

  if (location.pathname.startsWith("/ngo")) {
    dashboardLink = "/ngo/dashboard";

    actionText = "Resources";
    actionLink = "/search";

    resourcesText = "History";
    resourcesLink = "/history";
  }

  // ----------------------------
  // Admin
  // ----------------------------

  if (location.pathname.startsWith("/admin")) {
    dashboardLink = "/admin";

    actionText = "Control Center";
    actionLink = "/admin";

    resourcesText = "Search";
    resourcesLink = "/search";
  }

  // ----------------------------
  // Page Title
  // ----------------------------

  if (location.pathname === "/profile") pageTitle = "Profile";
  else if (location.pathname === "/notifications") pageTitle = "Notifications";
  else if (location.pathname === "/search") pageTitle = "Search";
  else if (location.pathname === "/history") pageTitle = "History";
  else if (location.pathname === "/help") pageTitle = "Help Center";
  else if (location.pathname === "/settings") pageTitle = "Settings";
  else if (location.pathname === "/victim/request") pageTitle = "SOS Request";
  else if (location.pathname.startsWith("/victim")) pageTitle = "Victim Dashboard";
  else if (location.pathname.startsWith("/volunteer")) pageTitle = "Volunteer Dashboard";
  else if (location.pathname.startsWith("/ngo")) pageTitle = "NGO Dashboard";
  else if (location.pathname.startsWith("/admin")) pageTitle = "Admin Dashboard";

  function handleLogout() {
    logout();
    navigate("/");
  }

  function navClasses(active) {
    return active
      ? "rounded-xl bg-card px-5 py-2 font-semibold text-primary"
      : "rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
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

            <p className="mt-1 text-xs font-semibold text-brand">
              {pageTitle}
            </p>

          </div>

        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-2 lg:flex">

          <Link
            to="/"
            className={navClasses(location.pathname === "/")}
          >
            Home
          </Link>

          <Link
            to={dashboardLink}
            className={navClasses(
              location.pathname.startsWith("/victim") &&
                location.pathname !== "/victim/request" ||
              location.pathname.startsWith("/volunteer") ||
              location.pathname.startsWith("/ngo") ||
              location.pathname.startsWith("/admin")
            )}
          >
            Dashboard
          </Link>

          <Link
            to={actionLink}
            className={navClasses(location.pathname === actionLink)}
          >
            {actionText}
          </Link>

          <Link
            to={resourcesLink}
            className={navClasses(location.pathname === resourcesLink)}
          >
            {resourcesText}
          </Link>

        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-3">

          <Link
            to="/search"
            className="rounded-xl bg-card p-3 transition-all duration-300 hover:scale-105"
          >
            <Search
              size={20}
              className="text-secondary"
            />
          </Link>

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

          <Link
            to="/profile"
            className="rounded-xl bg-card p-2 transition-all duration-300 hover:scale-105"
          >
            <UserCircle2
              size={34}
              className="text-brand"
            />
          </Link>

          <Link
            to="/settings"
            className="rounded-xl bg-card p-3 transition-all duration-300 hover:scale-105"
          >
            <Settings
              size={20}
              className="text-secondary"
            />
          </Link>

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