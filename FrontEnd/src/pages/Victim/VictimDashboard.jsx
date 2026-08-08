import DashboardLayout from "../../layouts/DashboardLayout";

import VictimHeader from "../../components/victim/VictimHeader";
import SOSCard from "../../components/victim/SOSCard";
import StatusCard from "../../components/victim/StatusCard";
import ActivityTimeline from "../../components/victim/ActivityTimeline";
import ResponderCard from "../../components/victim/ResponderCard";
import ResponseMap from "../../components/shared/ResponseMap";
import QuickieHelpCard from "../../components/victim/QuickieHelpCard";
import AlertCard from "../../components/victim/AlertCard";

export default function VictimDashboard() {
  return (
    <DashboardLayout>

      <VictimHeader />

      {/* Emergency Request */}
      <section className="mt-10">
        <SOSCard />
      </section>

      {/* Request Status */}
      <section className="mt-8">
        <StatusCard />
      </section>

      {/* Live Activity Timeline */}
      <section className="mt-8">
        <ActivityTimeline />
      </section>

      {/* Assigned Responder */}
      <section className="mt-8">
        <ResponderCard />
      </section>

      {/* Live Response Map */}
      <section className="mt-8">
        <ResponseMap />
      </section>

      {/* Quick Actions + Alerts */}
      <section className="mt-8 grid gap-8 lg:grid-cols-2">

        <QuickieHelpCard />

        <AlertCard />

      </section>

    </DashboardLayout>
  );
}