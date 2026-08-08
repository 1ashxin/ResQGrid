import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import IndividualForm from "../../components/volunteer/IndividualForm";

export default function IndividualSignup() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>

      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-secondary transition hover:text-brand"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <section className="text-center">

        <p className="section-label text-sm">
          Volunteer Registration
        </p>

        <h1 className="mt-3 text-5xl font-bold text-primary">
          Individual Volunteer
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Join ResQGrid as an individual volunteer and help communities
          during emergencies. Your skills and availability will help us
          connect you with people who need assistance the most.
        </p>

      </section>

      <div className="mx-auto mt-12 max-w-4xl">

        <IndividualForm />

      </div>

    </DashboardLayout>
  );
}