import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import VictimHeader from "../../components/victim/VictimHeader";
import SOSCard from "../../components/victim/SOSCard";
import StatusCard from "../../components/victim/StatusCard";
import ActivityTimeline from "../../components/victim/ActivityTimeline";
import ResponderCard from "../../components/victim/ResponderCard";
import ResponseMap from "../../components/shared/ResponseMap";
import QuickieHelpCard from "../../components/victim/QuickieHelpCard";
import AlertCard from "../../components/victim/AlertCard";

import LocationPanel from "../../components/location/LocationPanel";
import LocationMap from "../../components/location/LocationMap";

export default function VictimDashboard() {
  const [userLocation, setUserLocation] = useState(null);

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

      <div className="mt-8">
        <div
          style={{
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "14px",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            background: "rgba(30, 41, 59, 0.65)",
          }}
        >
          <LocationPanel onLocationReceived={setUserLocation} />
        </div>
      </div>

      <div className="mt-8">
        <div
          style={{
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          }}
        >
          <LocationMap userLocation={userLocation} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <QuickieHelpCard />

        <AlertCard />

      </div>

    </DashboardLayout>
  );
}

  );
}