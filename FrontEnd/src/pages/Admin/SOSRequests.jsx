import AdminSidebar from "../../components/AdminSidebar";

const requests = [
  {
    id: "SOS-1028",
    priority: "CRITICAL",
    request: "Medical Emergency",
    location: "Kothrud",
    people: 4,
    status: "Unassigned",
  },
  {
    id: "SOS-1027",
    priority: "CRITICAL",
    request: "Trapped Person",
    location: "Baner",
    people: 2,
    status: "Assigned",
  },
  {
    id: "SOS-1026",
    priority: "HIGH",
    request: "Food & Water",
    location: "Aundh",
    people: 6,
    status: "Pending",
  },
  {
    id: "SOS-1025",
    priority: "HIGH",
    request: "Evacuation",
    location: "Shivajinagar",
    people: 8,
    status: "Assigned",
  },
  {
    id: "SOS-1024",
    priority: "MEDIUM",
    request: "Food Supplies",
    location: "Wakad",
    people: 5,
    status: "Resolved",
  },
];

function SOSRequests() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Emergency Operations
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          SOS Requests
        </h1>

        <p className="mt-2 text-gray-400">
          Monitor and manage incoming emergency requests.
        </p>


        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-5">

          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
            <p className="text-gray-400">Total Requests</p>
            <h2 className="mt-2 text-3xl font-bold">128</h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-gray-400">Critical</p>
            <h2 className="mt-2 text-3xl font-bold text-red-400">23</h2>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-gray-400">Pending</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">31</h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-gray-400">Resolved</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">74</h2>
          </div>

        </div>


        {/* Table */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Incoming Requests
            </h2>

            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
              Filter
            </button>

          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">

            <table className="w-full text-left">

              <thead className="bg-white/5 text-sm text-gray-400">

                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Request</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">People</th>
                  <th className="px-5 py-4">Status</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-white/10">

                {requests.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02]"
                  >

                    <td className="px-5 py-4 text-gray-400">
                      {item.id}
                    </td>

                    <td
                      className={`px-5 py-4 font-medium ${
                        item.priority === "CRITICAL"
                          ? "text-red-400"
                          : item.priority === "HIGH"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {item.priority}
                    </td>

                    <td className="px-5 py-4">
                      {item.request}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {item.location}
                    </td>

                    <td className="px-5 py-4">
                      {item.people}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-sm">
                        {item.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default SOSRequests;