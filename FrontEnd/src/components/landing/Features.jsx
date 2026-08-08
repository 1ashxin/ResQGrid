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
    color: "text-brand",
  },
  {
    icon: Users,
    title: "Volunteer Matching",
    description:
      "Nearby volunteers are matched to requests based on their location, availability and response capacity.",
    color: "text-success",
  },
  {
    icon: MapPinned,
    title: "Live Status Tracking",
    description:
      "Victims receive real-time updates as their requests move from submission to active assistance and resolution.",
    color: "text-danger",
  },
  {
    icon: Boxes,
    title: "Resource Coordination",
    description:
      "Relief camps, NGOs and emergency teams coordinate supplies and essential resources through one platform.",
    color: "text-warning",
  },
  {
    icon: ShieldCheck,
    title: "Secure Communication",
    description:
      "Verified volunteers and organizations communicate through a trusted environment designed for emergency response.",
    color: "text-brand",
  },
  {
    icon: BarChart3,
    title: "Operational Insights",
    description:
      "Administrators gain visibility into ongoing operations, response activity and resource utilization during disasters.",
    color: "text-brand",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}

        <div className="text-center">

          <p className="section-label text-sm">
            Platform Capabilities
          </p>

          <h2 className="section-title mt-4 text-4xl md:text-5xl">
            Designed for Every Stage of Disaster Response
          </h2>

          <p className="section-subtitle mx-auto mt-6 max-w-3xl text-lg leading-8">
            From reporting emergencies to coordinating volunteers and
            managing relief efforts, ResQGrid provides the essential
            tools required to respond faster and more effectively
            during crises.
          </p>

        </div>

        {/* Features Grid */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card-glass group rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2"
              >

                <div
                  className={`card-glass mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="section-title text-2xl">
                  {feature.title}
                </h3>

                <p className="section-subtitle mt-4 leading-7">
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