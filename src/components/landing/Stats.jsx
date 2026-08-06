import StatCard from "../common/StatCard";

const stats = [
  {
    number: "2,500+",
    title: "People Assisted",
  },
  {
    number: "850+",
    title: "Active Volunteers",
  },
  {
    number: "120",
    title: "Relief Shelters",
  },
  {
    number: "< 5 min",
    title: "Average Response",
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-white">
          Impact at a Glance
        </h2>

        <p className="text-slate-400 mt-4">
          Real-time coordination that helps save lives.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            number={stat.number}
            title={stat.title}
          />
        ))}
      </div>
    </section>
  );
}