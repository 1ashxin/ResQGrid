import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import VictimDashboard from "../pages/Victim/VictimDashboard";
import SOSRequest from "../pages/Victim/SOSRequest";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";

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
    </Routes>
  );
}

export default AppRoutes;