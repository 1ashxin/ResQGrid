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

      <div className="mt-10">
        <SOSCard />
      </div>

      <div className="mt-8">
        <StatusCard />
      </div>

      <ActivityTimeline />

      <ResponderCard />

      <div className="mt-8">
        <ResponseMap />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <QuickieHelpCard />

        <AlertCard />

      </div>

    </DashboardLayout>
  );
}