import { useQuery } from "react-query";
import { fetchFuelReport } from "../../api/analyticsApi";
import Loader from "../common/Loader";

interface FuelReportRow {
  id: string;
  name: string;
  estimatedFuel: number;
  totalDistanceKm: number;
  createdAt: string;
  vehicle: { plateNumber: string } | null;
}

export default function ReportsTable() {
  const { data, isLoading } = useQuery<FuelReportRow[]>("fuel-report", fetchFuelReport);

  if (isLoading) return <Loader label="Loading reports..." />;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Route</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Vehicle</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Distance</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Fuel</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2">{row.vehicle?.plateNumber || "-"}</td>
              <td className="px-4 py-2">{row.totalDistanceKm} km</td>
              <td className="px-4 py-2">{row.estimatedFuel} L</td>
              <td className="px-4 py-2">{new Date(row.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
