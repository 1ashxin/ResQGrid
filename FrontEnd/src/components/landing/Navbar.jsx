import { Menu, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-primary/90 backdrop-blur-xl">

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

            <h1 className="section-title text-xl tracking-wide">
              ResQGrid
            </h1>

            <p className="section-subtitle text-xs">
              From Chaos to Coordination
            </p>

          </div>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">

          <a
            href="#"
            className="font-medium text-secondary transition duration-300 hover:text-brand"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-secondary transition duration-300 hover:text-brand"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="font-medium text-secondary transition duration-300 hover:text-brand"
          >
            Features
          </a>

          <a
            href="#about"
            className="font-medium text-secondary transition duration-300 hover:text-brand"
          >
            About
          </a>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex">

          <Link
            to="/login"
            className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <Shield size={18} />
            Admin Portal
          </Link>

        </div>

        {/* Mobile */}
        <button className="rounded-lg p-2 text-primary transition hover:bg-card md:hidden">
          <Menu size={24} />
        </button>

      </nav>

    </header>
  );
}