import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WbjeeColumnMapper, { expectedCutoffsColumns } from "@/components/WbjeeColumnMapper";
import { useWbjeeCutoffImport } from "@/hooks/useWbjeeCutoffImport";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WbjeeImportTableSelect from "./WbjeeImportTableSelect";
import WbjeeImportTabs from "./WbjeeImportTabs";

console.log("[WbjeeDataImportPanel] Loaded for JSX error diagnosis");

const tableOptions = [
  {
    value: "wbjee_colleges",
    label: "Colleges",
    example: [
      {
        name: "Jadavpur University",
        type: "Government",
        location: "Kolkata",
        district: "Kolkata",
        description: "Top government engineering college in West Bengal.",
        website_url: "https://jaduniv.edu.in",
        logo_url: "",
        established: 1955,
        phone: "033-2457-2227",
        email: "info@jaduniv.edu.in",
        address: "188 Raja S.C. Mallick Rd, Kolkata, WB 700032",
      },
    ],
  },
  {
    value: "wbjee_branches",
    label: "Branches/Seats",
    example: [
      {
        college_id: "uuid-of-college", // Replace with real UUID
        branch_name: "Computer Science",
        degree: "BTech",
        intake: 60,
        is_core: true,
      },
    ],
  },
  {
    value: "wbjee_cutoffs",
    label: "Cutoffs",
    example: [
      {
        college_id: "Cooch Behar Government Engineering College, Cooch Behar", // Accepts name OR uuid
        branch_id: "Civil Engineering", // Accepts branch name OR uuid
        year: 2023,
        round: 1,
        category: "GEN",
        opening_rank: 24,
        closing_rank: 312,
        domicile: "Home",
        quota: "GMR"
      },
    ],
  },
];

export default function WbjeeDataImportPanel() {
  const [table, setTable] = useState(tableOptions[0].value);
  const [tab, setTab] = useState("csv");
  const [jsonText, setJsonText] = useState("");
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [parseAlert, setParseAlert] = useState<string | null>(null);

  const {
    csvText, setCsvText,
    parsedRows, setParsedRows,
    rawHeaders, setRawHeaders,
    columnMapping, setColumnMapping,
    showColumnMapper, setShowColumnMapper,
    handleCsvChange,
    transformRowsForDb,
  } = useWbjeeCutoffImport();

  const { toast } = useToast();

  const currentOption = tableOptions.find((t) => t.value === table);

  // Add helper to compute row mapping issues for cutoffs
  const unmatchedRows = useMemo(() => {
    if (!parsedRows.length || !showColumnMapper || table !== "wbjee_cutoffs") return [];
    const mapped = transformRowsForDb(parsedRows, columnMapping);
    return mapped
      .map((r, idx) => {
        let msgs: string[] = [];
        if (!r.college_id && r.college_name)
          msgs.push(`Row ${idx + 2}: College "${r.college_name}" not found`);
        if (!r.branch_id && r.branch_name)
          msgs.push(`Row ${idx + 2}: Branch "${r.branch_name}" not found`);
        return msgs;
      })
      .flat()
      .filter(Boolean);
  }, [parsedRows, showColumnMapper, table, columnMapping, transformRowsForDb]);

  // New: detect obvious parse errors and help the user
  React.useEffect(() => {
    if (tab === "csv" && csvText && rawHeaders.length === 1 && parsedRows.length > 0) {
      setParseAlert(
        "⚠️ Detected only one column header. Please make sure your data columns are separated by commas, tabs, or at least two spaces. Names with commas should be wrapped in quotes. Try using 'Cutoffs' table for WBJEE cutoffs."
      );
    } else {
      setParseAlert(null);
    }
  }, [tab, csvText, rawHeaders, parsedRows, table]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadResult(null);
    setLoading(true);
    setUploadWarnings([]);
    let records: any[] = [];
    try {
      if (tab === "csv") {
        if (showColumnMapper && parsedRows.length > 0 && table === "wbjee_cutoffs") {
          const mapped = transformRowsForDb(parsedRows, columnMapping);
          // Warn about unmatched IDs, but allow upload
          const unmapped = mapped.filter(r => !r.college_id || !r.branch_id);
          if (unmapped.length > 0) {
            setUploadWarnings([
              "Some rows could not match college/branch names to IDs.",
              "Upload will proceed with college/branch names only for those rows.",
              ...unmatchedRows,
              "Ensure mapping is correct or add the missing institutions/branches to the database first."
            ]);
          }
          records = mapped;
        } else {
          records = [];
        }
      } else {
        records = JSON.parse(jsonText);
        if (!Array.isArray(records)) throw new Error("JSON must be an array");
      }
      records = records.filter((r: any) => Object.values(r).some((v) => v));
      if (records.length === 0) throw new Error("No records to upload");
      const { error, count } = await supabase
        .from(table as "wbjee_colleges" | "wbjee_branches" | "wbjee_cutoffs")
        .insert(records, { count: "exact" });
      if (error) throw error;
      setUploadResult({
        success: true,
        message: `Successfully inserted ${count || records.length} records to ${table}`,
        inserted: count || records.length,
      });
      setCsvText("");
      setJsonText("");
      setShowColumnMapper(false);
      setParsedRows([]);
      setRawHeaders([]);
      setColumnMapping({});
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: "Upload failed",
        errors: [err.message || "Unknown error"],
      });
    }
    setLoading(false);
  }

  // Helper notice for correct table
  const showCutoffInputTip =
    tab === "csv" &&
    (csvText.startsWith("college_id") || csvText.match(/cutoff|rank/i)) &&
    table !== "wbjee_cutoffs";

  // Clean uploadResultErrorsList logic for clarity and to prevent JSX errors
  let uploadResultErrorsList: JSX.Element | null = null;
  if (
    uploadResult &&
    Array.isArray(uploadResult.errors) &&
    uploadResult.errors.length > 0
  ) {
    uploadResultErrorsList = (
      <ul className="ml-4 list-disc">
        {uploadResult.errors.map((e: string, i: number) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    );
  }

  // Main render
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Import Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUpload} className="space-y-4">
            <WbjeeImportTableSelect
              table={table}
              setTable={setTable}
              tableOptions={tableOptions}
              showCutoffInputTip={showCutoffInputTip}
            />
            {parseAlert && (
              <div className="bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 p-3 rounded text-sm mb-2">
                {parseAlert}
              </div>
            )}
            {showColumnMapper && table === "wbjee_cutoffs" && rawHeaders.length > 0 && (
              <WbjeeColumnMapper
                rawHeaders={rawHeaders}
                mapping={columnMapping}
                requiredColumns={expectedCutoffsColumns}
                onChange={setColumnMapping}
              />
            )}
            {uploadWarnings.length > 0 && (
              <div className="bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 p-3 rounded text-sm mb-2">
                <b>Mapping Warnings:</b>
                <ul className="list-disc ml-4">
                  {uploadWarnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <WbjeeImportTabs
              tab={tab}
              setTab={setTab}
              csvText={csvText}
              setCsvText={setCsvText}
              handleCsvChange={handleCsvChange}
              jsonText={jsonText}
              setJsonText={setJsonText}
              currentOption={currentOption}
            />
            <Button
              disabled={loading || (!csvText && !jsonText) || tab === "example"}
              type="submit"
              className="w-full"
            >
              {loading ? "Uploading..." : "Upload Data"}
            </Button>
          </form>
          {uploadResult && (
            <div
              className={`rounded p-3 mt-2 ${
                uploadResult.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <b>{uploadResult.message}</b>
              {uploadResultErrorsList}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
