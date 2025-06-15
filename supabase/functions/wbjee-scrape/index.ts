/**
 * Supabase Edge Function: wbjee-scrape
 * Fetches NIC WBJEE cutoff tables server-side, parses HTML, returns cutoffs as structured JSON.
 * POST { url: string }
 * Returns: { success: boolean, cutoffs?: ParsedNicCutoff[], error?: string }
 */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Updated parser for the new WBJEE cutoff table structure
function parseNicCutoffTable(html: string, year: number): any[] {
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const tables = html.match(tableRegex);
  if (!tables) return [];
  let result: any[] = [];

  for (const tableHtml of tables) {
    // Extract table header row (assume first <tr>)
    const headerMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (!headerMatch) continue;
    const headers = [...headerMatch[1].matchAll(/<th[^>]*>(.*?)<\/th>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim().toLowerCase()
    );

    // We only want tables with at least these columns in any order:
    if (
      !(
        headers.includes("institute") &&
        headers.includes("program") &&
        headers.includes("opening rank") &&
        headers.includes("closing rank")
      )
    ) {
      continue;
    }
    // Extract data rows (after first tr)
    const dataRows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].slice(1); // skip header
    for (const dr of dataRows) {
      const cols = [...dr[1].matchAll(/<td[^>]*>(.*?)<\/td>/gi)].map((m) =>
        m[1].replace(/<[^>]+>/g, "").trim()
      );
      if (cols.length < 10) continue;
      // Expected order:
      // 0: S.No, 1: Round, 2: Institute, 3: Program, 4: Stream, 5: Seat Type, 6: Quota, 7: Category, 8: Opening Rank, 9: Closing Rank
      const [
        _serial,          // 0
        round,            // 1
        college_name,     // 2
        branch_name,      // 3 (Program)
        _stream,          // 4
        _seat_type,       // 5
        quota,            // 6
        category,         // 7
        opening_rank,     // 8
        closing_rank      // 9
      ] = cols;
      if (!college_name || !branch_name || !category || !closing_rank) continue;
      result.push({
        college_name: college_name,
        branch_name: branch_name,
        year: year,
        round: Number(round) || 1,
        category: category,
        opening_rank: Number(opening_rank) || 0,
        closing_rank: Number(closing_rank) || 0,
        domicile: "Home",
        quota: quota,
      });
    }
  }
  return result;
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Only POST allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { url, year } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Missing required 'url' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WBJEE-Edge-Scraper/1.0; +https://wbjee.nic.in/)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch (${resp.status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const html = await resp.text();
    const cutoffRows = parseNicCutoffTable(html, year || new Date().getFullYear());
    if (!cutoffRows.length) {
      // Add debug: try to show why parser failed
      console.log("WBJEE Scrape Debug: No cutoff data found.");
      // Output first few chars of HTML for debugging (avoid logging too much)
      console.log("WBJEE Scrape Debug: Fetched HTML (truncated):", html.slice(0, 500));
      return new Response(
        JSON.stringify({
          success: false,
          error: "No cutoff data found in page. (Debug: Table not found or structure changed?)"
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, cutoffs: cutoffRows }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.log("WBJEE Scrape Debug: Fatal error", e);
    return new Response(
      JSON.stringify({ success: false, error: e.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
