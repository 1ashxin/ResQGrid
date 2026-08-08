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
      {/* Landing */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Victim */}
      <Route
        path="/victim/request"
        element={<SOSRequest />}
      />

      <Route
        path="/victim"
        element={<VictimDashboard />}
      />

      {/* Volunteer */}
      <Route
        path="/volunteer"
        element={<VolunteerDashboard />}
      />

      {/* Admin */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}