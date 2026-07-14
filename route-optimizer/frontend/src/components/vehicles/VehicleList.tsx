import { Vehicle } from "../../types";
import VehicleCard from "./VehicleCard";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export default function VehicleList({ vehicles, onEdit, onDelete }: VehicleListProps) {
  if (vehicles.length === 0) {
    return <p className="text-sm text-gray-500">No vehicles added yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
