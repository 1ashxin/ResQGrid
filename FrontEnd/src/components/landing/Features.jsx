import {
  BrainCircuit,
  Users,
  MapPinned,
  Boxes,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Request Prioritization",
    description:
      "Emergency requests are intelligently prioritized based on urgency, severity and available resources to ensure the fastest possible response.",
    color: "text-sky-300",
  },
  {
    icon: Users,
    title: "Volunteer Matching",
    description:
      "Nearby volunteers are matched to requests based on their location, availability and response capacity.",
    color: "text-emerald-300",
  },
  {
    icon: MapPinned,
    title: "Live Status Tracking",
    description:
      "Victims receive real-time updates as their requests move from submission to active assistance and resolution.",
    color: "text-red-300",
  },
  {
    icon: Boxes,
    title: "Resource Coordination",
    description:
      "Relief camps, NGOs and emergency teams coordinate supplies and essential resources through one platform.",
    color: "text-amber-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure Communication",
    description:
      "Verified volunteers and organizations communicate through a trusted environment designed for emergency response.",
    color: "text-violet-300",
  },
  {
    icon: BarChart3,
    title: "Operational Insights",
    description:
      "Administrators gain visibility into ongoing operations, response activity and resource utilization during disasters.",
    color: "text-cyan-300",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="px-6 py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}

        <div className="text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Platform Capabilities
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Designed for Every Stage of Disaster Response
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            From reporting emergencies to coordinating volunteers and
            managing relief efforts, ResQGrid provides the essential tools
            required to respond faster and more effectively during crises.
          </p>

        </div>

        {/* Features Grid */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-300/30 hover:bg-white/10"
              >

                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ${feature.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-300">
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