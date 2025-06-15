
import React from "react";
export const expectedCutoffsColumns = [
  { key: "college_id", label: "Institute (college_id)" },
  { key: "branch_id", label: "Program/Branch (branch_id)" },
  { key: "category", label: "Category" },
  { key: "opening_rank", label: "Opening Rank" },
  { key: "closing_rank", label: "Closing Rank" },
  { key: "domicile", label: "Domicile" },
  { key: "quota", label: "Quota" },
  { key: "round", label: "Counseling Round" },
  { key: "year", label: "Year" },
];

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
  function handleSelect(requiredKey: string, value: string) {
    onChange({ ...mapping, [requiredKey]: value });
  }

  return (
    <div className="mb-4 border-dashed border-2 border-blue-200 rounded p-4">
      <h3 className="font-semibold text-lg mb-2">Map Your Columns</h3>
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
    </div>
  );
};

export default WbjeeColumnMapper;
