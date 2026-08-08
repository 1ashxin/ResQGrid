import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] px-6 text-white">

      <div className="max-w-lg text-center">

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20">

          <AlertTriangle
            size={50}
            className="text-red-300"
          />

        </div>

        <h1 className="text-7xl font-black text-white">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold">
          Page Not Found
        </h2>

        <p className="mt-5 text-lg text-slate-300">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-sky-500 px-8 py-4 text-lg font-semibold transition hover:bg-sky-400"
        >
          <ArrowLeft size={20} />
          Return Home
        </Link>

      </div>

    </main>
  );
}