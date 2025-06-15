
import { useState } from "react";
import { useWbjeeReferenceMaps } from "@/hooks/useWbjeeColumnLookup";
import { expectedCutoffsColumns } from "@/components/WbjeeColumnMapper";

export function parseFlexibleCSV(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { rows: [], headers: [] };
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
  return { rows, headers };
}

// Header guesser for mapping UI
export function guessMap(headers: string[]) {
  const mapping: Record<string, string> = {};
  for (const field of expectedCutoffsColumns) {
    let match = headers.find(h => h.replace(/[^a-zA-Z]/g, "").toLowerCase() === field.label.replace(/[^a-zA-Z]/g, "").toLowerCase());
    if (!match) {
      // Fuzzy: keywords
      for (const h of headers) {
        if (field.label.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(field.label.toLowerCase())) {
          match = h;
          break;
        }
      }
    }
    if (match) mapping[field.key] = match;
  }
  return mapping;
}

export function useWbjeeCutoffImport() {
  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [showColumnMapper, setShowColumnMapper] = useState(false);

  const refMaps = useWbjeeReferenceMaps();

  function handleCsvChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCsvText(e.target.value);
    const { rows, headers } = parseFlexibleCSV(e.target.value);
    setParsedRows(rows);
    setRawHeaders(headers);
    setColumnMapping(guessMap(headers));
    setShowColumnMapper(true);
  }

  function transformRowsForDb(rows: any[], mapping: Record<string, string>) {
    const { collegeNameToId, branchNameToId } = refMaps;
    return rows.map(row => {
      const collegeName = row[mapping["college_id"]]?.toLowerCase().trim();
      const branchName = row[mapping["branch_id"]]?.toLowerCase().trim();
      const college_id = collegeNameToId[collegeName] || null;
      const branch_id = branchNameToId[branchName] || null;
      const opening_rank = Number(row[mapping["opening_rank"]] ?? "") || null;
      const closing_rank = Number(row[mapping["closing_rank"]] ?? "") || null;
      let domicile = row[mapping["domicile"]];
      if (!domicile && row["Quota"]?.toLowerCase().includes("home")) {
        domicile = "Home";
      }
      const round = Number(row[mapping["round"]] ?? "1") || 1;
      const year = Number(row[mapping["year"]] ?? "") || new Date().getFullYear();

      return {
        college_id,
        branch_id,
        category: row[mapping["category"]],
        opening_rank,
        closing_rank,
        domicile: domicile || "Home",
        quota: row[mapping["quota"]] || "",
        round,
        year,
      };
    });
  }

  return {
    csvText, setCsvText,
    parsedRows, setParsedRows,
    rawHeaders, setRawHeaders,
    columnMapping, setColumnMapping,
    showColumnMapper, setShowColumnMapper,
    handleCsvChange,
    transformRowsForDb,
    refMaps,
  };
}
