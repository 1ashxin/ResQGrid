import { Menu, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-primary/90 backdrop-blur-xl">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
        >
          <img
            src={logo}
            alt="ResQGrid Logo"
            className="h-12 w-12 object-contain"
          />

          <div>

            <h1 className="section-title text-xl tracking-wide">
              ResQGrid
            </h1>

            <p className="section-subtitle text-xs">
              From Chaos to Coordination
            </p>

          </div>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 lg:flex">

          <a
            href="#"
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            Features
          </a>

          <a
            href="#about"
            className="rounded-xl px-5 py-2 font-medium text-secondary transition-all duration-300 hover:bg-card hover:text-primary"
          >
            About
          </a>

        </div>

        {/* Right Side */}
        <div className="hidden lg:flex">

          <Link
            to="/login"
            className="btn-primary flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <Shield size={18} />
            Admin Portal
          </Link>

        </div>

        {/* Mobile */}
        <button className="rounded-xl p-2 text-primary transition-all duration-300 hover:bg-card lg:hidden">
          <Menu size={24} />
        </button>

      </nav>

    </header>
  );
}