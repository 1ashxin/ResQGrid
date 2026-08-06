import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-24 px-6">

      <div className="max-w-6xl mx-auto bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-14 text-center">

        <h2 className="text-5xl font-bold text-white">
          Need Help Right Now?
        </h2>

        <p className="text-red-100 text-lg mt-6 mb-10">
          Every second matters during a disaster.
          Connect with nearby volunteers instantly.
        </p>

        <Link
          to="/victim"
          className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl hover:scale-105 transition inline-block"
        >
          Request Emergency Help
        </Link>

      </div>

    </section>
  );
}