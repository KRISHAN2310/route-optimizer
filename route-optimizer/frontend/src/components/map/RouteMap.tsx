import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { Stop } from "../../types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface RouteMapProps {
  stops: Stop[];
  depot?: { latitude: number; longitude: number };
}

export default function RouteMap({ stops, depot }: RouteMapProps) {
  const center: [number, number] = depot
    ? [depot.latitude, depot.longitude]
    : stops.length > 0
    ? [stops[0].latitude, stops[0].longitude]
    : [28.6139, 77.209];

  const linePositions: [number, number][] = [
    ...(depot ? [[depot.latitude, depot.longitude] as [number, number]] : []),
    ...stops.map((s) => [s.latitude, s.longitude] as [number, number])
  ];

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {depot && (
        <Marker position={[depot.latitude, depot.longitude]}>
          <Popup>Depot</Popup>
        </Marker>
      )}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{stop.label}</p>
              <p>Sequence: {stop.sequence}</p>
              <p>Demand: {stop.demandKg}kg</p>
              <p>Priority: {stop.priority}</p>
              <p>{stop.visited ? "Visited" : "Pending"}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {linePositions.length > 1 && (
        <Polyline positions={linePositions} pathOptions={{ color: "#2563eb", weight: 4 }} />
      )}
    </MapContainer>
  );
}
