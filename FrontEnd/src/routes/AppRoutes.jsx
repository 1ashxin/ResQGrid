import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import SOSRequest from "../pages/Victim/SOSRequest";
import VictimDashboard from "../pages/Victim/VictimDashboard";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Login from "../pages/Auth/Login";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/request"
        element={<SOSRequest />}
      />

      <Route
        path="/victim"
        element={<VictimDashboard />}
      />

      <Route
        path="/volunteer"
        element={<VolunteerDashboard />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}