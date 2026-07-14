import { Vehicle } from "../../types";
import Button from "../common/Button";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  ON_ROUTE: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700"
};

export default function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{vehicle.plateNumber}</h3>
          <p className="text-sm text-gray-500">{vehicle.type}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[vehicle.status]}`}>
          {vehicle.status.replace("_", " ")}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <p>Capacity: {vehicle.capacityKg}kg</p>
        <p>Efficiency: {vehicle.fuelEfficiency} km/L</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(vehicle)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(vehicle.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
