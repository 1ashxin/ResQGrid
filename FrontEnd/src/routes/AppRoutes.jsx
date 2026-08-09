import { Routes, Route } from "react-router-dom";

// Landing
import LandingPage from "../pages/LandingPage";

// Victim
import VictimDashboard from "../pages/Victim/VictimDashboard";
import SOSRequest from "../pages/Victim/SOSRequest";

// Volunteer
import VolunteerPortal from "../pages/Volunteer/VolunteerPortal";
import VolunteerLogin from "../pages/Volunteer/VolunteerLogin";
import IndividualSignup from "../pages/Volunteer/IndividualSignup";
import NGOSignup from "../pages/Volunteer/NGOSignup";
import VolunteerDashboard from "../pages/Volunteer/VolunteerDashboard";

// NGO
import NGODashboard from "../pages/NGO/NGODashboard";

// Admin
import Login from "../pages/Auth/Login";
import AdminDashboard from "../pages/Admin/AdminDashboard";

// Shared
import Profile from "../pages/Shared/Profile";

// Misc
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
        path="/victim"
        element={<VictimDashboard />}
      />

      <Route
        path="/victim/request"
        element={<SOSRequest />}
      />

      {/* Volunteer */}
      <Route
        path="/volunteer"
        element={<VolunteerPortal />}
      />

      <Route
        path="/volunteer/login"
        element={<VolunteerLogin />}
      />

      <Route
        path="/volunteer/register/individual"
        element={<IndividualSignup />}
      />

      <Route
        path="/volunteer/register/ngo"
        element={<NGOSignup />}
      />

      <Route
        path="/volunteer/dashboard"
        element={<VolunteerDashboard />}
      />

      {/* NGO */}
      <Route
        path="/ngo/dashboard"
        element={<NGODashboard />}
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

      {/* Shared */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}