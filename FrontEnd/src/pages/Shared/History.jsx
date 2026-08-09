import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryCard from "../../components/history/HistoryCard";

export default function History() {

  const history = [
    {
      id: 1,
      title: "Flood SOS Request",
      description: "Emergency request submitted for Sector 12.",
      date: "Today • 9:45 AM",
      status: "Completed",
    },
    {
      id: 2,
      title: "Medical Supply Delivery",
      description: "Relief kits delivered to Camp Alpha.",
      date: "Yesterday • 4:20 PM",
      status: "Completed",
    },
    {
      id: 3,
      title: "Volunteer Assignment",
      description: "Assigned to assist at Flood Relief Camp.",
      date: "Yesterday • 11:15 AM",
      status: "Pending",
    },
    {
      id: 4,
      title: "Food Distribution Drive",
      description: "Community meal service completed.",
      date: "2 Days Ago",
      status: "Completed",
    },
    {
      id: 5,
      title: "Emergency Shelter Setup",
      description: "Temporary shelter preparation in progress.",
      date: "3 Days Ago",
      status: "In Progress",
    },
  ];

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Activity History
          </h1>

          <p className="mt-2 text-secondary">
            Review your recent requests, missions and activities.
          </p>

        </div>

        {/* Timeline */}

        <div className="space-y-5">

          {history.map((item) => (

            <HistoryCard
              key={item.id}
              {...item}
            />

          ))}

        </div>

      </section>

    </DashboardLayout>
  );
}