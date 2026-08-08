import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import VolunteerHeader from "../../components/volunteer/VolunteerHeader";
import VolunteerStats from "../../components/volunteer/VolunteerStats";
import RequestCard from "../../components/volunteer/RequestCard";

import ResponseMap from "../../components/shared/ResponseMap";

import {
  Users,
  MapPin,
  Phone,
  Flame,
  CheckCircle2,
} from "lucide-react";

import { useNotification } from "../../context/NotificationContext";

const dummyRequests = [
  {
    id: 1,
    emergency: "Flood Emergency",
    location: "Sector 12, Navi Mumbai",
    people: 24,
    phone: "+91 98765 43210",
    priority: "High",
    distance: "2.4 km",
    time: "5 mins ago",
    notes:
      "Water level rising rapidly. Families stranded on upper floors.",
  },
  {
    id: 2,
    emergency: "Medical Emergency",
    location: "Vashi",
    people: 2,
    phone: "+91 99887 65432",
    priority: "Medium",
    distance: "4.1 km",
    time: "12 mins ago",
    notes:
      "Elderly person requires immediate medical assistance.",
  },
  {
    id: 3,
    emergency: "Food & Water",
    location: "Panvel",
    people: 18,
    phone: "+91 97654 32109",
    priority: "Low",
    distance: "6.2 km",
    time: "20 mins ago",
    notes:
      "Relief supplies requested for temporary shelter.",
  },
];

export default function VolunteerDashboard() {
  const [activeMission, setActiveMission] = useState(null);

  const { showToast } = useNotification();

  function handleAccept(request) {
    setActiveMission(request);

    showToast(
      "Emergency request accepted successfully.",
      "success"
    );
  }

  return (
    <DashboardLayout>

      <VolunteerHeader />

      <VolunteerStats />

      <section className="mt-12">

        {!activeMission && (

          <>
            <div className="mb-8">

              <p className="text-brand text-sm font-semibold uppercase tracking-[0.25em]">
                Incoming Requests
              </p>

              <h2 className="mt-2 text-4xl font-bold text-primary">
                Nearby Emergencies
              </h2>

            </div>

            <div className="space-y-6">

              {dummyRequests.map((request) => (

                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                />

              ))}

            </div>

          </>

        )}

        {activeMission && (

          <div className="card-glass rounded-3xl p-8">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="rounded-3xl bg-danger p-5">

                  <Flame
                    size={36}
                    className="text-white"
                  />

                </div>

                <div>

                  <p className="text-brand text-sm uppercase tracking-[0.25em]">
                    Current Mission
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-primary">
                    {activeMission.emergency}
                  </h2>

                  <p className="mt-2 text-secondary">
                    You have accepted this emergency request.
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-success px-5 py-2 font-semibold text-white">

                Assigned

              </div>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <InfoCard
                icon={<Users className="text-brand" />}
                title="People Requiring Help"
                value={activeMission.people}
              />

              <InfoCard
                icon={<MapPin className="text-danger" />}
                title="Location"
                value={activeMission.location}
              />

              <InfoCard
                icon={<Phone className="text-success" />}
                title="Contact Number"
                value={activeMission.phone}
              />

              <InfoCard
                title="Priority"
                value={activeMission.priority}
              />

            </div>

            <div className="mt-8 rounded-2xl bg-card p-6">

              <p className="text-sm text-muted">
                Situation Details
              </p>

              <p className="mt-3 leading-7 text-secondary">
                {activeMission.notes}
              </p>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <button className="btn-success rounded-2xl py-4 font-semibold">

                Call Victim

              </button>

              <button className="btn-primary rounded-2xl py-4 font-semibold">

                Navigate

              </button>

            </div>

            <button
              onClick={() => {
                setActiveMission(null);

                showToast(
                  "Mission marked as completed.",
                  "success"
                );
              }}
              className="btn-danger mt-6 w-full rounded-2xl py-4 font-semibold"
            >

              Complete Mission

            </button>

          </div>

        )}

      </section>

      <div className="mt-12">

        <ResponseMap />

      </div>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-card rounded-2xl p-5">

      {icon && <div className="mb-3">{icon}</div>}

      <p className="text-sm text-muted">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-primary">
        {value}
      </h3>

    </div>
  );
}