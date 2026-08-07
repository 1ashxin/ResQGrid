import { Menu } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-8 py-4 backdrop-blur-xl shadow-2xl">

        {/* Logo */}
        <div className="flex items-center gap-3">

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

        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">

          <a
            href="#"
            className="font-medium text-slate-200 transition duration-300 hover:text-sky-300"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-slate-200 transition duration-300 hover:text-sky-300"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="font-medium text-slate-200 transition duration-300 hover:text-sky-300"
          >
            Features
          </a>

          <a
            href="#about"
            className="font-medium text-slate-200 transition duration-300 hover:text-sky-300"
          >
            About
          </a>

        </div>

        {/* CTA */}
        <a
          href="/victim"
          className="hidden rounded-xl bg-[#FF7C7C] px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9090] md:block"
        >
          Get Help
        </a>

        {/* Mobile */}
        <button className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden">
          <Menu size={24} />
        </button>

      </nav>
    </header>
  );
}