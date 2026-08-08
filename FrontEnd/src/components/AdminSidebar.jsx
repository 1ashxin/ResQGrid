import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "▦",
    },
    {
      name: "SOS Requests",
      path: "/admin/sos",
      icon: "🚨",
    },
    {
      name: "Volunteers",
      path: "/admin/volunteers",
      icon: "👥",
    },
    {
      name: "Shelters",
      path: "/admin/shelters",
      icon: "⌂",
    },
    {
      name: "Resources",
      path: "/admin/resources",
      icon: "▣",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-[#091522] p-6">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          ResQGrid
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Command Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-red-500/15 text-red-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="w-6 text-center">
              {link.icon}
            </span>

            <span>{link.name}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 space-y-2">

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 ${
              isActive
                ? "bg-red-500/15 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <span>🔔</span>
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 ${
              isActive
                ? "bg-red-500/15 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <span>👤</span>
          <span>Admin Profile</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default AdminSidebar;