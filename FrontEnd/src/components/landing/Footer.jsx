import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#203245] px-6 py-14 lg:px-12">

      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}

        <div>

          <div className="flex items-center gap-4">

            <img
              src={logo}
              alt="ResQGrid"
              className="h-12 w-12 object-contain"
            />

            <div>

              <h2 className="text-2xl font-bold text-white">
                ResQGrid
              </h2>

              <p className="text-sm text-slate-400">
                From Chaos to Coordination
              </p>

            </div>

          </div>

          <p className="mt-6 leading-7 text-slate-400">
            An intelligent disaster response platform connecting
            victims, volunteers, NGOs, hospitals and authorities
            through one coordinated emergency network.
          </p>

        </div>

        {/* Platform */}

        <div>

          <h3 className="mb-5 text-lg font-semibold text-white">
            Platform
          </h3>

          <ul className="space-y-3 text-slate-400">

            <li>
              <a href="#how-it-works" className="hover:text-sky-300 transition">
                How It Works
              </a>
            </li>

            <li>
              <a href="#features" className="hover:text-sky-300 transition">
                Features
              </a>
            </li>

            <li>
              <a href="#about" className="hover:text-sky-300 transition">
                About
              </a>
            </li>

          </ul>

        </div>

        {/* Emergency Contact */}

        <div>

          <h3 className="mb-5 text-lg font-semibold text-white">
            Emergency Support
          </h3>

          <div className="space-y-4 text-slate-400">

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-sky-300" />
              <span>Emergency Helpline</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-sky-300" />
              <span>support@resqgrid.org</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-sky-300" />
              <span>Mumbai, India</span>
            </div>

          </div>

        </div>

        {/* Note */}

        <div>

          <h3 className="mb-5 text-lg font-semibold text-white">
            Our Commitment
          </h3>

          <p className="leading-7 text-slate-400">
            Every second matters during a disaster. ResQGrid is designed
            to improve coordination, reduce response time and help
            communities recover faster through technology.
          </p>

        </div>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-slate-500">

        © 2026 ResQGrid. Built for smarter disaster response and community resilience.

      </div>

    </footer>
  );
}