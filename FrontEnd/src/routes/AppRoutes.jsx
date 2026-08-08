import { Routes, Route } from "react-router-dom";

import SOSRequest from "../pages/Victim/SOSRequest";
import Login from "../pages/Auth/Login";
import NotFound from "../pages/NotFound";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SOSRequest />} />

      <Route path="/login" element={<Login />} />

      <Route path="/request" element={<SOSRequest />} />

      <Route
        path="/victim"
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}