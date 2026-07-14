import { useParams } from "react-router-dom";
import { useRoute, useUpdateRouteStatus } from "../../hooks/useRoutes";
import RouteMap from "../map/RouteMap";
import Loader from "../common/Loader";
import Button from "../common/Button";

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading } = useRoute(id || "");
  const updateStatus = useUpdateRouteStatus();

  if (isLoading) return <Loader label="Loading route..." />;
  if (!route) return <p className="text-sm text-gray-500">Route not found.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-800">{route.name}</h3>
          <p className="text-sm text-gray-500">Algorithm: {route.algorithm}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Distance</p>
              <p className="font-medium">{route.totalDistanceKm} km</p>
            </div>
            <div>
              <p className="text-gray-500">ETA</p>
              <p className="font-medium">{route.etaMinutes} min</p>
            </div>
            <div>
              <p className="text-gray-500">Fuel</p>
              <p className="font-medium">{route.estimatedFuel} L</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => updateStatus.mutate({ id: route.id, status: "IN_PROGRESS" })}>
              Start
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateStatus.mutate({ id: route.id, status: "COMPLETED" })}
            >
              Complete
            </Button>
            <Button
              variant="danger"
              onClick={() => updateStatus.mutate({ id: route.id, status: "CANCELLED" })}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Stops</h4>
          <ul className="space-y-1 text-sm">
            {route.stops.map((stop) => (
              <li key={stop.id} className="flex justify-between border-b border-gray-100 py-1">
                <span>
                  {stop.sequence}. {stop.label}
                </span>
                <span className={stop.visited ? "text-green-600" : "text-gray-400"}>
                  {stop.visited ? "Visited" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-[500px] rounded-xl border border-gray-200 bg-white p-2">
        <RouteMap stops={route.stops} />
      </div>
    </div>
  );
}
