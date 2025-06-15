
/**
 * Supabase Edge Function: wbjee-scrape
 * Fetches NIC WBJEE cutoff tables server-side, parses HTML, returns cutoffs as structured JSON.
 * POST { url: string }
 * Returns: { success: boolean, cutoffs?: ParsedNicCutoff[], error?: string }
 */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type ParsedCutoffRow = {
  college_name: string;
  branch_name: string;
  year: number;
  round: number;
  category: string;
  opening_rank: number;
  closing_rank: number;
  domicile: string;
  quota: string;
};

const EXPECTED_HEADERS = [
  "s.no",
  "round",
  "institute",
  " program", // note space intentional for partial match
  "stream",
  "seat",
  "quota",
  "category",
  "opening",
  "closing",
];

// Utility: Find header index by variant names
function findColIdx(
  headers: string[],
  variants: string[]
): number {
  for (let i = 0; i < headers.length; i++) {
    const sanitized = headers[i].replace(/\s+/g, " ").replace(/[^\w\s]/g, "").toLowerCase();
    for (const v of variants) {
      if (sanitized.includes(v)) return i;
    }
  }
  return -1;
}

function parseNicCutoffTable(html: string, year: number): ParsedCutoffRow[] {
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const tables = html.match(tableRegex);
  if (!tables) return [];
  let result: ParsedCutoffRow[] = [];
  let tableCounter = 0;

  for (const tableHtml of tables) {
    tableCounter++;
    // 1. Extract all <th> headers (first <tr>)
    const headerMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (!headerMatch) {
      console.log(`Table #${tableCounter} skipped: no header row`);
      continue;
    }
    // Raw headers
    const headers = [
      ...headerMatch[1].matchAll(/<th[^>]*>(.*?)<\/th>/gi),
    ].map((m) =>
      m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase()
    );

    // Logging headers for debug
    console.log(`Table #${tableCounter} headers:`, headers);

    // Flexible mapping
    const idx = {
      serial: findColIdx(headers, ["s.no", "sno", "sl", "serial"]),
      round: findColIdx(headers, ["round"]),
      college_name: findColIdx(headers, ["institute", "college", "institution"]),
      branch_name: findColIdx(headers, ["program", "course", "branch"]),
      stream: findColIdx(headers, ["stream"]),
      seat_type: findColIdx(headers, ["seat type", "seat"]),
      quota: findColIdx(headers, ["quota"]),
      category: findColIdx(headers, ["category", "cat"]),
      opening_rank: findColIdx(headers, ["opening", "open"]),
      closing_rank: findColIdx(headers, ["closing", "close"]),
    };

    // Basic required columns
    if (
      idx.college_name === -1 ||
      idx.branch_name === -1 ||
      idx.opening_rank === -1 ||
      idx.closing_rank === -1 ||
      idx.round === -1 ||
      idx.category === -1
    ) {
      console.log(
        `Table #${tableCounter} skipped: required columns missing`,
        idx
      );
      continue;
    }

    // 2. Extract rows - skip the first header row
    const dataRows = [
      ...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi),
    ].slice(1);

    let rowErrors = 0;
    for (const [rIdx, dr] of dataRows.entries()) {
      // Handle <td>
      const cols = [
        ...dr[1].matchAll(/<td[^>]*>(.*?)<\/td>/gi),
      ].map((m) =>
        m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      );

      if (
        cols.length < Object.values(idx).reduce((a, b) => Math.max(a, b), 0) + 1
      ) {
        // If a row has fewer cols than the highest header index, skip with log
        console.log(
          `Row #${rIdx + 1} skipped: not enough columns. Got ${cols.length}, needed ${
            Object.values(idx).reduce((a, b) => Math.max(a, b), 0) + 1
          }`
        );
        rowErrors++;
        continue;
      }

      try {
        // Flexible mapping using indices
        const row: ParsedCutoffRow = {
          college_name: cols[idx.college_name] || "",
          branch_name: cols[idx.branch_name] || "",
          year: year,
          round: Number(cols[idx.round] || "1") || 1,
          category: cols[idx.category] || "",
          opening_rank: Number(
            (cols[idx.opening_rank] || "").replace(/,/g, "")
          ) || 0,
          closing_rank: Number(
            (cols[idx.closing_rank] || "").replace(/,/g, "")
          ) || 0,
          domicile: "Home",
          quota: cols[idx.quota] || "",
        };

        // Required fields sanity
        if (
          !row.college_name ||
          !row.branch_name ||
          !row.category ||
          !row.closing_rank
        ) {
          console.log(
            `Row #${rIdx + 1} skipped: missing key field`,
            row
          );
          rowErrors++;
          continue;
        }
        result.push(row);
      } catch (e) {
        console.log(`Row #${rIdx + 1} error:`, e);
        rowErrors++;
      }
    }

    console.log(
      `Parsed table #${tableCounter}: rows=${dataRows.length}, valid=${result.length}, errors=${rowErrors}`
    );
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
          error: "No cutoff data found in page. (Debug: Table not found or structure changed? Check logs for more details.)"
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
