import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import SearchResultCard from "../../components/search/SearchResultCard";

export default function Search() {
  const [query, setQuery] = useState("");

  const results = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Volunteer",
      location: "Navi Mumbai",
      status: "Available",
    },
    {
      id: 2,
      name: "Helping Hands Foundation",
      role: "NGO",
      location: "Mumbai",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Verma",
      role: "Victim",
      location: "Thane",
      status: "Awaiting Help",
    },
    {
      id: 4,
      name: "Amit Patel",
      role: "Volunteer",
      location: "Panvel",
      status: "Assigned",
    },
    {
      id: 5,
      name: "Relief First NGO",
      role: "NGO",
      location: "Pune",
      status: "Operational",
    },
  ];

  const filteredResults = results.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Search
          </h1>

          <p className="mt-2 text-secondary">
            Search volunteers, NGOs and victims across ResQGrid.
          </p>

        </div>

        {/* Search Bar */}

        <div className="card-glass mb-8 rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <SearchIcon
              size={22}
              className="text-secondary"
            />

            <input
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-primary outline-none placeholder:text-secondary"
            />

          </div>

        </div>

        {/* Results */}

        <div className="space-y-5">

          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <SearchResultCard
                key={item.id}
                {...item}
              />
            ))
          ) : (
            <div className="card-glass rounded-2xl p-10 text-center">

              <h3 className="text-xl font-semibold text-primary">
                No Results Found
              </h3>

              <p className="mt-2 text-secondary">
                Try searching for another volunteer, NGO or victim.
              </p>

            </div>
          )}

        </div>

      </section>
    </DashboardLayout>
  );
}