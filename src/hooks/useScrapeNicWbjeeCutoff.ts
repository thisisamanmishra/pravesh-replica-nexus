
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

const SUPABASE_EDGE_SCRAPER = "https://ibejltntfexvnwwjqbts.functions.supabase.co/wbjee-scrape";
const DEFAULT_YEAR = new Date().getFullYear();

export function useScrapeNicWbjeeCutoff() {
  const [loading, setLoading] = useState(false);
  const [cutoffs, setCutoffs] = useState<ParsedNicCutoff[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchCutoff(url: string, year?: number) {
    setLoading(true);
    setCutoffs([]);
    setError(null);

    try {
      const resp = await fetch(SUPABASE_EDGE_SCRAPER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, year: year || DEFAULT_YEAR }),
      });
      const data = await resp.json();
      if (!data.success) throw new Error(data.error || "Failed scraping cutoff");
      setCutoffs(data.cutoffs);
      return data.cutoffs;
    } catch (e: any) {
      setError(e.message || "Failed to scrape data.");
      setCutoffs([]);
    } finally {
      setLoading(false);
    }
  }

  return { loading, cutoffs, error, fetchCutoff };
}
