import { useRef, useState } from "react";
import { uploadStopsCsvRequest } from "../../api/uploadApi";
import { CsvStopRow } from "../../types";
import Button from "../common/Button";

interface CsvUploaderProps {
  onParsed: (stops: CsvStopRow[]) => void;
}

export default function CsvUploader({ onParsed }: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await uploadStopsCsvRequest(file);
      onParsed(result.stops);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to parse CSV");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-center">
      <p className="mb-2 text-sm text-gray-600">
        Upload a CSV with columns: label, latitude, longitude, demandKg, priority
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="csv-upload-input"
      />
      <label htmlFor="csv-upload-input">
        <Button type="button" variant="secondary" disabled={uploading}>
          <span onClick={() => inputRef.current?.click()}>
            {uploading ? "Parsing..." : "Choose CSV File"}
          </span>
        </Button>
      </label>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
