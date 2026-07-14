import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import VehicleList from "../components/vehicles/VehicleList";
import VehicleForm from "../components/vehicles/VehicleForm";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "../hooks/useVehicles";
import { Vehicle } from "../types";
import { VehiclePayload } from "../api/vehicleApi";

export default function VehicleManagementPage() {
  const { data: vehicles = [], isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  async function handleSubmit(values: VehiclePayload) {
    if (editing) {
      await updateVehicle.mutateAsync({ id: editing.id, payload: values });
    } else {
      await createVehicle.mutateAsync(values);
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Vehicle Management</h2>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Close" : "Add Vehicle"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <VehicleForm
            initialValues={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <VehicleList
          vehicles={vehicles}
          onEdit={(vehicle) => {
            setEditing(vehicle);
            setShowForm(true);
          }}
          onDelete={(id) => deleteVehicle.mutate(id)}
        />
      )}
    </DashboardLayout>
  );
}
