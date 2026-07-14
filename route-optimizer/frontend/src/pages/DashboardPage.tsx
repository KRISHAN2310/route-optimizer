import { useQuery } from "react-query";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchDashboardSummary } from "../api/analyticsApi";
import Loader from "../components/common/Loader";

export default function DashboardPage() {
  const { data, isLoading } = useQuery("dashboard-summary", fetchDashboardSummary);

  return (
    <DashboardLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Dashboard</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard label="Total Routes" value={data?.totalRoutes ?? 0} />
          <StatCard label="Active Routes" value={data?.activeRoutes ?? 0} />
          <StatCard label="Total Vehicles" value={data?.totalVehicles ?? 0} />
          <StatCard label="Available Vehicles" value={data?.availableVehicles ?? 0} />
          <StatCard label="Total Drivers" value={data?.totalDrivers ?? 0} />
          <StatCard label="Total Fuel (L)" value={data?.totalFuelLiters ?? 0} />
          <StatCard label="Total Distance (km)" value={data?.totalDistanceKm ?? 0} />
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
