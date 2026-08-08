import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function DashboardNavbar() {
  const location = useLocation();

  function active(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-primary/90 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="ResQGrid Logo"
            className="h-11 w-11 object-contain"
          />

          <div>

            <h1 className="section-title text-xl">
              ResQGrid
            </h1>

            <p className="section-subtitle text-xs">
              From Chaos to Coordination
            </p>

          </div>

        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-3 md:flex">

          <Link
            to="/"
            className={`rounded-xl px-5 py-2 transition ${
              location.pathname === "/"
                ? "btn-primary"
                : "text-secondary hover:bg-card"
            }`}
          >
            Home
          </Link>

          <Link
            to="/victim"
            className={`rounded-xl px-5 py-2 transition ${
              active("/victim")
                ? "btn-primary"
                : "text-secondary hover:bg-card"
            }`}
          >
            Victim
          </Link>

          <Link
            to="/volunteer"
            className={`rounded-xl px-5 py-2 transition ${
              active("/volunteer")
                ? "btn-primary"
                : "text-secondary hover:bg-card"
            }`}
          >
            Volunteer
          </Link>

        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <button className="card-glass rounded-xl p-3 transition-all duration-300 hover:scale-105">

            <Search
              size={20}
              className="text-secondary"
            />

          </button>

          <button className="card-glass relative rounded-xl p-3 transition-all duration-300 hover:scale-105">

            <Bell
              size={20}
              className="text-secondary"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-primary">
              2
            </span>

          </button>

          <button className="card-glass rounded-xl p-2 transition-all duration-300 hover:scale-105">

            <UserCircle2
              size={34}
              className="text-brand"
            />

          </button>

        </div>

      </div>

    </header>
  );
}