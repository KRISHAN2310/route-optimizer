import DashboardLayout from "../components/layout/DashboardLayout";
import AnalyticsCharts from "../components/analytics/AnalyticsCharts";
import ReportsTable from "../components/analytics/ReportsTable";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Analytics & Reports</h2>
      <div className="space-y-8">
        <AnalyticsCharts />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Fuel Report</h3>
          <ReportsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
