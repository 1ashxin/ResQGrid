import {
  ShieldCheck,
  MapPinned,
  BellRing,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Emergency SOS",
    description:
      "Send emergency requests instantly to nearby volunteers and NGOs.",
  },
  {
    icon: MapPinned,
    title: "Shelter Locator",
    description:
      "Find nearby shelters, hospitals, and relief camps in real time.",
  },
  {
    icon: Users,
    title: "Verified Volunteers",
    description:
      "Connect only with trusted volunteers and organizations.",
  },
  {
    icon: BellRing,
    title: "Live Updates",
    description:
      "Receive instant notifications about your request status.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-900 py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            Why Choose ResQGrid?
          </h2>

          <p className="text-slate-400 mt-4">
            Built for speed, reliability, and coordination during disasters.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-red-500 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-6">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}