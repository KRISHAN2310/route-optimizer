import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import RoutePlanner from "../components/routes/RoutePlanner";
import RouteDetails from "../components/routes/RouteDetails";
import RouteList from "../components/routes/RouteList";
import { useRoutes } from "../hooks/useRoutes";
import Loader from "../components/common/Loader";

export default function RoutePlannerPage() {
  const { id } = useParams<{ id?: string }>();
  const { data: routes = [], isLoading } = useRoutes();

  return (
    <DashboardLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Route Planner</h2>
      {id ? (
        <RouteDetails />
      ) : (
        <div className="space-y-8">
          <RoutePlanner />
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">All Routes</h3>
            {isLoading ? <Loader /> : <RouteList routes={routes} />}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
