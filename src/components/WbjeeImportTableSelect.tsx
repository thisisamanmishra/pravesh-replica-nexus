
import React from "react";

interface Props {
  table: string;
  setTable: (table: string) => void;
  tableOptions: Array<{ value: string; label: string }>;
  showCutoffInputTip: boolean;
}

const WbjeeImportTableSelect: React.FC<Props> = ({
  table,
  setTable,
  tableOptions,
  showCutoffInputTip,
}) => (
  <div>
    <label className="block font-medium mb-1">
      Select Table
      <select
        className="mt-1 w-full rounded px-3 py-2 border border-gray-300"
        value={table}
        onChange={e => setTable(e.target.value)}
      >
        {tableOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
    {showCutoffInputTip && (
      <div className="bg-blue-50 text-blue-900 border-l-4 border-blue-400 p-3 rounded text-sm mb-2">
        It looks like you're uploading Cutoff data. Please select <b>Cutoffs</b> in the dropdown above for this type of CSV.
      </div>
    )}
  </div>
);

export default WbjeeImportTableSelect;
