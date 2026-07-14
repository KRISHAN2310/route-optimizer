import DashboardLayout from "../components/layout/DashboardLayout";
import LiveTrackingMap from "../components/map/LiveTrackingMap";
import { useVehicles } from "../hooks/useVehicles";
import { useLiveTracking } from "../hooks/useLiveTracking";
import Loader from "../components/common/Loader";

export default function LiveTrackingPage() {
  const { data: vehicles = [], isLoading } = useVehicles();
  const { positions } = useLiveTracking();

  return (
    <DashboardLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Live Tracking</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-[600px] rounded-xl border border-gray-200 bg-white p-2">
          <LiveTrackingMap vehicles={vehicles} positions={positions} />
        </div>
      )}
    </DashboardLayout>
  );
}
