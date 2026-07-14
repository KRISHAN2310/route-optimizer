import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Vehicle } from "../../types";
import { VehiclePayload } from "../../api/vehicleApi";
import Button from "../common/Button";

interface VehicleFormProps {
  initialValues?: Vehicle | null;
  onSubmit: (values: VehiclePayload) => Promise<void>;
  onCancel: () => void;
}

export default function VehicleForm({ initialValues, onSubmit, onCancel }: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VehiclePayload>();

  useEffect(() => {
    if (initialValues) {
      reset({
        plateNumber: initialValues.plateNumber,
        type: initialValues.type,
        capacityKg: initialValues.capacityKg,
        fuelEfficiency: initialValues.fuelEfficiency,
        status: initialValues.status
      });
    } else {
      reset({ plateNumber: "", type: "", capacityKg: 0, fuelEfficiency: 0, status: "AVAILABLE" });
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          capacityKg: Number(values.capacityKg),
          fuelEfficiency: Number(values.fuelEfficiency)
        });
      })}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Plate Number</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("plateNumber", { required: "Required" })}
        />
        {errors.plateNumber && <p className="mt-1 text-xs text-red-600">{errors.plateNumber.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
        <input
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("type", { required: "Required" })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Capacity (kg)</label>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            {...register("capacityKg", { required: true, valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Efficiency (km/L)</label>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            {...register("fuelEfficiency", { required: true, valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...register("status")}
        >
          <option value="AVAILABLE">Available</option>
          <option value="ON_ROUTE">On Route</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {initialValues ? "Update Vehicle" : "Add Vehicle"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
