import DashboardLayout from "../../layouts/DashboardLayout";

import VolunteerHeader from "../../components/volunteer/VolunteerHeader";
import VolunteerStats from "../../components/volunteer/VolunteerStats";
import ResponseMap from "../../components/shared/ResponseMap";

import {
  Users,
  MapPin,
  Phone,
  Flame,
  CheckCircle2,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";
import { useNotification } from "../../context/NotificationContext";

export default function VolunteerDashboard() {
  const {
    requestStatus,
    requestData,
    setRequestStatus,
  } = useRequest();

  const { showToast } = useNotification();

  function handleAccept() {
    setRequestStatus("assigned");

    showToast(
      "You have accepted the emergency request.",
      "success"
    );
  }

  return (
    <DashboardLayout>

      <VolunteerHeader />

      <VolunteerStats />

      {/* Incoming Requests */}
      <section className="mt-10">

        <div className="mb-8">

          <p className="section-label text-sm">
            Incoming Requests
          </p>

          <h2 className="section-title mt-2 text-4xl">
            Nearby Emergencies
          </h2>

        </div>

        {requestStatus === "idle" && (

          <div className="card-glass rounded-3xl p-12 text-center">

            <CheckCircle2
              size={60}
              className="mx-auto text-success"
            />

            <h3 className="section-title mt-6 text-3xl">
              No Active Requests
            </h3>

            <p className="section-subtitle mt-3">
              New SOS requests will automatically appear here.
            </p>

          </div>

        )}

        {requestStatus !== "idle" && requestData && (

          <div className="card-glass rounded-3xl p-8">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="card-glass rounded-3xl p-5">

                  <Flame
                    size={36}
                    className="text-danger"
                  />

                </div>

                <div>

                  <h2 className="section-title text-3xl">
                    {requestData.emergency}
                  </h2>

                  <p className="section-subtitle mt-2">
                    High Priority Emergency
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-danger px-5 py-2 font-semibold text-primary">
                HIGH
              </div>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <InfoCard
                icon={<Users className="text-brand" />}
                title="People Requiring Help"
                value={requestData.people || "1"}
              />

              <InfoCard
                icon={<MapPin className="text-danger" />}
                title="Location"
                value={requestData.location}
              />

              <InfoCard
                icon={<Phone className="text-success" />}
                title="Contact Number"
                value={requestData.phone}
              />

              <InfoCard
                title="Victim Name"
                value={requestData.name}
              />

            </div>

            {requestData.notes && (

              <div className="card-glass mt-8 rounded-2xl p-6">

                <p className="text-muted text-sm">
                  Situation Details
                </p>

                <p className="section-subtitle mt-3 leading-7">
                  {requestData.notes}
                </p>

              </div>

            )}

            {requestStatus === "searching" && (

              <button
                onClick={handleAccept}
                className="btn-success mt-10 w-full rounded-2xl py-4 text-lg font-semibold transition-all duration-300 hover:scale-[1.01]"
              >
                Accept Request
              </button>

            )}

            {requestStatus === "assigned" && (

              <div className="card-glass mt-10 rounded-2xl p-6 text-center">

                <CheckCircle2
                  size={42}
                  className="mx-auto text-success"
                />

                <h3 className="section-title mt-4 text-2xl">
                  Request Accepted
                </h3>

                <p className="section-subtitle mt-2">
                  The victim has been notified that you're on the way.
                </p>

              </div>

            )}

          </div>

        )}

      </section>

      {/* Live Response Map */}

      <section className="mt-12">

        <ResponseMap />

      </section>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="card-glass rounded-2xl p-6">

      {icon && <div className="mb-3">{icon}</div>}

      <p className="text-muted text-sm">
        {title}
      </p>

      <h3 className="section-title mt-2 text-xl">
        {value}
      </h3>

    </div>
  );
}