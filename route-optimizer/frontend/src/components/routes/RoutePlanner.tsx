import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useVehicles } from "../../hooks/useVehicles";
import { useCreateRoute } from "../../hooks/useRoutes";
import { CsvStopRow } from "../../types";
import CsvUploader from "./CsvUploader";
import Button from "../common/Button";
import RouteMap from "../map/RouteMap";

interface PlannerFormValues {
  name: string;
  vehicleId: string;
  algorithm: "nearest-neighbor" | "priority-first";
  averageSpeedKmh: number;
  trafficFactor: number;
  depotLat: number;
  depotLng: number;
  stops: CsvStopRow[];
}

export default function RoutePlanner() {
  const { data: vehicles = [] } = useVehicles();
  const createRoute = useCreateRoute();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, watch } = useForm<PlannerFormValues>({
    defaultValues: {
      name: "",
      algorithm: "nearest-neighbor",
      averageSpeedKmh: 40,
      trafficFactor: 1,
      depotLat: 28.6139,
      depotLng: 77.209,
      stops: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "stops" });
  const stops = watch("stops");

  function handleCsvParsed(parsedStops: CsvStopRow[]) {
    replace(parsedStops);
  }

  async function onSubmit(values: PlannerFormValues) {
    setError(null);
    try {
      const route = await createRoute.mutateAsync({
        name: values.name,
        vehicleId: values.vehicleId,
        algorithm: values.algorithm,
        averageSpeedKmh: Number(values.averageSpeedKmh),
        trafficFactor: Number(values.trafficFactor),
        depot: { id: "depot", latitude: Number(values.depotLat), longitude: Number(values.depotLng) },
        stops: values.stops.map((s) => ({
          label: s.label,
          latitude: Number(s.latitude),
          longitude: Number(s.longitude),
          demandKg: Number(s.demandKg),
          priority: Number(s.priority)
        }))
      });
      setResult(route);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to optimize route");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Route Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              {...register("name", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Vehicle</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("vehicleId", { required: true })}
              >
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} ({v.capacityKg}kg)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Algorithm</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("algorithm")}
              >
                <option value="nearest-neighbor">Nearest Neighbor</option>
                <option value="priority-first">Priority First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Avg Speed (km/h)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("averageSpeedKmh", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Traffic Factor</label>
              <input
                type="number"
                step="0.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("trafficFactor", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Depot Latitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("depotLat", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Depot Longitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                {...register("depotLng", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <CsvUploader onParsed={handleCsvParsed} />

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Stops ({fields.length})</h4>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({ label: "", latitude: 0, longitude: 0, demandKg: 0, priority: 1 })
              }
            >
              Add Stop
            </Button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-6 gap-2 text-xs">
                <input
                  className="col-span-2 rounded border border-gray-300 px-2 py-1"
                  placeholder="Label"
                  {...register(`stops.${index}.label` as const)}
                />
                <input
                  className="rounded border border-gray-300 px-2 py-1"
                  placeholder="Lat"
                  type="number"
                  step="0.0001"
                  {...register(`stops.${index}.latitude` as const, { valueAsNumber: true })}
                />
                <input
                  className="rounded border border-gray-300 px-2 py-1"
                  placeholder="Lng"
                  type="number"
                  step="0.0001"
                  {...register(`stops.${index}.longitude` as const, { valueAsNumber: true })}
                />
                <input
                  className="rounded border border-gray-300 px-2 py-1"
                  placeholder="Demand"
                  type="number"
                  {...register(`stops.${index}.demandKg` as const, { valueAsNumber: true })}
                />
                <div className="flex gap-1">
                  <input
                    className="w-full rounded border border-gray-300 px-2 py-1"
                    placeholder="Priority"
                    type="number"
                    {...register(`stops.${index}.priority` as const, { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={createRoute.isLoading} className="w-full">
          {createRoute.isLoading ? "Optimizing..." : "Generate Optimized Route"}
        </Button>
      </form>

      <div className="h-[600px] rounded-xl border border-gray-200 bg-white p-2">
        <RouteMap
          stops={result?.stops || []}
          depot={{ latitude: watch("depotLat"), longitude: watch("depotLng") }}
        />
      </div>
    </div>
  );
}
