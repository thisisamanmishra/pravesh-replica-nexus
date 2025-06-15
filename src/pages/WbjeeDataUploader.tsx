import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useScrapeNicWbjeeCutoff } from "@/hooks/useScrapeNicWbjeeCutoff";
import { useToast } from "@/hooks/use-toast";
import WbjeeColumnMapper from "@/components/WbjeeColumnMapper";
import { useWbjeeReferenceMaps } from "@/hooks/useWbjeeColumnLookup";

interface UploadResult {
  success: boolean;
  message: string;
  inserted?: number;
  errors?: string[];
}

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
        college_id: "uuid-of-college", // Replace with real UUID
        branch_id: "uuid-of-branch", // Replace with real UUID
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

// Add expected columns for the cutoffs upload
const expectedCutoffsColumns = [
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

function parseCSV(text: string) {
  const [headerLine, ...lines] = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const headers = headerLine.split(",").map((h) => h.trim());
  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}

function parseFlexibleCSV(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { rows: [], headers: [] };
  // Split on comma or tab. Assume all rows use the same delimiter.
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
  return { rows, headers };
}

// Add to main component
export default function WbjeeDataUploader() {
  const { user, isAdmin } = useAuth();
  const [table, setTable] = useState(tableOptions[0].value);
  const [tab, setTab] = useState("csv");
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeTab, setScrapeTab] = useState("csv"); // csv, json, example, scrape
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const { loading: scraping, cutoffs, error: scrapeError, fetchCutoff } = useScrapeNicWbjeeCutoff();
  const { toast } = useToast();

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Only</CardTitle>
          </CardHeader>
          <CardContent>
            You must be an admin to use this page.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Bring in the lookup maps for college and branch names
  const { collegeNameToId, branchNameToId, collegesLoading, branchesLoading } = useWbjeeReferenceMaps();

  // Helper to normalize CSV headers (trim, keep original case)
  function guessMap(headers: string[]) {
    // Do very basic best-match suggestion
    const mapping: Record<string, string> = {};
    for (const field of expectedCutoffsColumns) {
      // try exact, then fuzzy (ignoring case/space)
      let match = headers.find(h => h.replace(/[^a-zA-Z]/g, "").toLowerCase() === field.label.replace(/[^a-zA-Z]/g, "").toLowerCase());
      if (!match) {
        // try by keywords
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

  // Intercept CSV paste to suggest mapping if columns don't match
  function onCsvTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCsvText(e.target.value);
    const { rows, headers } = parseFlexibleCSV(e.target.value);
    setParsedRows(rows);
    setRawHeaders(headers);
    setColumnMapping(guessMap(headers));
    setShowColumnMapper(true); // always show on parse now
  }

  // Prepare data using column mapping and lookups
  function transformRowsForDb(rows: any[], mapping: Record<string, string>) {
    return rows.map(row => {
      // College/branch id lookup
      const collegeName = row[mapping["college_id"]]?.toLowerCase().trim();
      const branchName = row[mapping["branch_id"]]?.toLowerCase().trim();
      const college_id = collegeNameToId[collegeName] || null;
      const branch_id = branchNameToId[branchName] || null;
      // Parse numbers
      const opening_rank = Number(row[mapping["opening_rank"]] ?? "") || null;
      const closing_rank = Number(row[mapping["closing_rank"]] ?? "") || null;

      // Domicile fallback
      let domicile = row[mapping["domicile"]];
      if (!domicile && row["Quota"]?.toLowerCase().includes("home")) {
        domicile = "Home";
      }

      // Round/year fallback (can prompt user to add later)
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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadResult(null);
    setLoading(true);
    let records: any[] = [];
    try {
      if (tab === "csv") {
        // If mapping is set, use enhanced parser & mapping
        if (showColumnMapper && parsedRows.length > 0 && table === "wbjee_cutoffs") {
          const mapped = transformRowsForDb(parsedRows, columnMapping);
          // Warn about missing college/branch IDs
          if (mapped.some(r => !r.college_id || !r.branch_id)) {
            setUploadResult({
              success: false,
              message: "Upload failed",
              errors: [
                "Some rows could not match college/branch names to IDs.",
                "Check mapping or add the required institutions/branches first.",
              ],
            });
            setLoading(false);
            return;
          }
          records = mapped;
        } else {
          // Legacy: use built-in CSV parser
          records = parseCSV(csvText);
        }
      } else {
        records = JSON.parse(jsonText);
        if (!Array.isArray(records)) throw new Error("JSON must be an array");
      }
      records = records.filter((r) => Object.values(r).some((v) => v));
      if (records.length === 0) throw new Error("No records to upload");
      // Insert to Supabase
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

  // New: Handler for scraping NIC cutoff data and importing to DB
  async function handleImportScraped() {
    setUploadResult(null);
    setLoading(true);
    try {
      // Query for the selected college in wbjee_colleges table
      const collegeName = cutoffs[0]?.college_name;
      const { data: colleges } = await supabase
        .from("wbjee_colleges")
        .select("*")
        .ilike("name", `%${collegeName}%`);
      if (!colleges || !colleges[0]?.id) throw new Error("College not found. Please add the college first.");
      const college_id = colleges[0].id;

      // Map each row to Supabase structure
      const records = cutoffs.map(c => ({
        college_id,
        branch_id: null, // Optional: enhance by mapping branch
        year: c.year,
        round: c.round,
        category: c.category,
        opening_rank: c.opening_rank,
        closing_rank: c.closing_rank,
        domicile: c.domicile,
        quota: c.quota,
      }));

      const { error, count } = await supabase
        .from("wbjee_cutoffs")
        .insert(records, { count: "exact" });

      if (error) throw error;
      setUploadResult({
        success: true,
        message: `Imported ${count || records.length} cutoffs for ${collegeName}`,
        inserted: count || records.length,
      });
      setScrapeUrl("");
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: "Import failed",
        errors: [err.message || "Unknown error"],
      });
    }
    setLoading(false);
  }

  const currentOption = tableOptions.find((t) => t.value === table);

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-2xl mx-auto my-12">
        <Card>
          <CardHeader>
            <CardTitle>WBJEE Data Uploader (Admin Only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleUpload} className="space-y-4">
              {/* Add data source selection between CSV/JSON/Example/Scrape NIC */}
              <label className="block font-medium mb-1">
                Select Table
                <select
                  className="mt-1 w-full rounded px-3 py-2 border border-gray-300"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  disabled={scrapeTab === "scrape"}
                >
                  {tableOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              {/* column mapper preview (shown for cutoffs/csv) */}
              {showColumnMapper && table === "wbjee_cutoffs" && rawHeaders.length > 0 && (
                <WbjeeColumnMapper
                  rawHeaders={rawHeaders}
                  mapping={columnMapping}
                  requiredColumns={expectedCutoffsColumns}
                  onChange={setColumnMapping}
                />
              )}
              <Tabs value={scrapeTab} onValueChange={setScrapeTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="csv">Paste CSV</TabsTrigger>
                  <TabsTrigger value="json">Paste JSON</TabsTrigger>
                  <TabsTrigger value="example">Show Example</TabsTrigger>
                  <TabsTrigger value="scrape">Scrape WBJEE NIC Website</TabsTrigger>
                </TabsList>
                <TabsContent value="csv">
                  <textarea
                    className="w-full min-h-[180px] font-mono rounded border px-2 py-1"
                    value={csvText}
                    onChange={onCsvTextChange}
                    placeholder="Paste CSV (or Excel as CSV) here..."
                  />
                </TabsContent>
                <TabsContent value="json">
                  <textarea
                    className="w-full min-h-[180px] font-mono rounded border px-2 py-1"
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='Paste a JSON array of objects like [{"name":"College", ...}]'
                  />
                </TabsContent>
                <TabsContent value="example">
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(currentOption?.example, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="scrape">
                  <div className="space-y-2">
                    <label className="block font-medium mb-1">
                      WBJEE NIC Cutoff Page URL
                      <input
                        type="url"
                        className="w-full mt-1 rounded px-3 py-2 border border-gray-300"
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        placeholder="https://admissions.nic.in/admiss/admissions/orcrjacd/134112421"
                        disabled={scraping}
                      />
                    </label>
                    <Button
                      type="button"
                      disabled={!scrapeUrl || scraping}
                      onClick={() => fetchCutoff(scrapeUrl)}
                    >
                      {scraping ? "Scraping..." : "Scrape Data"}
                    </Button>
                    {scrapeError && (
                      <div className="my-2 text-sm text-red-600">{scrapeError}</div>
                    )}
                    {cutoffs.length > 0 && (
                      <div className="my-2">
                        <h4 className="font-semibold mb-2">
                          Preview: {cutoffs.length} rows
                        </h4>
                        <div className="max-h-48 overflow-y-auto border rounded bg-gray-50 text-xs">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th>Branch</th>
                                <th>Cat</th>
                                <th>Round</th>
                                <th>Quota</th>
                                <th>Open</th>
                                <th>Close</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cutoffs.slice(0, 15).map((c, i) => (
                                <tr key={i}>
                                  <td>{c.branch_name}</td>
                                  <td>{c.category}</td>
                                  <td>{c.round}</td>
                                  <td>{c.quota}</td>
                                  <td>{c.opening_rank}</td>
                                  <td>{c.closing_rank}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button
                          type="button"
                          className="mt-2 w-full"
                          onClick={handleImportScraped}
                          disabled={loading}
                        >
                          {loading ? "Importing..." : "Import To Database"}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              {/* Only show for non-scrape tabs */}
              {scrapeTab !== "scrape" && (
                <Button
                  disabled={loading || (!csvText && !jsonText) || scrapeTab === "example"}
                  type="submit"
                  className="w-full"
                >
                  {loading ? "Uploading..." : "Upload Data"}
                </Button>
              )}
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
                {uploadResult.errors?.length && (
                  <ul className="ml-4 list-disc">
                    {uploadResult.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
