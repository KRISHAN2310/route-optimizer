import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard", roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/planner", label: "Route Planner", roles: ["ADMIN", "DISPATCHER"] },
  { to: "/vehicles", label: "Vehicles", roles: ["ADMIN", "DISPATCHER"] },
  { to: "/drivers", label: "Driver Panel", roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/tracking", label: "Live Tracking", roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/analytics", label: "Analytics", roles: ["ADMIN", "DISPATCHER"] },
  { to: "/admin", label: "Admin Panel", roles: ["ADMIN"] }
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-6 px-2 text-xl font-bold text-brand-600">RouteOpt</div>
      <nav className="flex flex-col gap-1">
        {links
          .filter((link) => !user || link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
