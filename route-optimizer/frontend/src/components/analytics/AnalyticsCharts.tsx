import { useQuery } from "react-query";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { fetchStatusBreakdown, fetchVehicleUtilization } from "../../api/analyticsApi";
import Loader from "../common/Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsCharts() {
  const { data: statusData, isLoading: statusLoading } = useQuery(
    "status-breakdown",
    fetchStatusBreakdown
  );
  const { data: utilizationData, isLoading: utilLoading } = useQuery(
    "vehicle-utilization",
    fetchVehicleUtilization
  );

  if (statusLoading || utilLoading) return <Loader label="Loading analytics..." />;

  const statusChartData = {
    labels: statusData?.map((s) => s.status) || [],
    datasets: [
      {
        data: statusData?.map((s) => s.count) || [],
        backgroundColor: ["#93c5fd", "#2563eb", "#4ade80", "#f87171"]
      }
    ]
  };

  const utilizationChartData = {
    labels: utilizationData?.map((v) => v.plateNumber) || [],
    datasets: [
      {
        label: "Routes Completed",
        data: utilizationData?.map((v) => v.totalRoutes) || [],
        backgroundColor: "#2563eb"
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">Route Status Breakdown</h4>
        <Doughnut data={statusChartData} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">Vehicle Utilization</h4>
        <Bar data={utilizationChartData} />
      </div>
    </div>
  );
}
