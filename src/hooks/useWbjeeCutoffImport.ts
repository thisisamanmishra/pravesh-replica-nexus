
import { useState } from "react";
import { useWbjeeReferenceMaps } from "@/hooks/useWbjeeColumnLookup";
import { expectedCutoffsColumns } from "@/components/WbjeeColumnMapper";

// Improved parser: detects comma, tab, or 2+ spaces, and trims empty lines
export function parseFlexibleCSV(text: string) {
  let lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { rows: [], headers: [] };

  // Try comma, tab, and 2+ spaces
  let delimiter = ",";
  if (lines[0].includes("\t")) delimiter = "\t";
  else if (lines[0].match(/ {2,}/)) delimiter = "  "; // two or more spaces as delimiter
  // If first line has only one column but line contains commas inside quotes, try to split with regex.
  let headers = [];
  let rows = [];
  // RegExp to split commas but ignore those inside quotes:
  const smartSplit = (str: string) => {
    // Matches quoted OR unquoted fields
    const re = /(".*?"|[^",\s]+)(?=\s*[, ]|\s*$)/g;
    return [...str.matchAll(re)].map(m => m[0].replace(/^"|"$/g, ""));
  };
  
  // Prefer csv's built-in splitting if commas/tabs
  if (delimiter === ",") {
    // Try to handle quoted values with commas
    headers = lines[0].includes('"') ? smartSplit(lines[0]) : lines[0].split(",");
    rows = lines.slice(1).map(line => {
      let arr = line.includes('"') ? smartSplit(line) : line.split(",");
      // If not enough columns, try fallback to splitting on multiple spaces
      if (arr.length < headers.length && line.match(/ {2,}/)) {
        arr = line.split(/ {2,}/).map(v => v.trim());
      }
      return Object.fromEntries(headers.map((h, i) => [h.trim(), (arr[i] ?? "").trim()]));
    });
  } else if (delimiter === "\t") {
    headers = lines[0].split("\t").map(h => h.trim());
    rows = lines.slice(1).map(line => {
      const arr = line.split("\t").map(v => v.trim());
      return Object.fromEntries(headers.map((h, i) => [h, arr[i]]));
    });
  } else if (delimiter === "  ") {
    headers = lines[0].split(/ {2,}/).map(h => h.trim());
    rows = lines.slice(1).map(line => {
      const arr = line.split(/ {2,}/).map(v => v.trim());
      return Object.fromEntries(headers.map((h, i) => [h, arr[i]]));
    });
  }
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
