import { Target, Eye } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}

        <div className="text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            About ResQGrid
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Transforming Disaster Response Through Technology
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            ResQGrid is designed to bridge the communication gap between
            victims, volunteers and emergency organizations by providing
            one intelligent platform for rapid coordination during
            disasters.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {/* Mission */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:border-sky-300/30 hover:bg-white/10">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/10">

              <Target
                size={30}
                className="text-sky-300"
              />

            </div>

            <h3 className="text-3xl font-bold text-white">
              Our Mission
            </h3>

            <p className="mt-6 leading-8 text-slate-300">
              To reduce response time during disasters by intelligently
              connecting people in need with volunteers, NGOs,
              hospitals and emergency authorities through a unified,
              reliable and accessible platform.
            </p>

          </div>

          {/* Vision */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-300 hover:border-sky-300/30 hover:bg-white/10">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/10">

              <Eye
                size={30}
                className="text-sky-300"
              />

            </div>

            <h3 className="text-3xl font-bold text-white">
              Our Vision
            </h3>

            <p className="mt-6 leading-8 text-slate-300">
              To build a future where technology enables communities,
              governments and relief organizations to coordinate
              seamlessly, ensuring that every emergency receives a
              faster and more effective response.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}