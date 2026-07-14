import { useForm } from "react-hook-form";
import { DriverPayload } from "../../api/driverApi";
import { Vehicle } from "../../types";
import Button from "../common/Button";

interface DriverFormProps {
  vehicles: Vehicle[];
  onSubmit: (values: DriverPayload) => Promise<void>;
  onCancel: () => void;
}

export default function DriverForm({ vehicles, onSubmit, onCancel }: DriverFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DriverPayload>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">User ID</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Existing user's ID"
          {...register("userId", { required: "Required" })}
        />
        {errors.userId && <p className="mt-1 text-xs text-red-600">{errors.userId.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("phone", { required: "Required" })}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">License Number</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("licenseNo", { required: "Required" })}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Assign Vehicle</label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("vehicleId")}
        >
          <option value="">Unassigned</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plateNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Add Driver
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
