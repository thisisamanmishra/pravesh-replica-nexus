
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { useScrapeNicWbjeeCutoff } from "@/hooks/useScrapeNicWbjeeCutoff";
import { supabase } from "@/integrations/supabase/client";

export default function WbjeeCutoffScraperPanel() {
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { loading: scraping, cutoffs, error: scrapeError, fetchCutoff } = useScrapeNicWbjeeCutoff();
  const [uploadResult, setUploadResult] = useState<any>(null);

  // New: Handler for scraping NIC cutoff data and importing to DB
  async function handleImportScraped() {
    setUploadResult(null);
    setLoading(true);
    try {
      const collegeName = cutoffs[0]?.college_name;
      const { data: colleges } = await supabase
        .from("wbjee_colleges")
        .select("*")
        .ilike("name", `%${collegeName}%`);
      if (!colleges || !colleges[0]?.id) throw new Error("College not found. Please add the college first.");
      const college_id = colleges[0].id;

      // Map each row to Supabase structure
      const records = cutoffs.map((c: any) => ({
        college_id,
        branch_id: null,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrape WBJEE NIC Website</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
                  {cutoffs.slice(0, 15).map((c: any, i: number) => (
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
                    {uploadResult.errors.map((e: string, i: number) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
