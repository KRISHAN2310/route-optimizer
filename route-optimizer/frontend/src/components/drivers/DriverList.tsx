import { Driver } from "../../types";
import Button from "../common/Button";

interface DriverListProps {
  drivers: Driver[];
  onToggleAvailability: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export default function DriverList({ drivers, onToggleAvailability, onDelete }: DriverListProps) {
  if (drivers.length === 0) {
    return <p className="text-sm text-gray-500">No drivers added yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Phone</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">License</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Vehicle</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Available</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td className="px-4 py-2">{driver.user?.name}</td>
              <td className="px-4 py-2">{driver.phone}</td>
              <td className="px-4 py-2">{driver.licenseNo}</td>
              <td className="px-4 py-2">{driver.vehicle?.plateNumber || "Unassigned"}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    driver.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {driver.available ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onToggleAvailability(driver)}>
                    Toggle
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(driver.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
