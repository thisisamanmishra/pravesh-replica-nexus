
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ColumnMapperProps {
  rawHeaders: string[];
  mapping: Record<string, string>;
  requiredColumns: { key: string; label: string }[];
  onChange: (newMapping: Record<string, string>) => void;
}

const WbjeeColumnMapper: React.FC<ColumnMapperProps> = ({
  rawHeaders,
  mapping,
  requiredColumns,
  onChange,
}) => {
  // For each required column, select the header it's mapped to
  function handleSelect(requiredKey: string, value: string) {
    onChange({ ...mapping, [requiredKey]: value });
  }

  return (
    <Card className="mb-4 border-dashed border-2 border-blue-200">
      <CardHeader>
        <CardTitle>Map Your Columns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {requiredColumns.map((rc) => (
            <div key={rc.key}>
              <label className="block mb-1 font-semibold">{rc.label}</label>
              <select
                className="w-full rounded border px-2 py-1"
                value={mapping[rc.key] || ""}
                onChange={e => handleSelect(rc.key, e.target.value)}
              >
                <option value="">-- Not Set --</option>
                {rawHeaders.map(h => (
                  <option value={h} key={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Map each required field to a column in your data. Only mapped fields will be uploaded.
        </div>
      </CardContent>
    </Card>
  );
};

export default WbjeeColumnMapper;
