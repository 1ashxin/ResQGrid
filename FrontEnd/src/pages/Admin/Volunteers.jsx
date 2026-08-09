import AdminSidebar from "../../components/AdminSidebar";

const volunteers = [
  {
    name: "Rahul Sharma",
    role: "Medical Volunteer",
    location: "Kothrud",
    status: "Available",
    task: "None",
  },
  {
    name: "Priya Mehta",
    role: "Rescue Team",
    location: "Baner",
    status: "On Duty",
    task: "SOS-1027",
  },
  {
    name: "Arjun Patil",
    role: "Relief Volunteer",
    location: "Aundh",
    status: "Available",
    task: "None",
  },
  {
    name: "Sneha Kulkarni",
    role: "Medical Volunteer",
    location: "Wakad",
    status: "On Duty",
    task: "SOS-1025",
  },
];

function Volunteers() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Operations
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Volunteers
        </h1>

        <p className="mt-2 text-gray-400">
          Monitor volunteer availability and assignments.
        </p>


        <div className="mt-8 grid grid-cols-3 gap-5">

          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
            <p className="text-gray-400">Total Volunteers</p>
            <h2 className="mt-2 text-3xl font-bold">67</h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-gray-400">Available</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              42
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-gray-400">On Duty</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              25
            </h2>
          </div>

        </div>


        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

          <h2 className="text-xl font-semibold">
            Volunteer Directory
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">

            <table className="w-full text-left">

              <thead className="bg-white/5 text-sm text-gray-400">

                <tr>
                  <th className="px-5 py-4">Volunteer</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Current Task</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-white/10">

                {volunteers.map((volunteer) => (

                  <tr key={volunteer.name}>

                    <td className="px-5 py-4 font-medium">
                      {volunteer.name}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {volunteer.role}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {volunteer.location}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          volunteer.status === "Available"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        ● {volunteer.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {volunteer.task}
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

export default Volunteers;