import {
  HeartPulse,
  Users,
  Building2,
  Shield,
  Tent,
  Network,
  Hospital,
} from "lucide-react";

const nodes = [
  {
    id: "ngo",
    icon: Building2,
    title: "NGOs",
    subtitle: "Resource Partners",
    color: "text-violet-300",
    x: 50,
    y: 8,
  },
  {
    id: "volunteers",
    icon: Users,
    title: "Volunteers",
    subtitle: "Community Response",
    color: "text-sky-300",
    x: 15,
    y: 35,
  },
  {
    id: "hospital",
    icon: Hospital,
    title: "Hospitals",
    subtitle: "Medical Support",
    color: "text-emerald-300",
    x: 85,
    y: 35,
  },
  {
    id: "camp",
    icon: Tent,
    title: "Relief Camps",
    subtitle: "Temporary Shelter",
    color: "text-amber-300",
    x: 20,
    y: 82,
  },
  {
    id: "authority",
    icon: Shield,
    title: "Authorities",
    subtitle: "Emergency Control",
    color: "text-slate-200",
    x: 80,
    y: 82,
  },
  {
    id: "victim",
    icon: HeartPulse,
    title: "Victims",
    subtitle: "SOS Requests",
    color: "text-red-300",
    x: 50,
    y: 94,
  },
];

function NetworkNode({ node }) {
  const Icon = node.icon;

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
    >
      <div className="group flex flex-col items-center">

        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-sky-300/40">

          <Icon
            size={34}
            className={node.color}
          />

        </div>

        <h4 className="mt-4 text-lg font-semibold text-white">
          {node.title}
        </h4>

        <p className="mt-1 text-center text-sm text-slate-300">
          {node.subtitle}
        </p>

      </div>
    </div>
  );
}

export default function ResponseNetwork() {
  return (
    <section
      id="network"
      className="px-6 py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Coordination Network
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            One Platform. Every Responder Connected.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            ResQGrid connects victims, volunteers, hospitals,
            NGOs, relief camps and emergency authorities into
            one intelligent disaster response ecosystem.
          </p>

        </div>

        {/* Desktop */}

        <div className="relative mx-auto mt-24 hidden h-[720px] max-w-6xl lg:block">

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >

            <g
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="2"
              fill="none"
            >

              <line x1="500" y1="350" x2="500" y2="90" />

              <line x1="500" y1="350" x2="170" y2="245" />

              <line x1="500" y1="350" x2="830" y2="245" />

              <line x1="500" y1="350" x2="210" y2="575" />

              <line x1="500" y1="350" x2="790" y2="575" />

              <line x1="500" y1="350" x2="500" y2="660" />

            </g>

          </svg>
                    {/* Center Hub */}
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">

            {/* Glow */}
            <div className="absolute inset-0 scale-150 rounded-full bg-sky-400/20 blur-3xl"></div>

            <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border border-sky-300/40 bg-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(56,189,248,0.35)] transition-all duration-300 hover:scale-105">

              <Network
                size={42}
                className="mb-3 text-sky-300"
              />

              <h3 className="text-xl font-bold text-white">
                ResQGrid
              </h3>

              <p className="mt-1 text-center text-xs text-slate-300">
                Coordination Hub
              </p>

            </div>

          </div>

          {/* Network Nodes */}
          {nodes.map((node) => (
            <NetworkNode
              key={node.id}
              node={node}
            />
          ))}

        </div>

        {/* Mobile Layout */}
        <div className="mt-16 space-y-6 lg:hidden">

          <div className="rounded-3xl border border-sky-300/30 bg-white/10 p-8 text-center backdrop-blur-xl">

            <Network
              size={40}
              className="mx-auto mb-4 text-sky-300"
            />

            <h3 className="text-2xl font-bold text-white">
              ResQGrid
            </h3>

            <p className="mt-2 text-slate-300">
              Coordination Hub
            </p>

          </div>

          <div className="grid gap-5">

            {nodes.map((node) => {
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">

                      <Icon
                        size={26}
                        className={node.color}
                      />

                    </div>

                    <div>

                      <h4 className="font-semibold text-white">
                        {node.title}
                      </h4>

                      <p className="text-sm text-slate-300">
                        {node.subtitle}
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}