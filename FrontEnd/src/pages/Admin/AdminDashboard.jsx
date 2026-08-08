import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { listSOSRequests, listVolunteers, listShelters, listResources } from "../../api/client";
import { transformSOSRequest } from "../../utils/sos";
import {
  LayoutDashboard,
  Siren,
  Users,
  Building2,
  Package,
  MapPin,
  Bell,
  Search,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  UserRound,
  Droplets,
  Utensils,
  HeartPulse,
  Tent,
  Radio,
  X,
  Menu,
} from "lucide-react";

function transformVolunteer(volunteer, sosRequests) {
  const activeMission = sosRequests.find(
    (sos) => sos.assignedVolunteerId === volunteer.user_id
  );
  return {
    name: volunteer.full_name,
    location:
      volunteer.current_lat != null && volunteer.current_lng != null
        ? `${volunteer.current_lat.toFixed(3)}, ${volunteer.current_lng.toFixed(3)}`
        : "Unknown",
    status: volunteer.is_available ? "Available" : "On Mission",
    task: activeMission ? activeMission.id : "None",
  };
}

function transformShelter(shelter) {
  return {
    name: shelter.name,
    location: shelter.address || `${shelter.location_lat.toFixed(3)}, ${shelter.location_lng.toFixed(3)}`,
    capacity: shelter.capacity_total,
    occupied: shelter.capacity_occupied,
    status: shelter.is_active ? "Operational" : "Closed",
  };
}

// Icons are a display-only concept -- the backend just stores a name, so
// this maps known resource names to an icon, falling back to a generic
// box icon for anything an NGO/admin adds that isn't in this list.
const RESOURCE_ICONS = {
  "Drinking Water": Droplets,
  "Food Packets": Utensils,
  "Medical Kits": HeartPulse,
  "Emergency Tents": Tent,
};

const RESOURCE_STATUS_LABELS = {
  good: "Good",
  moderate: "Moderate",
  low: "Low",
};

function transformResource(resource) {
  return {
    id: resource.id,
    name: resource.name,
    icon: RESOURCE_ICONS[resource.name] || Package,
    quantity: `${Number(resource.quantity).toLocaleString()} ${resource.unit}`,
    status: RESOURCE_STATUS_LABELS[resource.status] || resource.status,
  };
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosRequests, setSosRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);
  const { isAdminLoggedIn, logout } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let cancelled = false;

    async function loadDashboardData(isInitialLoad) {
      try {
        const [rawSOS, rawVolunteers, rawShelters, rawResources] = await Promise.all([
          listSOSRequests(),
          listVolunteers(),
          listShelters(),
          listResources(),
        ]);
        if (cancelled) return;

        const transformedSOS = rawSOS.map(transformSOSRequest);
        setSosRequests(transformedSOS);
        setVolunteers(rawVolunteers.map((v) => transformVolunteer(v, transformedSOS)));
        setShelters(rawShelters.map(transformShelter));
        setResources(rawResources.map(transformResource));
      } catch {
        // Only surface a toast on the initial load, not on every failed
        // background refresh -- otherwise a down backend spams a new
        // toast every 15 seconds.
        if (!cancelled && isInitialLoad) {
          showToast("Couldn't load live data from the backend. Is it running?", "error");
        }
      }
    }

    loadDashboardData(true);
    const interval = setInterval(() => loadDashboardData(false), 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminLoggedIn]);

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

