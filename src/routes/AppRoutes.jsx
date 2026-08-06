import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import VictimDashboard from "../pages/Victim/VictimDashboard";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/victim" element={<VictimDashboard />} />
      <Route path="/volunteer" element={<VolunteerDashboard />} />
    </Routes>
  );
}

export default AppRoutes;