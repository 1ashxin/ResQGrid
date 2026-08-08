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
    color: "text-red-300",
  },
  {
    icon: BrainCircuit,
    title: "AI Prioritizes",
    description:
      "ResQGrid intelligently prioritizes requests based on urgency, severity, and available resources.",
    color: "text-sky-300",
  },
  {
    icon: Users,
    title: "Volunteers Respond",
    description:
      "Nearby volunteers receive notifications and accept tasks based on their availability and proximity.",
    color: "text-emerald-300",
  },
  {
    icon: ShieldCheck,
    title: "Relief Coordinated",
    description:
      "NGOs and emergency authorities coordinate relief while victims receive live updates throughout the response.",
    color: "text-yellow-300",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-6 py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Our Response Process
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            How ResQGrid Responds
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
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
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-300/30 hover:bg-white/10">

                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ${step.color}`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="leading-7 text-slate-300">
                    {step.description}
                  </p>

                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-8 top-1/2 hidden -translate-y-1/2 lg:flex">
                    <ArrowRight
                      size={28}
                      className="text-sky-300"
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