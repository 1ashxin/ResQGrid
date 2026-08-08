import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import VictimDashboard from "../pages/Victim/VictimDashboard";
import SOSRequest from "../pages/Victim/SOSRequest";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/victim"
        element={<VictimDashboard />}
      />

      <Route
        path="/victim/request"
        element={<SOSRequest />}
      />

      <Route
        path="/volunteer"
        element={<VolunteerDashboard />}
      />

      {/* Admin Command Center */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />
    </Routes>
  );
}

export default AppRoutes;