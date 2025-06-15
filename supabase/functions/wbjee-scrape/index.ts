/**
 * Supabase Edge Function: wbjee-scrape
 * Fetches NIC WBJEE cutoff tables server-side, parses HTML, returns cutoffs as structured JSON.
 * POST { url: string }
 * Returns: { success: boolean, cutoffs?: ParsedNicCutoff[], error?: string }
 */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Minimal table parser for NIC WBJEE site
function parseNicCutoffTable(html: string, year: number): any[] {
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  let collegeName = h1Match ? h1Match[1].trim() : "";
  if (!collegeName) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) collegeName = titleMatch[1].trim();
  }
  const tables = html.match(tableRegex);
  if (!tables) return [];
  let result: any[] = [];
  const closingHeadIdx = ["closing rank", "closing", "closing rank(gmr)", "closing(gmr)","closing rank (gmr)"];

  for (const tableHtml of tables) {
    // Extract table header row (assume first <tr>)
    const headerMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (!headerMatch) continue;
    const headers = [...headerMatch[1].matchAll(/<th[^>]*>(.*?)<\/th>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim().toLowerCase()
    );
    if (!headers.length || !headers.find((h) => closingHeadIdx.some((key) => h.includes(key)))) continue;
    // Extract table data rows (after first tr)
    const dataRows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].slice(1);
    for (const dr of dataRows) {
      const cols = [...dr[1].matchAll(/<td[^>]*>(.*?)<\/td>/gi)].map((m) =>
        m[1].replace(/<[^>]+>/g, "").trim()
      );
      // Minimum columns: branch, cat, quota, round, open, close
      if (cols.length < 6) continue;
      const [
        branch_name,
        category,
        quota,
        round,
        opening_rank,
        closing_rank
      ] = cols;
      if (!branch_name || !category || !closing_rank) continue;
      result.push({
        college_name: collegeName || "WBJEE College",
        branch_name,
        year: year,
        round: Number(round) || 1,
        category,
        opening_rank: Number(opening_rank) || 0,
        closing_rank: Number(closing_rank) || 0,
        domicile: "Home",
        quota
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
