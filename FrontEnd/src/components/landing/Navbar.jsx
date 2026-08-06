export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-xl font-bold">
            R
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              ResQGrid
            </h1>

            <p className="text-xs text-slate-400">
              Disaster Relief Network
            </p>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-slate-300">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#stats" className="hover:text-white transition">
            Statistics
          </a>

          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav>

        <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition">
          Emergency SOS
        </button>
      </div>
    </header>
  );
}