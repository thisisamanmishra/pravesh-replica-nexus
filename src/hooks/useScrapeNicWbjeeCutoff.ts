
import { useState } from "react";

export interface ParsedNicCutoff {
  college_name: string;
  branch_name: string;
  year: number;
  round: number;
  category: string;
  opening_rank: number;
  closing_rank: number;
  domicile: string;
  quota: string;
}

const PUBLIC_CORS_PROXY = "https://corsproxy.io/?";
const DEFAULT_YEAR = new Date().getFullYear();

function parseNicCutoffTable(html: string, year = DEFAULT_YEAR): ParsedNicCutoff[] {
  const dom = document.createElement('html');
  dom.innerHTML = html;

  const tables = dom.querySelectorAll("table");
  if (!tables || tables.length === 0) return [];

  let cutoffRows: ParsedNicCutoff[] = [];
  tables.forEach(table => {
    const headers = Array.from(table.querySelectorAll("tr th")).map(th =>
      th.textContent?.trim().toLowerCase() || ""
    );
    if (!headers.length || !headers.find(h => h.includes("closing"))) return;
    const rows = Array.from(table.querySelectorAll("tr")).slice(1); // skip header
    rows.forEach(tr => {
      const tds = Array.from(tr.querySelectorAll("td"));
      if (tds.length < 6) return;
      const [
        branch_name,
        category,
        quota,
        round,
        opening_rank,
        closing_rank
      ] = tds.map(td => td.textContent?.trim() ?? "");

      if (!branch_name || !category || !closing_rank) return;
      cutoffRows.push({
        college_name: "", // To be filled by page title
        branch_name,
        year,
        round: Number(round) || 1,
        category,
        opening_rank: Number(opening_rank) || 0,
        closing_rank: Number(closing_rank) || 0,
        domicile: "Home", // NIC usually gives Home only
        quota,
      });
    });
  });

  // Try to get college name from document title/h1
  let collegeName = "";
  const h1 = dom.querySelector('h1')?.textContent?.trim();
  if (h1) collegeName = h1;
  else {
    const title = dom.querySelector('title')?.textContent?.trim();
    if (title) collegeName = title;
  }
  cutoffRows.forEach(c => (c.college_name = collegeName || "WBJEE College"));

  return cutoffRows;
}

export function useScrapeNicWbjeeCutoff() {
  const [loading, setLoading] = useState(false);
  const [cutoffs, setCutoffs] = useState<ParsedNicCutoff[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchCutoff(url: string, year?: number) {
    setLoading(true);
    setCutoffs([]);
    setError(null);
    try {
      const resp = await fetch(PUBLIC_CORS_PROXY + encodeURIComponent(url));
      const html = await resp.text();
      const parsed = parseNicCutoffTable(html, year);
      if (!parsed.length) throw new Error("No cutoff data found.");
      setCutoffs(parsed);
      return parsed;
    } catch (e: any) {
      setError(e.message || "Failed to scrape data.");
      setCutoffs([]);
    } finally {
      setLoading(false);
    }
  }

  return { loading, cutoffs, error, fetchCutoff };
}
