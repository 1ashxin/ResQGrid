import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer id="about" className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-4">

              <img
                src={logo}
                alt="ResQGrid"
                className="h-12 w-12 object-contain"
              />

              <div>

                <h2 className="section-title text-2xl">
                  ResQGrid
                </h2>

                <p className="section-subtitle text-sm">
                  From Chaos to Coordination
                </p>

              </div>

            </div>

            <p className="section-subtitle mt-6 leading-7">
              An intelligent disaster response platform connecting
              victims, volunteers, NGOs, hospitals and authorities
              through one coordinated emergency network.
            </p>

          </div>

          {/* Platform */}

          <div>

            <h3 className="section-title mb-5 text-lg">
              Platform
            </h3>

            <ul className="space-y-3">

              <li>
                <a
                  href="#how-it-works"
                  className="text-secondary transition hover:text-brand"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="text-secondary transition hover:text-brand"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="text-secondary transition hover:text-brand"
                >
                  About
                </a>
              </li>

            </ul>

          </div>

          {/* Emergency Contact */}

          <div>

            <h3 className="section-title mb-5 text-lg">
              Emergency Support
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="text-brand"
                />

                <span className="text-secondary">
                  Emergency Helpline
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-brand"
                />

                <span className="text-secondary">
                  support@resqgrid.org
                </span>

              </div>

              <div className="flex items-center gap-3">

                <MapPin
                  size={18}
                  className="text-brand"
                />

                <span className="text-secondary">
                  Mumbai, India
                </span>

              </div>

            </div>

          </div>

          {/* Commitment */}

          <div>

            <h3 className="section-title mb-5 text-lg">
              Our Commitment
            </h3>

            <p className="section-subtitle leading-7">
              Every second matters during a disaster. ResQGrid is
              designed to improve coordination, reduce response
              time and help communities recover faster through
              technology.
            </p>

          </div>

        </div>

        <div className="mt-12 border-t border-glass pt-8 text-center">

          <p className="text-muted text-sm">
            © 2026 ResQGrid. Built for smarter disaster response and
            community resilience.
          </p>

        </div>

      </div>

    </footer>
  );
}