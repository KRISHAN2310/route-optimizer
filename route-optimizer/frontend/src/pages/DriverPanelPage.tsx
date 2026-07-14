import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import DriverList from "../components/drivers/DriverList";
import DriverForm from "../components/drivers/DriverForm";
import DriverPanel from "../components/drivers/DriverPanel";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver } from "../hooks/useDrivers";
import { useVehicles } from "../hooks/useVehicles";
import { useAuth } from "../hooks/useAuth";
import { Driver } from "../types";
import { DriverPayload } from "../api/driverApi";

export default function DriverPanelPage() {
  const { user } = useAuth();

  if (user?.role === "DRIVER") {
    return (
      <DashboardLayout>
        <h2 className="mb-6 text-xl font-semibold text-gray-800">My Assignments</h2>
        <DriverPanel />
      </DashboardLayout>
    );
  }

  return <DriverManagementView />;
}

function DriverManagementView() {
  const { data: drivers = [], isLoading } = useDrivers();
  const { data: vehicles = [] } = useVehicles();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(values: DriverPayload) {
    await createDriver.mutateAsync(values);
    setShowForm(false);
  }

  function handleToggleAvailability(driver: Driver) {
    updateDriver.mutate({ id: driver.id, payload: { available: !driver.available } });
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Driver Management</h2>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "Add Driver"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <DriverForm vehicles={vehicles} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <DriverList
          drivers={drivers}
          onToggleAvailability={handleToggleAvailability}
          onDelete={(id) => deleteDriver.mutate(id)}
        />
      )}
    </DashboardLayout>
  );
}
