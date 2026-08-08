import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

// Victim
import VictimDashboard from "../pages/Victim/VictimDashboard";
import SOSRequest from "../pages/Victim/SOSRequest";

// Volunteer
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";

// Admin
import AdminDashboard from "../pages/Admin/AdminDashboard";
import SOSRequests from "../pages/Admin/SOSRequests";
import Volunteers from "../pages/Admin/Volunteers";
import Shelters from "../pages/Admin/Shelters";
import Resources from "../pages/Admin/Resources";
import Notifications from "../pages/Admin/Notifications";
import AdminSearch from "../pages/Admin/AdminSearch";
import AdminProfile from "../pages/Admin/AdminProfile";

// Auth
import Login from "../pages/Auth/Login";

// 404
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          LANDING
      ========================= */}
      <Route
        path="/"
        element={<LandingPage />}
      />


      {/* =========================
          VICTIM
      ========================= */}
      <Route
        path="/victim"
        element={<VictimDashboard />}
      />

      <Route
        path="/victim/request"
        element={<SOSRequest />}
      />

      {/* =========================
          VOLUNTEER
      ========================= */}
      <Route
        path="/volunteer"
        element={<VolunteerDashboard />}
      />
      {/* =========================
      
      AUTH
      ========================= */}
      <Route
        path="/login"
        element={<Login />}
      />


      {/* =========================
          ADMIN
      ========================= */}

      {/* Main Admin Dashboard */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* SOS Requests */}
      <Route
        path="/admin/sos"
        element={<SOSRequests />}
      />

      {/* Volunteers */}
      <Route
        path="/admin/volunteers"
        element={<Volunteers />}
      />

      {/* Shelters */}
      <Route
        path="/admin/shelters"
        element={<Shelters />}
      />

      {/* Resources */}
      <Route
        path="/admin/resources"
        element={<Resources />}
      />

      {/* Notifications */}
      <Route
        path="/admin/notifications"
        element={<Notifications />}
      />

      {/* Search */}
      <Route
        path="/admin/search"
        element={<AdminSearch />}
      />

      {/* Admin Profile */}
      <Route
        path="/admin/profile"
        element={<AdminProfile />}
      />


      {/* =========================
          404
      ========================= */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;