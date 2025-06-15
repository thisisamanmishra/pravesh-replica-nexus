
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

  function normalizeDomicile(value: string | undefined) {
    if (!value) return "Home State";
    const v = value.toLowerCase().trim();
    if (v === "home" || v === "home state" || v === "west bengal" || v === "home state (west bengal)") {
      return "Home State";
    }
    if (
      v === "other" ||
      v === "all india" ||
      v === "other state" ||
      v === "ai" ||
      v === "other state (all india)"
    ) {
      return "All India";
    }
    return "Home State";
  }

  // Updated: always fill in human name columns, upload even if UUIDs are null
  function transformRowsForDb(rows: any[], mapping: Record<string, string>) {
    const { collegeNameToId, branchNameToId } = refMaps;
    // Only these keys will be uploaded
    const allowedKeys = [
      "college_id",
      "college_name",
      "branch_id",
      "branch_name",
      "domicile",
      "category",
      "opening_rank",
      "closing_rank",
    ];
    return rows
      .map(row => {
        const collegeRawName = row[mapping["college_id"]] ? row[mapping["college_id"]].trim() : "";
        const branchRawName = row[mapping["branch_id"]] ? row[mapping["branch_id"]].trim() : "";

        const collegeKey = collegeRawName.toLowerCase();
        const branchKey = branchRawName.toLowerCase();
        const college_id = collegeNameToId[collegeKey] || null;
        const branch_id = branchNameToId[branchKey] || null;

        const category = row[mapping["category"]];
        const opening_rank = Number(row[mapping["opening_rank"]] ?? "") || null;
        const closing_rank = Number(row[mapping["closing_rank"]] ?? "") || null;
        let domicile = row[mapping["domicile"]];
        domicile = normalizeDomicile(domicile);

        // Build object, always include names
        return {
          college_id,
          college_name: collegeRawName || null,
          branch_id,
          branch_name: branchRawName || null,
          domicile,
          category,
          opening_rank,
          closing_rank,
        };
      })
      .filter(r =>
        // Only skip rows where all allowed fields are null/empty
        Object.values(r).some(val => val !== null && val !== "" && typeof val !== "undefined")
      );
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
