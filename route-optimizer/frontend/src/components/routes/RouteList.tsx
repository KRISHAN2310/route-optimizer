import { Link } from "react-router-dom";
import { RouteRecord } from "../../types";

interface RouteListProps {
  routes: RouteRecord[];
}

const statusColors: Record<string, string> = {
  PLANNED: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700"
};

export default function RouteList({ routes }: RouteListProps) {
  if (routes.length === 0) {
    return <p className="text-sm text-gray-500">No routes created yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Vehicle</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Distance</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">ETA</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Fuel</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="px-4 py-2">
                <Link to={`/planner/${route.id}`} className="font-medium text-brand-600">
                  {route.name}
                </Link>
              </td>
              <td className="px-4 py-2">{route.vehicle?.plateNumber || "-"}</td>
              <td className="px-4 py-2">{route.totalDistanceKm} km</td>
              <td className="px-4 py-2">{route.etaMinutes} min</td>
              <td className="px-4 py-2">{route.estimatedFuel} L</td>
              <td className="px-4 py-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[route.status]}`}>
                  {route.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
