import { Menu, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#223449]/90 backdrop-blur-xl">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

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

            <h1 className="text-xl font-bold tracking-wide text-white">
              ResQGrid
            </h1>

            <p className="text-xs text-slate-300">
              From Chaos to Coordination
            </p>

          </div>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">

          <a
            href="#"
            className="font-medium text-slate-200 transition hover:text-sky-300"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-slate-200 transition hover:text-sky-300"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="font-medium text-slate-200 transition hover:text-sky-300"
          >
            Features
          </a>

          <a
            href="#about"
            className="font-medium text-slate-200 transition hover:text-sky-300"
          >
            About
          </a>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex">

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-5 py-2.5 font-semibold text-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-500/20"
          >
            <Shield size={18} />

            Admin Portal
          </Link>

        </div>

        {/* Mobile */}
        <button className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden">
          <Menu size={24} />
        </button>

      </nav>

    </header>
  );
}