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

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Incoming Requests
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Nearby Emergencies
          </h2>

        </div>

        {requestStatus === "idle" && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">

            <CheckCircle2
              size={60}
              className="mx-auto text-emerald-300"
            />

            <h3 className="mt-6 text-3xl font-bold">
              No Active Requests
            </h3>

            <p className="mt-3 text-slate-300">
              New SOS requests will automatically appear here.
            </p>

          </div>

        )}

        {requestStatus !== "idle" && requestData && (

          <div className="rounded-3xl border border-red-400/20 bg-white/5 p-8 backdrop-blur-xl">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="rounded-3xl bg-red-500/15 p-5">

                  <Flame
                    size={36}
                    className="text-red-300"
                  />

                </div>

                <div>

                  <h2 className="text-3xl font-bold">
                    {requestData.emergency}
                  </h2>

                  <p className="mt-2 text-slate-300">
                    High Priority Emergency
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-red-500/20 px-5 py-2 font-semibold text-red-300">
                HIGH
              </div>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <InfoCard
                icon={<Users className="text-sky-300" />}
                title="People Requiring Help"
                value={requestData.people || "1"}
              />

              <InfoCard
                icon={<MapPin className="text-red-300" />}
                title="Location"
                value={requestData.location}
              />

              <InfoCard
                icon={<Phone className="text-emerald-300" />}
                title="Contact Number"
                value={requestData.phone}
              />

              <InfoCard
                title="Victim Name"
                value={requestData.name}
              />

            </div>

            {requestData.notes && (

              <div className="mt-8 rounded-2xl bg-white/5 p-6">

                <p className="text-sm text-slate-400">
                  Situation Details
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  {requestData.notes}
                </p>

              </div>

            )}

            {requestStatus === "searching" && (

              <button
                onClick={handleAccept}
                className="mt-10 w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-400"
              >
                Accept Request
              </button>

            )}

            {requestStatus === "assigned" && (

              <div className="mt-10 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-center">

                <CheckCircle2
                  size={42}
                  className="mx-auto text-emerald-300"
                />

                <h3 className="mt-4 text-2xl font-bold">
                  Request Accepted
                </h3>

                <p className="mt-2 text-slate-300">
                  The victim has been notified that you're on the way.
                </p>

              </div>

            )}

          </div>

        )}

      </section>

      {/* Live Response Map */}
      <div className="mt-12">
        <ResponseMap />
      </div>

    </DashboardLayout>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6">

      {icon && <div className="mb-3">{icon}</div>}

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-white">
        {value}
      </h3>

    </div>
  );
}