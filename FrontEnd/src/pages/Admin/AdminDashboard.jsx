import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  AlertTriangle,
  UserRound,
  Droplets,
  Utensils,
  HeartPulse,
  Tent,
  Radio,
  X,
  Menu,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAdminLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  //if (!isAdminLoggedIn) {
  //  return <Navigate to="/login" replace />;
  //}

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

  const sosRequests = [
    {
      id: "SOS-1028",
      priority: "CRITICAL",
      request: "Medical emergency",
      location: "Kothrud",
      people: 4,
      status: "Unassigned",
      time: "2 min ago",
    },
    {
      id: "SOS-1027",
      priority: "CRITICAL",
      request: "Trapped person",
      location: "Baner",
      people: 2,
      status: "Assigned",
      time: "5 min ago",
    },
    {
      id: "SOS-1026",
      priority: "HIGH",
      request: "Food & Water",
      location: "Aundh",
      people: 6,
      status: "Pending",
      time: "8 min ago",
    },
    {
      id: "SOS-1025",
      priority: "HIGH",
      request: "Medical supplies",
      location: "Shivajinagar",
      people: 3,
      status: "Assigned",
      time: "11 min ago",
    },
    {
      id: "SOS-1024",
      priority: "MEDIUM",
      request: "Shelter required",
      location: "Deccan",
      people: 5,
      status: "Pending",
      time: "15 min ago",
    },
    {
      id: "SOS-1023",
      priority: "CRITICAL",
      request: "Child trapped",
      location: "Warje",
      people: 3,
      status: "Unassigned",
      time: "18 min ago",
    },
  ];

  const volunteers = [
    {
      name: "Rahul Sharma",
      location: "Kothrud",
      status: "Available",
      task: "None",
      phone: "+91 98XXXXXX21",
    },
    {
      name: "Priya Patil",
      location: "Baner",
      status: "On Mission",
      task: "SOS-1027",
      phone: "+91 97XXXXXX42",
    },
    {
      name: "Aditya Joshi",
      location: "Aundh",
      status: "Available",
      task: "None",
      phone: "+91 96XXXXXX18",
    },
    {
      name: "Sneha Kulkarni",
      location: "Shivajinagar",
      status: "On Mission",
      task: "SOS-1025",
      phone: "+91 95XXXXXX77",
    },
    {
      name: "Arjun Mehta",
      location: "Deccan",
      status: "Available",
      task: "None",
      phone: "+91 94XXXXXX35",
    },
    {
      name: "Riya Deshmukh",
      location: "Warje",
      status: "Offline",
      task: "None",
      phone: "+91 93XXXXXX12",
    },
  ];

  const shelters = [
    {
      name: "Shelter A",
      location: "Kothrud",
      capacity: 300,
      occupied: 214,
      status: "Operational",
    },
    {
      name: "Shelter B",
      location: "Baner",
      capacity: 250,
      occupied: 218,
      status: "Near Capacity",
    },
    {
      name: "Shelter C",
      location: "Aundh",
      capacity: 400,
      occupied: 247,
      status: "Operational",
    },
    {
      name: "Shelter D",
      location: "Shivajinagar",
      capacity: 200,
      occupied: 96,
      status: "Operational",
    },
    {
      name: "Shelter E",
      location: "Deccan",
      capacity: 180,
      occupied: 171,
      status: "Near Capacity",
    },
  ];

  const resources = [
    {
      name: "Drinking Water",
      icon: Droplets,
      quantity: "1,240 L",
      status: "Good",
      percentage: 82,
    },
    {
      name: "Food Packets",
      icon: Utensils,
      quantity: "486",
      status: "Moderate",
      percentage: 54,
    },
    {
      name: "Medical Kits",
      icon: HeartPulse,
      quantity: "38",
      status: "Low",
      percentage: 22,
    },
    {
      name: "Emergency Tents",
      icon: Tent,
      quantity: "72",
      status: "Good",
      percentage: 76,
    },
  ];

  const notifications = [
    {
      title: "Critical SOS detected",
      location: "Kothrud",
      time: "2 min ago",
      icon: AlertTriangle,
      type: "critical",
    },
    {
      title: "Shelter nearing capacity",
      location: "Shelter B · Baner",
      time: "5 min ago",
      icon: Building2,
      type: "warning",
    },
    {
      title: "Medical supplies low",
      location: "Shelter C · Aundh",
      time: "8 min ago",
      icon: Package,
      type: "warning",
    },
    {
      title: "Response team deployed",
      location: "Baner",
      time: "12 min ago",
      icon: Radio,
      type: "info",
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

  const filteredSOS = sosRequests.filter((item) =>
    `${item.id} ${item.request} ${item.location} ${item.priority} ${item.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredVolunteers = volunteers.filter((item) =>
    `${item.name} ${item.location} ${item.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredShelters = shelters.filter((item) =>
    `${item.name} ${item.location} ${item.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter((item) =>
    `${item.name} ${item.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  function handleNavigation(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearchTerm("");
  }

  function PriorityBadge({ priority }) {
    return (
      <span
        className={`rounded-md px-2 py-1 text-[10px] font-bold ${
          priority === "CRITICAL"
            ? "bg-red-500/10 text-red-400"
            : priority === "HIGH"
              ? "bg-yellow-500/10 text-yellow-400"
              : "bg-blue-500/10 text-blue-400"
        }`}
      >
        {priority}
      </span>
    );
  }

  function StatusBadge({ status }) {
    let style = "text-gray-400";

    if (
      status === "Available" ||
      status === "Operational" ||
      status === "Assigned" ||
      status === "Good"
    ) {
      style = "text-green-400";
    }

    if (
      status === "Unassigned" ||
      status === "Low" ||
      status === "Offline"
    ) {
      style = "text-red-400";
    }

    if (
      status === "Pending" ||
      status === "Near Capacity" ||
      status === "Moderate" ||
      status === "On Mission"
    ) {
      style = "text-yellow-400";
    }

    return <span className={`text-sm ${style}`}>{status}</span>;
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* MOBILE HEADER */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#091522] px-5 lg:hidden">

        <div>
          <h1 className="text-xl font-bold">
            ResQGrid
          </h1>

          <p className="text-xs text-gray-500">
            Command Center
          </p>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-white/5"
        >
          <Menu size={22} />
        </button>

      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-[#091522] p-6 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="mb-8 flex items-start justify-between">

          <div>
            <h1 className="text-2xl font-bold">
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

        {/* SYSTEM STATUS */}
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

        {/* NAVIGATION */}
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

        {/* ADMIN */}
        <div className="absolute bottom-6 left-6 right-6">

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15">
                <UserRound
                  size={17}
                  className="text-red-400"
                />
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

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg bg-red-500/10 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
            >
              Logout
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:ml-64">

        <div className="p-5 pt-24 sm:p-8 lg:p-8">

          {/* HEADER */}
          <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity
                  size={15}
                  className="text-green-400"
                />

                Emergency Operations
              </div>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {activePage === "Dashboard"
                  ? "Disaster Command Center"
                  : activePage}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {activePage === "Dashboard"
                  ? "Real-time overview of disaster response operations"
                  : `Manage ${activePage.toLowerCase()} and response operations`}
              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* NOTIFICATION BUTTON */}
              <div className="relative">

                <button
                  onClick={() =>
                    setNotificationsOpen(!notificationsOpen)
                  }
                  className="relative rounded-xl border border-white/10 bg-[#0d1b2a] p-3 text-gray-400 hover:text-white"
                >
                  <Bell size={19} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* NOTIFICATION PANEL */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b2a] shadow-2xl">

                    <div className="flex items-center justify-between border-b border-white/10 p-4">

                      <div>
                        <h3 className="font-semibold">
                          Notifications
                        </h3>

                        <p className="text-xs text-gray-500">
                          Recent system alerts
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setNotificationsOpen(false)
                        }
                        className="text-gray-500 hover:text-white"
                      >
                        <X size={16} />
                      </button>

                    </div>

                    <div className="max-h-80 overflow-y-auto">

                      {notifications.map(
                        (notification, index) => {

                          const Icon =
                            notification.icon;

                          return (
                            <div
                              key={index}
                              className="border-b border-white/5 p-4 hover:bg-white/[0.03]"
                            >

                              <div className="flex gap-3">

                                <Icon
                                  size={18}
                                  className={
                                    notification.type ===
                                    "critical"
                                      ? "text-red-400"
                                      : notification.type ===
                                          "warning"
                                        ? "text-yellow-400"
                                        : "text-blue-400"
                                  }
                                />

                                <div>

                                  <p className="text-sm font-medium">
                                    {notification.title}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {notification.location}
                                  </p>

                                  <p className="mt-1 text-[10px] text-gray-600">
                                    {notification.time}
                                  </p>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              </div>

              {/* DISASTER STATUS */}
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

            </div>

          </header>

          {/* SEARCH */}
          {activePage !== "Dashboard" && (
            <div className="mb-6 flex items-center rounded-xl border border-white/10 bg-[#0d1b2a] px-4 py-3">

              <Search
                size={18}
                className="text-gray-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder={`Search ${activePage.toLowerCase()}...`}
                className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}

            </div>
          )}

          {/* ================================================= */}
          {/* DASHBOARD */}
          {/* ================================================= */}

          {activePage === "Dashboard" && (
            <>

              {/* STATISTICS */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

                  <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-400">
                      Total SOS
                    </p>

                    <div className="rounded-lg bg-red-500/10 p-2">
                      <Siren
                        size={18}
                        className="text-red-400"
                      />
                    </div>

                  </div>

                  <h3 className="mt-4 text-3xl font-bold">
                    128
                  </h3>

                  <p className="mt-2 text-sm text-red-400">
                    +12 today
                  </p>

                </div>

                <div className="rounded-2xl border border-red-500/20 bg-[#0d1b2a] p-5">

                  <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-400">
                      Critical Cases
                    </p>

                    <div className="rounded-lg bg-red-500/10 p-2">
                      <AlertTriangle
                        size={18}
                        className="text-red-400"
                      />
                    </div>

                  </div>

                  <h3 className="mt-4 text-3xl font-bold text-red-400">
                    {criticalCount}
                  </h3>

                  <p className="mt-2 text-xs text-gray-500">
                    Need immediate action
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

                  <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-400">
                      Active Volunteers
                    </p>

                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Users
                        size={18}
                        className="text-green-400"
                      />
                    </div>

                  </div>

                  <h3 className="mt-4 text-3xl font-bold">
                    67
                  </h3>

                  <p className="mt-2 text-sm text-green-400">
                    {availableVolunteers} available
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">

                  <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-400">
                      Shelter Capacity
                    </p>

                    <div className="rounded-lg bg-yellow-500/10 p-2">
                      <Building2
                        size={18}
                        className="text-yellow-400"
                      />
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

              {/* MAP + ALERTS */}
              <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* MAP */}
                <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

                  <div className="flex items-center justify-between">

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

                  <div className="relative mt-6 h-[360px] overflow-hidden rounded-xl border border-white/5 bg-[#081522]">

                    {/* GRID */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* RIVER */}
                    <div className="absolute left-[45%] top-[-20px] h-[420px] w-16 rotate-[18deg] bg-blue-500/10 blur-sm" />

                    {/* LOCATIONS */}
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

                    {/* SOS */}
                    <div className="absolute left-[21%] top-[33%]">

                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold shadow-lg shadow-red-500/40">

                        SOS

                        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />

                      </div>

                    </div>

                    <div className="absolute left-[63%] top-[28%]">

                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold shadow-lg shadow-red-500/40">

                        SOS

                        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />

                      </div>

                    </div>

                    {/* HIGH */}
                    <div className="absolute left-[35%] top-[63%]">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-black">
                        !
                      </div>

                    </div>

                    {/* VOLUNTEERS */}
                    <div className="absolute left-[54%] top-[48%]">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
                        V
                      </div>

                    </div>

                    <div className="absolute left-[76%] top-[57%]">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
                        V
                      </div>

                    </div>

                    {/* LIVE */}
                    <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#07111f]/90 px-4 py-2">

                      <div className="flex items-center gap-2">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                        <span className="text-xs text-gray-300">
                          Live monitoring active
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ALERTS */}
                <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

                  <h3 className="text-xl font-semibold">
                    Emergency Alerts
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Latest system notifications
                  </p>

                  <div className="mt-6 space-y-3">

                    {notifications.map(
                      (notification, index) => {

                        const Icon =
                          notification.icon;

                        return (
                          <div
                            key={index}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                          >

                            <div className="flex gap-3">

                              <Icon
                                size={18}
                                className={
                                  notification.type ===
                                  "critical"
                                    ? "text-red-400"
                                    : notification.type ===
                                        "warning"
                                      ? "text-yellow-400"
                                      : "text-blue-400"
                                }
                              />

                              <div>

                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {notification.location}
                                </p>

                                <p className="mt-1 text-[10px] text-gray-600">
                                  {notification.time}
                                </p>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

              </section>

              {/* PRIORITY SOS */}
              <section className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-xl font-semibold">
                      Priority SOS Requests
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Requests requiring immediate attention
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleNavigation("SOS Requests")
                    }
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600"
                  >
                    View All
                    <ChevronRight size={16} />
                  </button>

                </div>

                <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">

                  <table className="w-full min-w-[750px] text-left">

                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">

                      <tr>
                        <th className="px-5 py-4">
                          Priority
                        </th>

                        <th className="px-5 py-4">
                          Request
                        </th>

                        <th className="px-5 py-4">
                          Location
                        </th>

                        <th className="px-5 py-4">
                          People
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Action
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-white/10">

                      {sosRequests.slice(0, 4).map(
                        (request) => (
                          <tr
                            key={request.id}
                            className="hover:bg-white/[0.025]"
                          >

                            <td className="px-5 py-4">
                              <PriorityBadge
                                priority={
                                  request.priority
                                }
                              />
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

                            <td className="px-5 py-4">
                              <StatusBadge
                                status={
                                  request.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">

                              <button
                                onClick={() =>
                                  setSelectedRequest(
                                    request
                                  )
                                }
                                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
                              >
                                Details
                              </button>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>
          )}

          {/* ================================================= */}
          {/* SOS REQUESTS */}
          {/* ================================================= */}

          {activePage === "SOS Requests" && (
            <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    All SOS Requests
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Monitor and manage incoming emergency requests
                  </p>
                </div>

                <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {filteredSOS.length} requests
                </div>

              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">

                <table className="w-full min-w-[900px] text-left">

                  <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-500">

                    <tr>
                      <th className="px-5 py-4">ID</th>
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

                    {filteredSOS.map((request) => (
                      <tr
                        key={request.id}
                        className="hover:bg-white/[0.025]"
                      >

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {request.id}
                        </td>

                        <td className="px-5 py-4">
                          <PriorityBadge
                            priority={request.priority}
                          />
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {request.request}
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
                          <StatusBadge
                            status={request.status}
                          />
                        </td>

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              setSelectedRequest(
                                request
                              )
                            }
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
                          >
                            View Details
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </section>
          )}

          {/* ================================================= */}
          {/* VOLUNTEERS */}
          {/* ================================================= */}

          {activePage === "Volunteers" && (
            <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Volunteer Operations
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Monitor available and deployed response teams
                  </p>
                </div>

                <Users
                  size={22}
                  className="text-green-400"
                />

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {filteredVolunteers.map(
                  (volunteer) => (
                    <div
                      key={volunteer.name}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10">

                            <UserRound
                              size={20}
                              className="text-green-400"
                            />

                          </div>

                          <div>

                            <p className="font-medium">
                              {volunteer.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} />
                              {volunteer.location}
                            </p>

                          </div>

                        </div>

                        <StatusBadge
                          status={volunteer.status}
                        />

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-white/[0.03] p-3">

                          <p className="text-[10px] text-gray-600">
                            CURRENT TASK
                          </p>

                          <p className="mt-1 text-sm">
                            {volunteer.task}
                          </p>

                        </div>

                        <div className="rounded-lg bg-white/[0.03] p-3">

                          <p className="text-[10px] text-gray-600">
                            CONTACT
                          </p>

                          <p className="mt-1 text-sm">
                            {volunteer.phone}
                          </p>

                        </div>

                      </div>

                      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white">
                        <MapPin size={14} />
                        View Location
                      </button>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* ================================================= */}
          {/* SHELTERS */}
          {/* ================================================= */}

          {activePage === "Shelters" && (
            <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Shelter Management
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Monitor shelter occupancy and availability
                  </p>
                </div>

                <Building2
                  size={22}
                  className="text-yellow-400"
                />

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {filteredShelters.map(
                  (shelter) => {

                    const percentage =
                      Math.round(
                        (shelter.occupied /
                          shelter.capacity) *
                          100
                      );

                    const available =
                      shelter.capacity -
                      shelter.occupied;

                    return (
                      <div
                        key={shelter.name}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <h4 className="font-semibold">
                              {shelter.name}
                            </h4>

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} />
                              {shelter.location}
                            </p>

                          </div>

                          <StatusBadge
                            status={
                              shelter.status
                            }
                          />

                        </div>

                        <div className="mt-6">

                          <div className="mb-2 flex items-center justify-between">

                            <span className="text-xs text-gray-500">
                              Occupancy
                            </span>

                            <span className="text-sm font-medium">
                              {percentage}%
                            </span>

                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-white/5">

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

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="rounded-lg bg-white/[0.03] p-3">

                            <p className="text-[10px] text-gray-600">
                              OCCUPIED
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                              {shelter.occupied}
                            </p>

                          </div>

                          <div className="rounded-lg bg-white/[0.03] p-3">

                            <p className="text-[10px] text-gray-600">
                              AVAILABLE
                            </p>

                            <p className="mt-1 text-lg font-semibold text-green-400">
                              {available}
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>
          )}

          {/* ================================================= */}
          {/* RESOURCES */}
          {/* ================================================= */}

          {activePage === "Resources" && (
            <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    Resource Management
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Track emergency supplies across response locations
                  </p>
                </div>

                <Package
                  size={22}
                  className="text-blue-400"
                />

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {filteredResources.map(
                  (resource) => {

                    const Icon = resource.icon;

                    return (
                      <div
                        key={resource.name}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                      >

                        <div className="flex items-center justify-between">

                          <div className="rounded-lg bg-blue-500/10 p-3">

                            <Icon
                              size={21}
                              className="text-blue-400"
                            />

                          </div>

                          <StatusBadge
                            status={
                              resource.status
                            }
                          />

                        </div>

                        <p className="mt-5 text-sm text-gray-400">
                          {resource.name}
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                          {resource.quantity}
                        </p>

                        <div className="mt-5">

                          <div className="mb-2 flex justify-between">

                            <span className="text-xs text-gray-600">
                              Stock level
                            </span>

                            <span className="text-xs text-gray-500">
                              {resource.percentage}%
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/5">

                            <div
                              className={`h-full rounded-full ${
                                resource.status ===
                                "Low"
                                  ? "bg-red-500"
                                  : resource.status ===
                                      "Moderate"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${resource.percentage}%`,
                              }}
                            />

                          </div>

                        </div>

                        {resource.status ===
                          "Low" && (
                          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2">

                            <AlertTriangle
                              size={14}
                              className="text-red-400"
                            />

                            <span className="text-xs text-red-400">
                              Restock required
                            </span>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </section>
          )}

          {/* FOOTER */}
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

      {/* ================================================= */}
      {/* SOS DETAILS MODAL */}
      {/* ================================================= */}

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
                onClick={() =>
                  setSelectedRequest(null)
                }
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

                <div className="mt-2">
                  <PriorityBadge
                    priority={
                      selectedRequest.priority
                    }
                  />
                </div>

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
                    TIME
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                    <Clock size={14} />
                    {selectedRequest.time}
                  </p>

                </div>

              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">

                <p className="text-xs text-gray-500">
                  CURRENT STATUS
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={
                      selectedRequest.status
                    }
                  />
                </div>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium hover:bg-red-600"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Truck size={16} />
                    Assign Response Team
                  </span>
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