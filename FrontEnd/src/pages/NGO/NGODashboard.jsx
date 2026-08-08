import DashboardLayout from "../../layouts/DashboardLayout";

import NGOHeader from "../../components/ngo/NGOHeader";
import NGOStats from "../../components/ngo/NGOStats";
import NGORequestCard from "../../components/ngo/NGORequestCard";
import NGOInventory from "../../components/ngo/NGOInventory";
import VolunteerManagement from "../../components/ngo/VolunteerManagement";
import ReliefCampCard from "../../components/ngo/ReliefCampCard";
import NGOAnalytics from "../../components/ngo/NGOAnalytics";

export default function NGODashboard() {
  return (
    <DashboardLayout>

      <NGOHeader />

      <NGOStats />

      <NGORequestCard />

      <NGOInventory />

      <VolunteerManagement />

      <ReliefCampCard />

      <NGOAnalytics />

    </DashboardLayout>
  );
}