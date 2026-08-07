import { useEffect, useState } from "react";

import VictimHeader from "../../components/victim/VictimHeader";
import SOSCard from "../../components/victim/SOSCard";
import StatusCard from "../../components/victim/StatusCard";
import QuickieHelpCard from "../../components/victim/QuickieHelpCard";
import AlertCard from "../../components/victim/AlertCard";

export default function VictimDashboard() {
  const [requestStatus, setRequestStatus] = useState("idle");

  const handleSOS = () => {
    if (requestStatus !== "idle") return;

    setRequestStatus("searching");
  };

  useEffect(() => {
    if (requestStatus === "searching") {
      const timer = setTimeout(() => {
        setRequestStatus("assigned");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#35506D] via-[#314B67] to-[#223449] px-6 py-10 text-white">

      <div className="mx-auto max-w-7xl">

        <VictimHeader />

        <div className="mt-10">
          <SOSCard
            status={requestStatus}
            onSend={handleSOS}
          />
        </div>

        <div className="mt-8">
          <StatusCard
            status={requestStatus}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <QuickieHelpCard />

          <AlertCard />

        </div>

      </div>

    </main>
  );
}