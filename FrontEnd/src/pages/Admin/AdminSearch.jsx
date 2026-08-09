import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const data = [
  "SOS-1028 · Medical Emergency · Kothrud",
  "SOS-1027 · Trapped Person · Baner",
  "Rahul Sharma · Medical Volunteer",
  "Priya Mehta · Rescue Team",
  "Shelter A · Kothrud",
  "Shelter B · Baner",
  "Medical Kits · Low Stock",
  "Drinking Water · 820 litres",
];

function AdminSearch() {

  const [query, setQuery] = useState("");

  const results = data.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Command Center
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Search
        </h1>

        <p className="mt-2 text-gray-400">
          Search SOS requests, volunteers, shelters and resources.
        </p>


        <div className="mt-8 max-w-3xl">

          <input
            type="text"
            placeholder="Search ResQGrid..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0d1b2a] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-red-500/50"
          />


          <div className="mt-5 space-y-3">

            {query === "" ? (

              <div className="rounded-xl border border-white/10 bg-[#0d1b2a] p-6 text-gray-400">
                Start typing to search the command center.
              </div>

            ) : results.length === 0 ? (

              <div className="rounded-xl border border-white/10 bg-[#0d1b2a] p-6 text-gray-400">
                No results found.
              </div>

            ) : (

              results.map((result) => (

                <div
                  key={result}
                  className="rounded-xl border border-white/10 bg-[#0d1b2a] p-5 hover:bg-white/[0.03]"
                >
                  {result}
                </div>

              ))

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminSearch;