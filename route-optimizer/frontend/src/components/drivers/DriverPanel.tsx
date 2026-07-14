import { useQuery } from "react-query";
import { fetchMyDriverProfile } from "../../api/driverApi";
import { useUpdateRouteStatus, useMarkStopVisited } from "../../hooks/useRoutes";
import Loader from "../common/Loader";
import Button from "../common/Button";

export default function DriverPanel() {
  const { data: driver, isLoading } = useQuery("my-driver-profile", fetchMyDriverProfile);
  const updateStatus = useUpdateRouteStatus();
  const markVisited = useMarkStopVisited();

  if (isLoading) return <Loader label="Loading your assignments..." />;
  if (!driver) return <p className="text-sm text-gray-500">No driver profile found.</p>;

  const activeRoutes = (driver as any).routes || [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="font-semibold text-gray-800">{driver.user?.name}</h3>
        <p className="text-sm text-gray-500">Vehicle: {driver.vehicle?.plateNumber || "Unassigned"}</p>
      </div>

      {activeRoutes.length === 0 && (
        <p className="text-sm text-gray-500">No routes assigned currently.</p>
      )}

      {activeRoutes.map((route: any) => (
        <div key={route.id} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-800">{route.name}</h4>
            <span className="text-xs font-medium text-gray-500">{route.status}</span>
          </div>
          <ul className="space-y-2">
            {route.stops.map((stop: any) => (
              <li key={stop.id} className="flex items-center justify-between text-sm">
                <span>
                  {stop.sequence}. {stop.label}
                </span>
                {stop.visited ? (
                  <span className="text-green-600">Visited</span>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => markVisited.mutate({ routeId: route.id, stopId: stop.id })}
                  >
                    Mark Visited
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => updateStatus.mutate({ id: route.id, status: "IN_PROGRESS" })}>
              Start Route
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateStatus.mutate({ id: route.id, status: "COMPLETED" })}
            >
              Complete Route
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
