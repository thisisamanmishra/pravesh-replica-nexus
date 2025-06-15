import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useScrapeNicWbjeeCutoff } from "@/hooks/useScrapeNicWbjeeCutoff";
import { useToast } from "@/hooks/use-toast";

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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadResult(null);
    setLoading(true);
    let records: any[] = [];
    try {
      if (tab === "csv") {
        records = parseCSV(csvText);
      } else {
        records = JSON.parse(jsonText);
        if (!Array.isArray(records)) throw new Error("JSON must be an array");
      }
      // Remove empty records
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
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Paste CSV here..."
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
