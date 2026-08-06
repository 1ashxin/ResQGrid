const steps = [
  {
    number: "01",
    title: "Request Help",
    description:
      "Victims submit emergency requests with their location and required assistance."
  },
  {
    number: "02",
    title: "Volunteers Respond",
    description:
      "Nearby verified volunteers instantly receive notifications and accept requests."
  },
  {
    number: "03",
    title: "Relief Delivered",
    description:
      "Food, medical aid and shelter support are coordinated in real time."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-white">
            How ResQGrid Works
          </h2>

          <p className="text-slate-400 mt-4">
            Three simple steps during an emergency.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step) => (

            <div
              key={step.number}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-red-500 transition"
            >

              <p className="text-red-500 text-5xl font-bold">
                {step.number}
              </p>

              <h3 className="text-2xl text-white font-bold mt-6">
                {step.title}
              </h3>

              <p className="text-slate-400 mt-5 leading-7">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}