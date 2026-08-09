import AdminSidebar from "../../components/AdminSidebar";

const shelters = [
  {
    name: "Shelter A",
    location: "Kothrud",
    capacity: 500,
    occupied: 320,
    status: "Operational",
  },
  {
    name: "Shelter B",
    location: "Baner",
    capacity: 400,
    occupied: 365,
    status: "Near Capacity",
  },
  {
    name: "Shelter C",
    location: "Aundh",
    capacity: 300,
    occupied: 180,
    status: "Operational",
  },
  {
    name: "Shelter D",
    location: "Shivajinagar",
    capacity: 250,
    occupied: 250,
    status: "Full",
  },
];

function Shelters() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Relief Infrastructure
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Shelters
        </h1>

        <p className="mt-2 text-gray-400">
          Monitor shelter capacity and availability.
        </p>


        <div className="mt-8 grid grid-cols-3 gap-5">

          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
            <p className="text-gray-400">Total Shelters</p>
            <h2 className="mt-2 text-3xl font-bold">12</h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-gray-400">Available Spaces</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              234
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-gray-400">Overall Occupancy</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              72%
            </h2>
          </div>

        </div>


        <div className="mt-8 grid grid-cols-2 gap-5">

          {shelters.map((shelter) => {

            const percentage =
              Math.round(
                (shelter.occupied / shelter.capacity) * 100
              );

            return (
              <div
                key={shelter.name}
                className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-semibold">
                      {shelter.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      {shelter.location}
                    </p>
                  </div>

                  <span
                    className={
                      shelter.status === "Full"
                        ? "text-red-400"
                        : shelter.status === "Near Capacity"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    ● {shelter.status}
                  </span>

                </div>


                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-gray-400">
                      Occupancy
                    </span>

                    <span>
                      {shelter.occupied} / {shelter.capacity}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className={`h-full rounded-full ${
                        percentage >= 90
                          ? "bg-red-500"
                          : percentage >= 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-right text-sm text-gray-400">
                    {percentage}% occupied
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </main>

    </div>
  );
}

export default Shelters;