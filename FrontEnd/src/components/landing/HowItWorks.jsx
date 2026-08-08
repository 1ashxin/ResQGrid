import {
  Siren,
  BrainCircuit,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Siren,
    title: "Report Emergency",
    description:
      "Victims quickly submit an SOS with their location, emergency type, and immediate requirements.",
    color: "text-danger",
  },
  {
    icon: BrainCircuit,
    title: "AI Prioritizes",
    description:
      "ResQGrid intelligently prioritizes requests based on urgency, severity, and available resources.",
    color: "text-brand",
  },
  {
    icon: Users,
    title: "Volunteers Respond",
    description:
      "Nearby volunteers receive notifications and accept tasks based on their availability and proximity.",
    color: "text-success",
  },
  {
    icon: ShieldCheck,
    title: "Relief Coordinated",
    description:
      "NGOs and emergency authorities coordinate relief while victims receive live updates throughout the response.",
    color: "text-warning",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="text-center">

          <p className="section-label text-sm">
            Our Response Process
          </p>

          <h2 className="section-title mt-4 text-4xl md:text-5xl">
            How ResQGrid Responds
          </h2>

          <p className="section-subtitle mx-auto mt-6 max-w-3xl text-lg leading-8">
            Every emergency follows a structured workflow that enables
            victims, volunteers and emergency responders to work together
            efficiently from the first alert to the final relief effort.
          </p>

        </div>

        {/* Workflow */}
        <div className="mt-20 grid gap-10 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative"
              >

                <div className="card-glass h-full rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2">

                  <div
                    className={`card-glass mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="section-title mb-4 text-2xl">
                    {step.title}
                  </h3>

                  <p className="section-subtitle leading-7">
                    {step.description}
                  </p>

                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-8 top-1/2 hidden -translate-y-1/2 lg:flex">

                    <ArrowRight
                      size={28}
                      className="text-brand"
                    />

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}