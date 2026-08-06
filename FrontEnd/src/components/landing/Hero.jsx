import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">

      <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm mb-6">
        Disaster Response Platform
      </span>

      <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
        Connecting
        <span className="text-red-500"> Victims </span>
        &
        <span className="text-blue-400"> Volunteers</span>
      </h1>

      <p className="text-slate-400 text-lg max-w-2xl mt-8 leading-8">
        Real-time disaster coordination platform helping victims,
        volunteers and NGOs communicate instantly during emergencies.
      </p>

      <div className="flex flex-col sm:flex-row gap-5 mt-12">

        <Link to="/victim">
          <Button>
            I'm a Victim
          </Button>
        </Link>

        <Link to="/volunteer">
          <Button variant="secondary">
            I'm a Volunteer
          </Button>
        </Link>

      </div>

    </section>
  );
}