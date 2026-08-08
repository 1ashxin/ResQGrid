import AdminSidebar from "../../components/AdminSidebar";

const notifications = [
  {
    title: "Critical SOS detected",
    description: "Medical emergency reported in Kothrud.",
    time: "2 minutes ago",
    type: "critical",
  },
  {
    title: "Shelter nearing capacity",
    description: "Shelter B has reached 91% occupancy.",
    time: "5 minutes ago",
    type: "warning",
  },
  {
    title: "Medical supplies running low",
    description: "Shelter C requires additional medical kits.",
    time: "8 minutes ago",
    type: "warning",
  },
  {
    title: "Volunteer assigned",
    description: "Priya Mehta assigned to SOS-1027.",
    time: "12 minutes ago",
    type: "success",
  },
];

function Notifications() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      <AdminSidebar />

      <main className="ml-64 p-8">

        <p className="text-sm text-gray-400">
          Command Center
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Notifications
        </h1>

        <p className="mt-2 text-gray-400">
          Important system and emergency alerts.
        </p>


        <div className="mt-8 max-w-4xl space-y-4">

          {notifications.map((notification, index) => (

            <div
              key={index}
              className={`rounded-2xl border p-6 ${
                notification.type === "critical"
                  ? "border-red-500/20 bg-red-500/5"
                  : notification.type === "warning"
                  ? "border-yellow-500/20 bg-yellow-500/5"
                  : "border-green-500/20 bg-green-500/5"
              }`}
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="font-semibold">
                    {notification.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {notification.description}
                  </p>

                </div>

                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Notifications;