function handleLogout() {
  logout();
  navigate("/");
}

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "SOS Requests",
      icon: Siren,
    },
    {
      name: "Volunteers",
      icon: Users,
    },
    {
      name: "Shelters",
      icon: Building2,
    },
    {
      name: "Resources",
      icon: Package,
    },
  ];

  const criticalCount = sosRequests.filter(
    (item) => item.priority === "CRITICAL"
  ).length;

  const availableVolunteers = volunteers.filter(
    (item) => item.status === "Available"
  ).length;

  const totalCapacity = shelters.reduce(
    (total, shelter) => total + shelter.capacity,
    0
  );

  const occupiedCapacity = shelters.reduce(
    (total, shelter) => total + shelter.occupied,
    0
  );

  const shelterPercentage = Math.round(
    (occupiedCapacity / totalCapacity) * 100
  );

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#091522] px-5 lg:hidden">
        <div>
          <h1 className="text-xl font-bold">ResQGrid</h1>
          <p className="text-xs text-gray-500">Command Center</p>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-white/5"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-[#091522] p-6 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              ResQGrid
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Command Center
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* System Status */}
        <div className="mb-8 rounded-xl border border-green-500/20 bg-green-500/5 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <span className="text-xs font-medium text-green-400">
              SYSTEM OPERATIONAL
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            All monitoring systems active
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-red-500/15 text-red-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>

                {item.name === "SOS Requests" && (
                  <span className="ml-auto rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">
                    {sosRequests.length}
                  </span>
                )}
              </button>
            );
          })}

        </nav>

        {/* Bottom Admin Info */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15">
              <UserRound size={17} className="text-red-400" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Emergency Operations
              </p>
            </div>

          </div>

        </div>

      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">

        <div className="p-5 pt-24 sm:p-8 sm:pt-24 lg:p-8">

          {/* Header */}
          <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity size={15} className="text-green-400" />
                Emergency Operations
              </div>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Disaster Command Center
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Real-time overview of disaster response operations
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Notification */}
              <button className="relative rounded-xl border border-white/10 bg-[#0d1b2a] p-3 text-gray-400 hover:text-white">
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* Disaster Status */}
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3">
                <p className="text-[10px] font-medium tracking-wider text-gray-400">
                  ACTIVE DISASTER
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />

                  <p className="font-semibold text-red-400">
                    Flood Emergency
                  </p>
                </div>
              </div>

          {/* Logout */}
          <button
             onClick={handleLogout}
             className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
             Logout
          </button>
            </div>

          </header>

          {/* Search */}
          <div className="mb-6 flex items-center rounded-xl border border-white/10 bg-[#0d1b2a] px-4 py-3">

            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search SOS requests, volunteers, shelters..."
              className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />

          </div>

          {/* ================= STATISTICS ================= */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total SOS */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-400">
                  Total SOS
                </p>

                <div className="rounded-lg bg-red-500/10 p-2">
                  <Siren size={18} className="text-red-400" />
                </div>

              </div>

              <h3 className="mt-4 text-3xl font-bold">
                128
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-red-400">
                  +12
                </span>

                <span className="text-xs text-gray-500">
                  today
                </span>
              </div>

            </div>

            {/* Critical Cases */}
            <div className="rounded-2xl border border-red-500/20 bg-[#0d1b2a] p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-400">
                  Critical Cases
                </p>

                <div className="rounded-lg bg-red-500/10 p-2">
                  <AlertTriangle size={18} className="text-red-400" />
                </div>

              </div>

              <h3 className="mt-4 text-3xl font-bold text-red-400">
                23
              </h3>

              <p className="mt-2 text-xs text-gray-500">
                Need immediate action
              </p>

            </div>

            {/* Volunteers */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-400">
                  Active Volunteers
                </p>

                <div className="rounded-lg bg-green-500/10 p-2">
                  <Users size={18} className="text-green-400" />
                </div>

              </div>

              <h3 className="mt-4 text-3xl font-bold">
                67
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-green-400">
                  {availableVolunteers + 40}
                </span>

                <span className="text-xs text-gray-500">
                  available
                </span>
              </div>

            </div>

            {/* Shelter */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-400">
                  Shelter Capacity
                </p>

                <div className="rounded-lg bg-yellow-500/10 p-2">
                  <Building2 size={18} className="text-yellow-400" />
                </div>

              </div>

              <h3 className="mt-4 text-3xl font-bold">
                {shelterPercentage}%
              </h3>

              <p className="mt-2 text-xs text-yellow-400">
                {totalCapacity - occupiedCapacity} spaces available
              </p>

            </div>

          </section>

          {/* ================= MAP + ALERTS ================= */}

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Live Disaster Map */}
            <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Live Disaster Map
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    SOS requests and volunteer locations
                  </p>
                </div>

                <div className="flex gap-4 text-xs">
                  <span className="text-red-400">
                    ● Critical
                  </span>

                  <span className="text-yellow-400">
                    ● High
                  </span>

                  <span className="text-green-400">
                    ● Volunteer
                  </span>
                </div>

              </div>

              {/* Map */}
              <div className="relative mt-6 h-[360px] overflow-hidden rounded-xl border border-white/5 bg-[#081522]">

                {/* Grid */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* River */}
                <div className="absolute left-[45%] top-[-20px] h-[420px] w-16 rotate-[18deg] bg-blue-500/10 blur-sm" />

                {/* Areas */}
                <span className="absolute left-[18%] top-[22%] text-xs text-gray-500">
                  Kothrud
                </span>

                <span className="absolute left-[66%] top-[17%] text-xs text-gray-500">
                  Baner
                </span>

                <span className="absolute left-[28%] top-[69%] text-xs text-gray-500">
                  Aundh
                </span>

                <span className="absolute left-[69%] top-[68%] text-xs text-gray-500">
                  Shivajinagar
                </span>

                <span className="absolute left-[47%] top-[42%] text-xs text-gray-600">
                  Deccan
                </span>

                {/* Critical Marker 1 */}
                <div className="absolute left-[21%] top-[33%]">

                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold shadow-lg shadow-red-500/40">
                    SOS

                    <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
                  </div>

                </div>

                {/* Critical Marker 2 */}
                <div className="absolute left-[63%] top-[28%]">

                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold shadow-lg shadow-red-500/40">
                    SOS

                    <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
                  </div>

                </div>

                {/* High Priority */}
                <div className="absolute left-[35%] top-[63%]">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-black shadow-lg shadow-yellow-500/20">
                    !
                  </div>

                </div>

                {/* Volunteer */}
                <div className="absolute left-[54%] top-[48%]">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black shadow-lg shadow-green-500/20">
                    V
                  </div>

                </div>

                {/* Volunteer */}
                <div className="absolute left-[76%] top-[57%]">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black shadow-lg shadow-green-500/20">
                    V
                  </div>

                </div>

                {/* Live Status */}
                <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#07111f]/90 px-4 py-2 backdrop-blur">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                    <span className="text-xs text-gray-300">
                      Live monitoring active
                    </span>

                  </div>

                </div>

                {/* Map Controls */}
                <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/90">

                  <button className="px-3 py-2 text-lg text-gray-400 hover:bg-white/5 hover:text-white">
                    +
                  </button>

                  <div className="border-t border-white/10" />

                  <button className="px-3 py-2 text-lg text-gray-400 hover:bg-white/5 hover:text-white">
                    −
                  </button>

                </div>

              </div>

            </div>

            {/* Emergency Alerts */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Emergency Alerts
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Latest system notifications
                  </p>
                </div>

                <Bell size={19} className="text-gray-500" />

              </div>

              <div className="mt-6 space-y-3">

                <div className="rounded-xl border border-red-500/10 bg-red-500/10 p-4">

                  <div className="flex items-start gap-3">

                    <AlertTriangle
                      size={18}
                      className="mt-0.5 text-red-400"
                    />

                    <div>
                      <p className="font-medium text-red-400">
                        Critical SOS detected
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Kothrud · 2 min ago
                      </p>
                    </div>

                  </div>

                </div>

                <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/10 p-4">

                  <div className="flex items-start gap-3">

                    <Building2
                      size={18}
                      className="mt-0.5 text-yellow-400"
                    />

                    <div>
                      <p className="font-medium text-yellow-400">
                        Shelter nearing capacity
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Shelter B · 5 min ago
                      </p>
                    </div>

                  </div>

                </div>

                <div className="rounded-xl border border-orange-500/10 bg-orange-500/10 p-4">

                  <div className="flex items-start gap-3">

                    <Package
                      size={18}
                      className="mt-0.5 text-orange-400"
                    />

                    <div>
                      <p className="font-medium text-orange-400">
                        Medical supplies low
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Shelter C · 8 min ago
                      </p>
                    </div>

                  </div>

                </div>

                <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-4">

                  <div className="flex items-start gap-3">

                    <Radio
                      size={18}
                      className="mt-0.5 text-blue-400"
                    />

                    <div>
                      <p className="font-medium text-blue-400">
                        Response team deployed
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Baner · 12 min ago
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ================= SOS TABLE ================= */}

          <section className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-xl font-semibold">
                  Priority SOS Requests
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Requests requiring immediate attention
                </p>
              </div>

              <button
                onClick={() => handleNavigation("SOS Requests")}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium transition hover:bg-red-600"
              >
                View All
                <ChevronRight size={16} />
              </button>

            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">

              <table className="w-full min-w-[750px] text-left">

                <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">

                  <tr>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Request</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">People</th>
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-white/10">

                  {sosRequests.slice(0, 4).map((request) => (

                    <tr
                      key={request.id}
                      className="transition hover:bg-white/[0.025]"
                    >

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                            request.priority === "CRITICAL"
                              ? "bg-red-500/10 text-red-400"
                              : request.priority === "HIGH"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {request.priority}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <p className="font-medium">
                          {request.request}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {request.id}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={14} />
                          {request.location}
                        </div>

                      </td>

                      <td className="px-5 py-4">
                        {request.people}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {request.time}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`text-sm ${
                            request.status === "Assigned"
                              ? "text-green-400"
                              : request.status === "Unassigned"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {request.status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                          Details
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

          {/* ================= LOWER DASHBOARD ================= */}

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Volunteers */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Volunteer Operations
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Current response team status
                  </p>
                </div>

                <Users size={20} className="text-gray-500" />

              </div>

              <div className="mt-5 space-y-3">

                {volunteers.map((volunteer) => (

                  <div
                    key={volunteer.name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                        <UserRound
                          size={17}
                          className="text-green-400"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {volunteer.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={11} />
                          {volunteer.location}
                        </div>
                      </div>

                    </div>

                    <div className="text-right">

                      <span
                        className={`text-xs ${
                          volunteer.status === "Available"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {volunteer.status}
                      </span>

                      {volunteer.task !== "None" && (
                        <p className="mt-1 text-[10px] text-gray-600">
                          {volunteer.task}
                        </p>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* Shelters */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Shelter Capacity
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Current occupancy across shelters
                  </p>
                </div>

                <Building2 size={20} className="text-gray-500" />

              </div>

              <div className="mt-5 space-y-5">

                {shelters.map((shelter) => {

                  const percentage = Math.round(
                    (shelter.occupied / shelter.capacity) * 100
                  );

                  return (
                    <div key={shelter.name}>

                      <div className="mb-2 flex items-center justify-between">

                        <div>
                          <p className="text-sm font-medium">
                            {shelter.name}
                          </p>

                          <p className="text-xs text-gray-600">
                            {shelter.location}
                          </p>
                        </div>

                        <span
                          className={`text-xs ${
                            percentage >= 85
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {shelter.occupied}/{shelter.capacity}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/5">

                        <div
                          className={`h-full rounded-full ${
                            percentage >= 85
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>

          {/* ================= RESOURCE TRACKER ================= */}

          <section className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-semibold">
                  Resource Tracker
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Current emergency supply levels
                </p>
              </div>

              <Package size={20} className="text-gray-500" />

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {resources.map((resource) => {

                const Icon = resource.icon;

                return (
                  <div
                    key={resource.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="rounded-lg bg-blue-500/10 p-2.5">
                        <Icon
                          size={19}
                          className="text-blue-400"
                        />
                      </div>

                      <span
                        className={`text-xs ${
                          resource.status === "Low"
                            ? "text-red-400"
                            : resource.status === "Moderate"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {resource.status}
                      </span>

                    </div>

                    <p className="mt-5 text-sm text-gray-400">
                      {resource.name}
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {resource.quantity}
                    </p>

                  </div>
                );
              })}

            </div>

          </section>

          {/* Footer */}
          <footer className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">

            <p>
              ResQGrid Emergency Operations Platform
            </p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              All systems operational
              <span>•</span>
              Last updated just now
            </div>

          </footer>

        </div>

      </main>

      {/* ================= REQUEST DETAILS MODAL ================= */}

      {selectedRequest && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1b2a] p-6 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs text-gray-500">
                  {selectedRequest.id}
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  SOS Request Details
                </h3>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">

                <p className="text-xs text-gray-500">
                  PRIORITY
                </p>

                <p className="mt-1 font-semibold text-red-400">
                  {selectedRequest.priority}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-gray-500">
                    REQUEST
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedRequest.request}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-gray-500">
                    PEOPLE
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedRequest.people}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-gray-500">
                    LOCATION
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <MapPin size={14} />
                    {selectedRequest.location}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-gray-500">
                    STATUS
                  </p>

                  <p className="mt-1 text-sm font-medium text-yellow-400">
                    {selectedRequest.status}
                  </p>
                </div>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium hover:bg-red-600"
                >
                  Assign Response Team
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;