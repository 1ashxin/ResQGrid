import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function DashboardNavbar() {
  const location = useLocation();

  function active(path) {
    return location.pathname === path;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#223449]/90 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-4"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20">

            <span className="text-xl font-black text-sky-300">
              R
            </span>

          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
              ResQGrid
            </h1>

            <p className="text-xs text-slate-400">
              Disaster Coordination Platform
            </p>

          </div>

        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-3 md:flex">

          <Link
            to="/victim"
            className={`rounded-xl px-5 py-2 transition ${
              active("/victim")
                ? "bg-sky-500 text-white"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Victim
          </Link>

          <Link
            to="/volunteer"
            className={`rounded-xl px-5 py-2 transition ${
              active("/volunteer")
                ? "bg-sky-500 text-white"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Volunteer
          </Link>

        </nav>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          <button className="rounded-xl bg-white/5 p-3 transition hover:bg-white/10">

            <Search size={20} />

          </button>

          <button className="relative rounded-xl bg-white/5 p-3 transition hover:bg-white/10">

            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              2
            </span>

          </button>

          <button className="rounded-xl bg-white/5 p-2 transition hover:bg-white/10">

            <UserCircle2
              size={34}
              className="text-sky-300"
            />

          </button>

        </div>

      </div>

    </header>
  );
}